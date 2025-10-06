import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PersianDate, User } from '@rahino/database';
import {
  ECInventory,
  ECLogistic,
  ECLogisticSendingPeriod,
  ECLogisticShipmentWay,
  ECLogisticWeeklyPeriod,
  ECLogisticWeeklyPeriodTime,
  ECOrderShipmentWay,
  ECProduct,
  ECScheduleSendingType,
  ECStock,
  ECLogisticOrderGrouped,
  ECUserSession,
  ECVendor,
  ECVendorLogistic,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, QueryTypes } from 'sequelize';
import { ClientLogisticPeriodDto } from './dto';
import { AddressService } from '@rahino/ecommerce/user/address/address.service';
import { ClientValidateAddressService } from '../validate-address/client-validate-address.service';
import { ClientShipmentPriceService } from '../shipment-price/shipment-price.service';
import {
  OrderShipmentwayEnum,
  ScheduleSendingTypeEnum,
} from '@rahino/ecommerce/shared/enum';

@Injectable()
export class LogisticPeriodService {
  constructor(
    @InjectModel(ECStock)
    private readonly stockRepository: typeof ECStock,
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    @InjectModel(ECLogisticShipmentWay)
    private readonly logisticShipmentWayRepository: typeof ECLogisticShipmentWay,
    @InjectModel(ECLogisticOrderGrouped)
    private readonly logisticOrderGroupedRepository: typeof ECLogisticOrderGrouped,
    private readonly addressService: AddressService,
    private readonly clientValidateAddressService: ClientValidateAddressService,
    private readonly clientShipmentPriceService: ClientShipmentPriceService,
  ) {}

  async getDeliveryOptions(
    user: User,
    session: ECUserSession,
    dto: ClientLogisticPeriodDto,
  ) {
    const { userAddress, stocks } = await this.loadUserAddressAndStocks(
      user,
      session,
      dto.addressId,
    );

    const logisticIds = [
      ...new Set(
        stocks.map((stock) => stock.inventory.vendor.vendorLogistic.logisticId),
      ),
    ];
    const shipmentWays = await this.loadShipmentWaysForAddress(
      userAddress,
      logisticIds,
    );

    const { currentDate, startOfWindow, endDate, endOfWindow, persianDates } =
      await this.getDateWindowAndPersianDates();

    const { groups, typeInfoMap, uniqueTypeIdsMap } =
      this.computeGroupsMeta(stocks);

    // Populate sendingOptions for each group
    for (const logisticId in groups) {
      const group = groups[logisticId];
      const groupStocks = group.stocks;
      const uniqueTypeIds = Array.from(
        uniqueTypeIdsMap[Number(logisticId)] as Set<number>,
      ) as number[];
      const typeInfo = typeInfoMap[Number(logisticId)];

      for (const typeId of uniqueTypeIds) {
        const info = typeInfo[typeId as number];

        const relevantShipmentWays = shipmentWays.filter(
          (sw) => Number(sw.logisticId) == Number(logisticId),
        );

        // Compute extra inventory-level offset for stocks that support this type (either direct or via parent)
        const supportedStocksForType = groupStocks.filter(
          (stock) =>
            stock.inventory.scheduleSendingTypeId === typeId ||
            stock.inventory.scheduleSendingType.parentId === typeId,
        );
        const extraInventoryOffset = supportedStocksForType.length
          ? Math.max(
              ...supportedStocksForType.map((s) =>
                Number(s.inventory.offsetDay || info.offsetDay),
              ),
            )
          : 0;
        const offsetDay = extraInventoryOffset || info.offsetDay || 0;
        const shipmentWaysOutput = relevantShipmentWays
          .filter(
            (z) =>
              (z.sendingPeriods.length == 0 &&
                typeId == ScheduleSendingTypeEnum.normalSending) ||
              (z.sendingPeriods.length > 0 &&
                z.sendingPeriods.findIndex(
                  (s) => s.scheduleSendingTypeId == typeId,
                ) != -1),
          )
          .map((shipmentWay) => {
            const possibleDates = this.buildPossibleDates(
              shipmentWay,
              typeId,
              persianDates,
              currentDate,
              offsetDay,
            );
            const shipmentStocks = groupStocks.map((s) => ({
              weight: Number(s.product?.weight || 0),
              qty: Number(s.qty || 0),
              freeShipment: false,
              totalPrice: 0,
            }));
            // Prefer calSelections to consider schedule sending type (normal/express) via sendingPeriodId
            const inferredSendingPeriodId =
              (shipmentWay?.sendingPeriods || []).find(
                (sp: any) =>
                  Number(sp.scheduleSendingTypeId) === Number(typeId),
              )?.id ?? null;

            const groupsInput = [
              {
                logisticId: Number(logisticId) as any,
                shipmentWayId: Number(shipmentWay.id) as any,
                shipmentWayType: Number(
                  shipmentWay.orderShipmentWay.id,
                ) as OrderShipmentwayEnum,
                sendingPeriodId: inferredSendingPeriodId,
                weeklyPeriodId: null,
                weeklyPeriodTimeId: null,
                stocks: shipmentStocks,
              },
            ];

            const priceData = {
              shipmentWayId: Number(shipmentWay.id),
              orderShipmentwayId: Number(shipmentWay.orderShipmentWayId),
              shipmentWayName: shipmentWay.orderShipmentWay.name,
              shipmentWayIcon: shipmentWay.orderShipmentWay.icon,
              possibleDates,
            } as any;

            return this.clientShipmentPriceService
              .calSelections(groupsInput as any, dto.addressId as any)
              .then((sp) => {
                const g0 = (sp?.groups || [])[0] as any;
                return {
                  ...priceData,
                  price: Number(g0?.price || 0),
                  realShipmentPrice: Number(g0?.realShipmentPrice || 0),
                };
              });
          });

        let bestSelection = null;
        let earliestDate = null;
        let earliestStartTime = null;

        const shipmentWaysResolved = await Promise.all(shipmentWaysOutput);
        await this.capacityFilterShipmentWays(
          shipmentWaysResolved,
          startOfWindow,
          endOfWindow,
        );

        bestSelection = this.pickBestSelectionFromWays(shipmentWaysResolved);

        if (!bestSelection && shipmentWaysResolved.length > 0) {
          bestSelection = {
            shipmentWayId: Number(shipmentWaysResolved[0].shipmentWayId),
          };
        }

        const supportedStocks = groupStocks.filter(
          (stock) =>
            stock.inventory.scheduleSendingTypeId === typeId ||
            stock.inventory.scheduleSendingType.parentId === typeId,
        );

        const supportedStockIds = supportedStocks.map((stock) =>
          Number(stock.id),
        );

        const hasTypeId = relevantShipmentWays.some((shipment) =>
          shipment.sendingPeriods.some(
            (period) => period.scheduleSendingTypeId === typeId,
          ),
        );

        if (!hasTypeId) {
          continue;
        }

        group.sendingOptions.push({
          typeId,
          typeName:
            typeId == ScheduleSendingTypeEnum.expressSending
              ? 'ارسال اکسپرس(پس کرایه)'
              : info.name,
          typeIcon: info.icon,
          shipmentWays: shipmentWaysResolved,
          bestSelection,
          supportedStockIds,
        });
      }
    }

    const result = Object.values(groups);

    return {
      result,
    };
  }

  // region helpers
  private async loadUserAddressAndStocks(
    user: User,
    session: ECUserSession,
    addressId: bigint,
  ) {
    const { result: userAddress } = await this.addressService.findById(
      user,
      addressId,
    );

    const stocks = await this.stockRepository.findAll(
      new QueryOptionsBuilder()
        .attributes(['id', 'inventoryId', 'productId', 'qty'])
        .filter({ sessionId: session.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .filter({ expire: { [Op.gt]: Sequelize.fn('getdate') } })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isPurchase'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .include([
          {
            model: ECProduct,
            as: 'product',
            attributes: ['id', 'title', 'slug', 'entityTypeId', 'weight'],
          },
          {
            model: ECInventory,
            as: 'inventory',
            attributes: [
              'id',
              'vendorId',
              'scheduleSendingTypeId',
              'onlyProvinceId',
              'offsetDay',
            ],
            include: [
              {
                model: ECScheduleSendingType,
                as: 'scheduleSendingType',
                attributes: ['id', 'parentId', 'title', 'icon', 'offsetDay'],
                include: [
                  {
                    model: ECScheduleSendingType,
                    as: 'parent',
                    attributes: ['id', 'title', 'icon', 'offsetDay'],
                  },
                ],
              },
              {
                model: ECVendor,
                as: 'vendor',
                attributes: ['id', 'name', 'slug'],
                include: [
                  {
                    model: ECVendorLogistic,
                    as: 'vendorLogistic',
                    attributes: ['logisticId'],
                    where: {
                      isDefault: true,
                      [Op.and]: [
                        Sequelize.where(
                          Sequelize.fn(
                            'isnull',
                            Sequelize.col(
                              'inventory.vendor.vendorLogistic.isDeleted',
                            ),
                            0,
                          ),
                          { [Op.eq]: 0 },
                        ),
                      ],
                    },
                    required: true,
                    include: [
                      {
                        model: ECLogistic,
                        as: 'logistic',
                        attributes: ['id', 'title'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ])
        .build(),
    );

    await this.clientValidateAddressService.validateAddress({
      address: userAddress,
      stocks,
    });

    return { userAddress, stocks };
  }

  private async loadShipmentWaysForAddress(
    userAddress: any,
    logisticIds: any[],
  ) {
    return this.logisticShipmentWayRepository.findAll(
      new QueryOptionsBuilder()
        .filter({
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECLogisticShipmentWay.isDeleted'),
                0,
              ),
              { [Op.eq]: 0 },
            ),
            { provinceId: userAddress.provinceId },
            { logisticId: { [Op.in]: logisticIds } },
          ],
        })
        .attributes(['id', 'orderShipmentWayId', 'logisticId'])
        .include([
          {
            model: ECOrderShipmentWay,
            as: 'orderShipmentWay',
            attributes: ['id', 'name', 'icon'],
          },
          {
            model: ECLogisticSendingPeriod,
            as: 'sendingPeriods',
            required: false,
            attributes: ['id', 'startDate', 'endDate', 'scheduleSendingTypeId'],
            include: [
              {
                model: ECLogisticWeeklyPeriod,
                as: 'weeklyPeriods',
                where: [
                  Sequelize.where(
                    Sequelize.fn(
                      'isnull',
                      Sequelize.col('sendingPeriods.weeklyPeriods.isDeleted'),
                      0,
                    ),
                    { [Op.eq]: 0 },
                  ),
                ] as any,
                attributes: ['id', 'weekNumber'],
                include: [
                  {
                    model: ECLogisticWeeklyPeriodTime,
                    as: 'weeklyPeriodTimes',
                    where: [
                      Sequelize.where(
                        Sequelize.fn(
                          'isnull',
                          Sequelize.col(
                            'sendingPeriods.weeklyPeriods.weeklyPeriodTimes.isDeleted',
                          ),
                          0,
                        ),
                        { [Op.eq]: 0 },
                      ),
                    ] as any,
                    attributes: ['id', 'startTime', 'endTime', 'capacity'],
                  },
                ],
              },
            ],
            where: [
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('sendingPeriods.isDeleted'),
                  0,
                ),
                { [Op.eq]: 0 },
              ),
              Sequelize.where(Sequelize.fn('getdate'), {
                [Op.between]: [
                  Sequelize.col('sendingPeriods.startDate'),
                  Sequelize.col('sendingPeriods.endDate'),
                ],
              }),
            ],
          },
        ])
        .build(),
    );
  }

  private async getDateWindowAndPersianDates() {
    const currentDate = new Date();
    const startOfWindow = new Date(currentDate);
    startOfWindow.setHours(0, 0, 0, 0);
    const endDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const endOfWindow = new Date(endDate);
    endOfWindow.setHours(23, 59, 59, 999);
    const persianDates = await this.persianDateRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ GregorianDate: { [Op.gte]: currentDate, [Op.lte]: endDate } })
        .attributes([
          'GregorianDate',
          'YearMonthDay',
          'WeekDayName',
          'WeekDayNumber',
        ])
        .order({ orderBy: 'GregorianDate', sortOrder: 'ASC' })
        .build(),
    );
    return { currentDate, startOfWindow, endDate, endOfWindow, persianDates };
  }

  private computeGroupsMeta(stocks: ECStock[]) {
    const groups: any = {};
    const typeInfoMap: any = {};
    const uniqueTypeIdsMap: any = {};
    for (const stock of stocks) {
      const logisticId = stock.inventory.vendor.vendorLogistic.logisticId;
      const logisticName = stock.inventory.vendor.vendorLogistic.logistic.title;
      const vendorId = stock.inventory.vendorId;
      const vendorName = stock.inventory.vendor.name;
      const originalScheduleTypeId = stock.inventory.scheduleSendingTypeId;
      const originalScheduleTypeName =
        stock.inventory.scheduleSendingType.title;
      const originalScheduleTypeIcon = stock.inventory.scheduleSendingType.icon;
      const originalScheduleTypeOffsetDay =
        stock.inventory.scheduleSendingType.offsetDay;
      const parentScheduleTypeId = stock.inventory.scheduleSendingType.parentId;
      const parentScheduleTypeName = stock.inventory.scheduleSendingType.parent
        ? stock.inventory.scheduleSendingType.parent.title
        : null;
      const parentScheduleTypeIcon = stock.inventory.scheduleSendingType.parent
        ? stock.inventory.scheduleSendingType.parent.icon
        : null;
      const parentScheduleTypeOffsetDay = stock.inventory.scheduleSendingType
        .parent
        ? stock.inventory.scheduleSendingType.parent.offsetDay
        : null;

      if (!groups[Number(logisticId)]) {
        groups[Number(logisticId)] = {
          logisticId: Number(logisticId),
          logisticName,
          vendorIds: new Set(),
          vendorNames: new Set(),
          stocks: [],
          sendingOptions: [],
        };
        typeInfoMap[Number(logisticId)] = {};
        uniqueTypeIdsMap[Number(logisticId)] = new Set();
      }

      groups[Number(logisticId)].vendorIds.add(vendorId);
      groups[Number(logisticId)].vendorNames.add(vendorName);
      groups[Number(logisticId)].stocks.push(stock);

      uniqueTypeIdsMap[Number(logisticId)].add(originalScheduleTypeId);
      typeInfoMap[Number(logisticId)][originalScheduleTypeId] = {
        name: originalScheduleTypeName,
        icon: originalScheduleTypeIcon,
        offsetDay: originalScheduleTypeOffsetDay,
      };

      if (parentScheduleTypeId) {
        uniqueTypeIdsMap[Number(logisticId)].add(parentScheduleTypeId);
        typeInfoMap[Number(logisticId)][parentScheduleTypeId] = {
          name: parentScheduleTypeName,
          icon: parentScheduleTypeIcon,
          offsetDay: parentScheduleTypeOffsetDay,
        };
      }
    }
    return { groups, typeInfoMap, uniqueTypeIdsMap };
  }

  private buildPossibleDates(
    shipmentWay: any,
    typeId: number,
    persianDates: any[],
    currentDate: Date,
    offsetDay: number,
  ) {
    const relevantPeriods = shipmentWay.sendingPeriods.filter(
      (sp: any) => sp.scheduleSendingTypeId === typeId,
    );
    const offsetStartDate = new Date(
      currentDate.getTime() + offsetDay * 24 * 60 * 60 * 1000,
    );
    const possibleDates: any[] = [];
    for (const persianDate of persianDates) {
      const gregorianDate = new Date(persianDate.GregorianDate);
      if (gregorianDate < offsetStartDate) continue;
      const weekNumber = persianDate.WeekDayNumber;
      const times: any[] = [];
      for (const sendingPeriod of relevantPeriods) {
        if (sendingPeriod.startDate && gregorianDate < sendingPeriod.startDate)
          continue;
        if (sendingPeriod.endDate && gregorianDate > sendingPeriod.endDate)
          continue;
        for (const weeklyPeriod of sendingPeriod.weeklyPeriods) {
          if (weeklyPeriod.weekNumber === weekNumber) {
            for (const time of weeklyPeriod.weeklyPeriodTimes) {
              const fullStartTime = new Date(gregorianDate);
              const [startHour, startMinute, startSecond] = time.startTime
                .split(':')
                .map(Number);
              fullStartTime.setHours(startHour, startMinute, startSecond, 0);
              const threeHoursLater = new Date(
                currentDate.getTime() + 3 * 60 * 60 * 1000,
              );
              const isToday =
                gregorianDate.toDateString() === currentDate.toDateString();
              if (isToday && fullStartTime <= threeHoursLater) continue;
              times.push({
                weeklyPeriodTimeId: time.id,
                startTime: time.startTime,
                endTime: time.endTime,
                sendingPeriodId: sendingPeriod.id,
                weeklyPeriodId: weeklyPeriod.id,
                capacity: time.capacity,
              });
            }
          }
        }
      }
      if (times.length > 0) {
        possibleDates.push({
          gregorianDate: persianDate.GregorianDate,
          persianDate: persianDate.YearMonthDay,
          weekDayName: persianDate.WeekDayName,
          times,
        });
      }
    }
    return possibleDates;
  }

  private async capacityFilterShipmentWays(
    ways: any[],
    startOfWindow: Date,
    endOfWindow: Date,
  ) {
    const localTimeIdSet = new Set<number>();
    for (const way of ways) {
      for (const pd of way.possibleDates || []) {
        for (const t of pd.times || []) {
          localTimeIdSet.add(Number(t.weeklyPeriodTimeId));
        }
      }
    }
    if (localTimeIdSet.size === 0) return;
    const timeIdList = Array.from(localTimeIdSet).join(',');
    const sql = `
      SELECT logisticWeeklyPeriodTimeId AS timeId,
             CONVERT(varchar(10), sendingGregorianDate, 23) AS dateKey,
             COUNT(1) AS cnt
      FROM ECLogisticOrderGroupeds
      WHERE logisticWeeklyPeriodTimeId IN (${timeIdList})
        AND sendingGregorianDate >= :startDate
        AND sendingGregorianDate <= :endDate
      GROUP BY logisticWeeklyPeriodTimeId, CONVERT(varchar(10), sendingGregorianDate, 23)
    `;
    const raw = await (
      this.logisticOrderGroupedRepository.sequelize as any
    ).query(sql, {
      type: QueryTypes.SELECT,
      replacements: { startDate: startOfWindow, endDate: endOfWindow },
    });
    const countMap = new Map<string, number>();
    for (const r of raw as any[]) {
      countMap.set(`${r.timeId}:${r.dateKey}`, Number(r.cnt));
    }
    for (const way of ways) {
      if (!way.possibleDates) continue;
      for (const pd of way.possibleDates) {
        const d = new Date(pd.gregorianDate);
        d.setHours(0, 0, 0, 0);
        const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(d.getDate()).padStart(2, '0')}`;
        pd.times = (pd.times || []).filter((t: any) => {
          const used = countMap.get(`${t.weeklyPeriodTimeId}:${dateKey}`) || 0;
          const cap = Number(t.capacity || 0);
          return used < cap;
        });
      }
      way.possibleDates = way.possibleDates.filter(
        (pd: any) => (pd.times || []).length > 0,
      );
    }
  }

  private pickBestSelectionFromWays(shipmentWaysResolved: any[]) {
    const relevantPeriods = shipmentWaysResolved.flatMap((way) =>
      (way.possibleDates || []).flatMap((pd: any) =>
        (pd.times || []).map((t: any) => ({ way, pd, t })),
      ),
    );
    if (relevantPeriods.length === 0) return null;
    let bestSelection = null;
    let earliestDate: Date | null = null;
    let earliestStartTime: string | null = null;
    relevantPeriods.forEach(({ way, pd, t }) => {
      const thisDate = new Date(pd.gregorianDate);
      const thisStart = t.startTime;
      if (
        !earliestDate ||
        thisDate < earliestDate ||
        (thisDate.getTime() === earliestDate.getTime() &&
          thisStart < (earliestStartTime as string))
      ) {
        earliestDate = thisDate;
        earliestStartTime = thisStart;
        bestSelection = {
          shipmentWayId: way.shipmentWayId,
          gregorianDate: thisDate,
          weeklyPeriodTimeId: t.weeklyPeriodTimeId,
        };
      }
    });
    return bestSelection;
  }
  // endregion
}

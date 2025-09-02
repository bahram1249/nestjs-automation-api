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
  ECUserSession,
  ECVendor,
  ECVendorLogistic,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { ClientLogisticPeriodDto } from './dto';
import { AddressService } from '@rahino/ecommerce/user/address/address.service';
import { ClientValidateAddressService } from '../validate-address/client-validate-address.service';
import { ClientShipmentPriceService } from '../shipment-price/shipment-price.service';
import { OrderShipmentwayEnum } from '@rahino/ecommerce/shared/enum';

@Injectable()
export class LogisticPeriodService {
  constructor(
    @InjectModel(ECStock)
    private readonly stockRepository: typeof ECStock,
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    @InjectModel(ECLogisticShipmentWay)
    private readonly logisticShipmentWayRepository: typeof ECLogisticShipmentWay,
    private readonly addressService: AddressService,
    private readonly clientValidateAddressService: ClientValidateAddressService,
    private readonly clientShipmentPriceService: ClientShipmentPriceService,
  ) {}

  async getDeliveryOptions(
    user: User,
    session: ECUserSession,
    dto: ClientLogisticPeriodDto,
  ) {
    console.log(user);
    const { result: userAddress } = await this.addressService.findById(
      user,
      dto.addressId,
    );

    const stocks = await this.stockRepository.findAll(
      new QueryOptionsBuilder()
        .attributes(['id', 'inventoryId', 'productId', 'qty'])
        .filter({ sessionId: session.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          expire: {
            [Op.gt]: Sequelize.fn('getdate'),
          },
        })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECStock.isPurchase'), 0),
            {
              [Op.eq]: 0,
            },
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
                attributes: ['id', 'name'],
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
      stocks: stocks,
    });

    const logisticIds = [
      ...new Set(
        stocks.map((stock) => stock.inventory.vendor.vendorLogistic.logisticId),
      ),
    ];
    const shipmentWays = await this.logisticShipmentWayRepository.findAll(
      new QueryOptionsBuilder()
        .filter({
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECLogisticShipmentWay.isDeleted'),
                0,
              ),
              {
                [Op.eq]: 0,
              },
            ),
            {
              provinceId: userAddress.provinceId,
            },
            {
              logisticId: {
                [Op.in]: logisticIds,
              },
            },
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
                where: {
                  [Op.and]: [
                    Sequelize.where(
                      Sequelize.fn(
                        'isnull',
                        Sequelize.col('sendingPeriods.weeklyPeriods.isDeleted'),
                        0,
                      ),
                      {
                        [Op.eq]: 0,
                      },
                    ),
                  ],
                },
                attributes: ['id', 'weekNumber'],
                include: [
                  {
                    model: ECLogisticWeeklyPeriodTime,
                    as: 'weeklyPeriodTimes',
                    where: {
                      [Op.and]: [
                        Sequelize.where(
                          Sequelize.fn(
                            'isnull',
                            Sequelize.col(
                              'sendingPeriods.weeklyPeriods.weeklyPeriodTimes.isDeleted',
                            ),
                            0,
                          ),
                          {
                            [Op.eq]: 0,
                          },
                        ),
                      ],
                    },
                    attributes: ['id', 'startTime', 'endTime', 'capacity'],
                  },
                ],
              },
            ],
            where: {
              [Op.and]: [
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('sendingPeriods.isDeleted'),
                    0,
                  ),
                  {
                    [Op.eq]: 0,
                  },
                ),
              ],
            },
          },
        ])
        .build(),
    );

    const currentDate = new Date();
    const endDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const persianDates = await this.persianDateRepository.findAll(
      new QueryOptionsBuilder()
        .filter({
          GregorianDate: {
            [Op.gte]: currentDate,
            [Op.lte]: endDate,
          },
        })
        .attributes([
          'GregorianDate',
          'YearMonthDay',
          'WeekDayName',
          'WeekDayNumber',
        ])
        .order({ orderBy: 'GregorianDate', sortOrder: 'ASC' })
        .build(),
    );

    const groups: {
      [logisticId: number]: {
        logisticId: number;
        logisticName: string;
        vendorIds: Set<number>;
        vendorNames: Set<string>;
        stocks: ECStock[];
        sendingOptions: Array<{
          typeId: number;
          typeName: string;
          typeIcon: string | null;
          shipmentWays: Array<{
            shipmentWayId: number;
            shipmentWayName: string;
            shipmentWayIcon: string | null;
            possibleDates: Array<{
              gregorianDate: Date;
              persianDate: string;
              weekDayName: string;
              times: Array<{
                weeklyPeriodTimeId: number;
                startTime: string;
                endTime: string;
                sendingPeriodId: number;
                weeklyPeriodId: number;
                capacity: number;
              }>;
            }>;
          }>;
          bestSelection: {
            shipmentWayId: number;
            gregorianDate?: Date;
            weeklyPeriodTimeId?: number;
          } | null;
          supportedStockIds: number[];
        }>;
      };
    } = {};

    const typeInfoMap: {
      [logisticId: number]: {
        [typeId: number]: {
          name: string;
          icon: string | null;
          offsetDay: number | null;
        };
      };
    } = {};
    const uniqueTypeIdsMap: { [logisticId: number]: Set<number> } = {};

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

    // Populate sendingOptions for each group
    for (const logisticId in groups) {
      const group = groups[logisticId];
      const groupStocks = group.stocks;
      const uniqueTypeIds = Array.from(uniqueTypeIdsMap[Number(logisticId)]);
      const typeInfo = typeInfoMap[Number(logisticId)];
      const relevantShipmentWays = shipmentWays.filter(
        (sw) => Number(sw.logisticId) == Number(logisticId),
      );
      for (const typeId of uniqueTypeIds) {
        const info = typeInfo[typeId];
        // Compute extra inventory-level offset for stocks that support this type (either direct or via parent)
        const supportedStocksForType = groupStocks.filter(
          (stock) =>
            stock.inventory.scheduleSendingTypeId === typeId ||
            stock.inventory.scheduleSendingType.parentId === typeId,
        );
        const extraInventoryOffset = supportedStocksForType.length
          ? Math.max(
              ...supportedStocksForType.map(
                (s) => Number(s.inventory.offsetDay || 0),
              ),
            )
          : 0;
        const offsetDay = (info.offsetDay || 0) + extraInventoryOffset;
        const shipmentWaysOutput = relevantShipmentWays.map((shipmentWay) => {
          const possibleDates = [];
          // Calculate shipment price strictly based on this shipment way type (no fallback)
          const shipmentStocks = groupStocks.map((s) => ({
            weight: Number(s.product?.weight || 0),
            qty: Number(s.qty || 0),
            freeShipment: false,
            totalPrice: 0,
          }));
          const shipmentPricePromise = this.clientShipmentPriceService.cal(
            shipmentStocks,
            dto.addressId,
            Number(shipmentWay.orderShipmentWay.id) as OrderShipmentwayEnum,
          );

          const relevantPeriods = shipmentWay.sendingPeriods.filter(
            (sp) => sp.scheduleSendingTypeId === typeId,
          );

          const offsetStartDate = new Date(
            currentDate.getTime() + offsetDay * 24 * 60 * 60 * 1000,
          );

          for (const persianDate of persianDates) {
            const gregorianDate = new Date(persianDate.GregorianDate);
            if (gregorianDate < offsetStartDate) continue;
            const weekNumber = persianDate.WeekDayNumber;
            const times = [] as any[];

            for (const sendingPeriod of relevantPeriods) {
              if (
                sendingPeriod.startDate &&
                gregorianDate < sendingPeriod.startDate
              )
                continue;
              if (
                sendingPeriod.endDate &&
                gregorianDate > sendingPeriod.endDate
              )
                continue;
              for (const weeklyPeriod of sendingPeriod.weeklyPeriods) {
                if (weeklyPeriod.weekNumber === weekNumber) {
                  for (const time of weeklyPeriod.weeklyPeriodTimes) {
                    const fullStartTime = new Date(gregorianDate);
                    const [startHour, startMinute, startSecond] = time.startTime
                      .split(':')
                      .map(Number);
                    fullStartTime.setHours(
                      startHour,
                      startMinute,
                      startSecond,
                      0,
                    );

                    const threeHoursLater = new Date(
                      currentDate.getTime() + 3 * 60 * 60 * 1000,
                    );

                    const isToday =
                      gregorianDate.toDateString() ===
                      currentDate.toDateString();

                    if (isToday && fullStartTime <= threeHoursLater) {
                      continue;
                    }

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

          const priceData = {
            shipmentWayId: Number(shipmentWay.id),
            // expose backend semantic shipment way type/id for FE
            orderShipmentwayId: Number(shipmentWay.orderShipmentWayId),
            shipmentWayName: shipmentWay.orderShipmentWay.name,
            shipmentWayIcon: shipmentWay.orderShipmentWay.icon,
            possibleDates,
          } as any;
          return shipmentPricePromise.then((sp) => ({
            ...priceData,
            price: sp.price,
            realShipmentPrice: sp.realShipmentPrice,
          }));
        });

        let bestSelection = null;
        let earliestDate = null;
        let earliestStartTime = null;

        // Resolve shipment price promises before selecting best date
        const shipmentWaysResolved = await Promise.all(shipmentWaysOutput);

        // Old-style guard: only pick best when there are relevant periods
        const relevantPeriods = shipmentWaysResolved.flatMap((way) =>
          (way.possibleDates || []).flatMap((pd) =>
            (pd.times || []).map((t) => ({ way, pd, t })),
          ),
        );

        if (relevantPeriods.length > 0) {
          relevantPeriods.forEach(({ way, pd, t }) => {
            const thisDate = new Date(pd.gregorianDate);
            const thisStart = t.startTime;
            if (
              !earliestDate ||
              thisDate < earliestDate ||
              (thisDate.getTime() === earliestDate.getTime() &&
                thisStart < earliestStartTime)
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
        }

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

        group.sendingOptions.push({
          typeId,
          typeName: info.name,
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
}

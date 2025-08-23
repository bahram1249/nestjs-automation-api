import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PersianDate } from '@rahino/database';
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

@Injectable()
export class LogisticPeriodService {
  constructor(
    @InjectModel(ECStock)
    private readonly stockRepository: typeof ECStock,
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    @InjectModel(ECLogisticShipmentWay)
    private readonly logisticShipmentWayRepository: typeof ECLogisticShipmentWay,
  ) {}

  async getDeliveryOptions(session: ECUserSession, provinceId: number) {
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
            attributes: ['id', 'title'],
          },
          {
            model: ECInventory,
            as: 'inventory',
            attributes: ['id', 'vendorId', 'scheduleSendingTypeId'],
            include: [
              {
                model: ECScheduleSendingType,
                as: 'scheduleSendingType',
                attributes: ['id', 'parentId', 'title'],
                include: [
                  {
                    model: ECScheduleSendingType,
                    as: 'parent',
                    attributes: ['id', 'title'],
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
              provinceId: provinceId,
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
            attributes: ['id', 'name'],
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
        subgroups: Array<{
          originalScheduleSendingTypeId: number;
          originalScheduleSendingTypeName: string;
          parentScheduleSendingTypeId: number | null;
          parentScheduleSendingTypeName: string | null;
          stocks: ECStock[];
          sendingOptions: Array<{
            typeId: number;
            typeName: string;
            shipmentWays: Array<{
              shipmentWayId: number;
              shipmentWayName: string;
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
                }>;
              }>;
            }>;
            bestSelection: {
              shipmentWayId: number;
              gregorianDate?: Date;
              weeklyPeriodTimeId?: number;
            } | null;
          }>;
        }>;
      };
    } = {};

    for (const stock of stocks) {
      const logisticId = stock.inventory.vendor.vendorLogistic.logisticId;
      const logisticName = stock.inventory.vendor.vendorLogistic.logistic.title;
      const vendorId = stock.inventory.vendorId;
      const vendorName = stock.inventory.vendor.name;
      const originalScheduleTypeId = stock.inventory.scheduleSendingTypeId;
      const originalScheduleTypeName =
        stock.inventory.scheduleSendingType.title;
      const parentScheduleTypeId = stock.inventory.scheduleSendingType.parentId;
      const parentScheduleTypeName = stock.inventory.scheduleSendingType.parent
        ? stock.inventory.scheduleSendingType.parent.title
        : null;

      if (!groups[Number(logisticId)]) {
        groups[Number(logisticId)] = {
          logisticId: Number(logisticId),
          logisticName,
          vendorIds: new Set(),
          vendorNames: new Set(),
          subgroups: [],
        };
      }

      groups[Number(logisticId)].vendorIds.add(vendorId);
      groups[Number(logisticId)].vendorNames.add(vendorName);

      let subgroup = groups[Number(logisticId)].subgroups.find(
        (sg) => sg.originalScheduleSendingTypeId === originalScheduleTypeId,
      );

      if (!subgroup) {
        subgroup = {
          originalScheduleSendingTypeId: originalScheduleTypeId,
          originalScheduleSendingTypeName: originalScheduleTypeName,
          parentScheduleSendingTypeId: parentScheduleTypeId,
          parentScheduleSendingTypeName: parentScheduleTypeName,
          stocks: [],
          sendingOptions: [],
        };
        groups[Number(logisticId)].subgroups.push(subgroup);
      }

      subgroup.stocks.push(stock);
    }

    // Populate sendingOptions for each subgroup
    for (const logisticId in groups) {
      const group = groups[logisticId];
      const relevantShipmentWays = shipmentWays.filter(
        (sw) => Number(sw.logisticId) == Number(logisticId),
      );

      for (const subgroup of group.subgroups) {
        const typeIds = [subgroup.originalScheduleSendingTypeId];
        if (subgroup.parentScheduleSendingTypeId) {
          typeIds.push(subgroup.parentScheduleSendingTypeId);
        }

        typeIds.forEach((typeId, index) => {
          const typeName =
            index === 0
              ? subgroup.originalScheduleSendingTypeName
              : subgroup.parentScheduleSendingTypeName;
          const shipmentWaysOutput = relevantShipmentWays.map((shipmentWay) => {
            const possibleDates = [];

            const relevantPeriods = shipmentWay.sendingPeriods.filter(
              (sp) => sp.scheduleSendingTypeId === typeId,
            );

            if (relevantPeriods.length > 0) {
              for (const persianDate of persianDates) {
                const weekNumber = persianDate.WeekDayNumber;
                const times = [];

                for (const sendingPeriod of relevantPeriods) {
                  if (
                    sendingPeriod.startDate &&
                    persianDate.GregorianDate < sendingPeriod.startDate
                  )
                    continue;
                  if (
                    sendingPeriod.endDate &&
                    persianDate.GregorianDate > sendingPeriod.endDate
                  )
                    continue;
                  for (const weeklyPeriod of sendingPeriod.weeklyPeriods) {
                    if (weeklyPeriod.weekNumber === weekNumber) {
                      for (const time of weeklyPeriod.weeklyPeriodTimes) {
                        times.push({
                          weeklyPeriodTimeId: time.id,
                          startTime: time.startTime,
                          endTime: time.endTime,
                          sendingPeriodId: sendingPeriod.id,
                          weeklyPeriodId: weeklyPeriod.id,
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
            }

            return {
              shipmentWayId: Number(shipmentWay.id),
              shipmentWayName: shipmentWay.orderShipmentWay.name,
              possibleDates,
            };
          });

          let bestSelection = null;
          let earliestDate = null;
          let earliestStartTime = null;

          shipmentWaysOutput.forEach((way) => {
            way.possibleDates.forEach((pd) => {
              pd.times.forEach((t) => {
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
            });
          });

          if (!bestSelection && shipmentWaysOutput.length > 0) {
            bestSelection = {
              shipmentWayId: Number(shipmentWaysOutput[0].shipmentWayId),
            };
          }

          subgroup.sendingOptions.push({
            typeId,
            typeName,
            shipmentWays: shipmentWaysOutput,
            bestSelection,
          });
        });
      }
    }

    const result = Object.values(groups);

    return {
      result,
    };
  }
}

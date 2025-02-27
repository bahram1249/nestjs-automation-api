import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { BPMNRequest } from "./bpmn-request.entity";
import { BPMNOccurredEvent } from "./bpmn-occurred-event.entity";

@Table({ tableName: "BPMNRequestOccurredEvents" })
export class BPMNRequestOccurredEvent extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  @ForeignKey(() => BPMNRequest)
  requestId: bigint;

  @BelongsTo(() => BPMNRequest, { as: "request", foreignKey: "requestId" })
  request?: BPMNRequest;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  @ForeignKey(() => BPMNOccurredEvent)
  occurredEventId: number;

  @BelongsTo(() => BPMNOccurredEvent, {
    as: "occurredEvent",
    foreignKey: "occurredEventId",
  })
  occurredEvent?: BPMNOccurredEvent;

  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
}

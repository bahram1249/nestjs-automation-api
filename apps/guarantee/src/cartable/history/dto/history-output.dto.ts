export class HistoryOutputDto {
  public id: bigint;
  public requestId: bigint;
  public from: string;
  public to: string;
  public description?: string;
  public nodeCommand?: string;
  public executeBundle?: string;
  public createdAt: Date;
  public updatedAt: Date;
}

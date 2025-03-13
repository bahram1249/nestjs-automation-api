export class SolutionOutputDto {
  constructor(
    public id: number,
    public title: string,
    public fee: bigint,
    public provinceSolutionId?: number,
    public provinceId?: number,
  ) {}
}

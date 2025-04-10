import { IsNumber } from 'class-validator';

export class SolutionArrayDto {
  @IsNumber()
  solutionId: number;
  @IsNumber()
  warrantyServiceType: number;
}

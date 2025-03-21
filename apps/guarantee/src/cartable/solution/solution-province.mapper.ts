import { GSSolution } from '@rahino/localdatabase/models';
import { SolutionOutputDto } from './dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SolutionProveinceMapper {
  constructor() {}
  mapItems(items: GSSolution[]): SolutionOutputDto[] {
    const outputItems: SolutionOutputDto[] = [];
    for (const item of items) {
      outputItems.push(this.map(item));
    }
    return outputItems;
  }

  map(item: GSSolution): SolutionOutputDto {
    const output = new SolutionOutputDto(item.id, item.title, item.fee);
    if (item.provinceSolutions.length > 0) {
      const provinceSolution = item.provinceSolutions[0];
      output.provinceSolutionId = provinceSolution.id;
      output.fee = provinceSolution.fee;
      output.provinceId = provinceSolution.provinceId;
    }
    return output;
  }
}

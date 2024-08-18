import { ProductDto } from '../../dto';

export type ProductPriceDto = Pick<
  ProductDto,
  'productFormulaId' | 'wages' | 'stoneMoney'
>;

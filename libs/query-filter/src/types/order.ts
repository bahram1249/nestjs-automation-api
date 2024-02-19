import { OrderItem } from 'sequelize';
import { OrderCol } from '@rahino/query-filter/types/order-col';

export type Order = OrderItem | OrderCol;

export class GetSellerWarrantyDataDto {
  id: number;
  prefix_serial: string;
  serial_number: string;
  start_date: Date;
  expire_date: Date;
  brand_name: string;
  group_name: string;
  product_name: string;
  variant_name: string;
  order_item_id: string;
  user_id: string;
  warranty_period: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

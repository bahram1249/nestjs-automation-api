export const PRODUCT_INVENTORY_STATUS_QUEUE = 'product-inventory-status-queue';
export const Constants: { readonly [name: string]: (key: string) => string } = {
  productInventoryStatusJob: (productId) =>
    `product-id:${productId}-inventory-status-job`,
};

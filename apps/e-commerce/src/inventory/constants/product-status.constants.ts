export const PRODUCT_INVENTORY_STATUS_QUEUE = 'product-inventory-status-queue';
export const Constants: { readonly [name: string]: (key: string) => string } = {
  productInventoryStatusJob: (productId) =>
    `product-id:${productId}-inventory-status-job`,
};
export const DECREASE_INVENTORY_QUEUE = 'DECREASE_INVENTORY_QUEUE';
export const DECREASE_INVENTORY_JOB = 'DECREASE_INVENTORY_JOB';

export const REVERT_INVENTORY_QTY_QUEUE = 'REVERT_INVENTORY_QTY_QUEUE';
export const REVERT_INVENTORY_QTY_JOB = 'REVERT_INVENTORY_QTY_JOB';

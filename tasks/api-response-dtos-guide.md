# E-commerce API Response DTOs Implementation Guide

## Overview

This document provides guidance on implementing response DTOs with `@ApiJsonResponse` decorators for e-commerce controllers.

## Completed Work

### 1. Vendor Controller (`apps/e-commerce/src/admin/vendor/`)

Created comprehensive response DTOs for the vendor controller:

#### New DTO Files Created:

- `vendor-response.dto.ts` - Main vendor response with all nested entities
- `attachment-response.dto.ts` - Attachment model response
- `user-response.dto.ts` - User model response
- `vendor-user-response.dto.ts` - VendorUser model response
- `variation-price-response.dto.ts` - VariationPrice model response
- `vendor-commission-type-response.dto.ts` - CommissionType model response
- `vendor-commission-response.dto.ts` - Commission model response
- `vendor-logistic-response.dto.ts` - VendorLogistic model response

#### Controller Updates:

- Added `@ApiJsonResponse` decorator to all methods with `JsonResponseTransformInterceptor`
- All nested models included in `extraModels` array for proper Swagger documentation
- Fixed typos in API operation descriptions

## Pattern to Follow for Other Controllers

### Step 1: Analyze the Service

Read the corresponding service file to understand:

- What Sequelize models are queried
- What attributes are selected
- What associations/includes are used
- What the return structure looks like

### Step 2: Create Response DTOs

Create DTO files in the `dto/` folder following this pattern:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { RelatedDto } from './related-response.dto';

export class EntityResponseDto {
  @ApiProperty({ example: 1, description: 'Entity ID' })
  id: number;

  @ApiProperty({ example: 'Name', description: 'Entity Name' })
  name: string;

  @ApiProperty({
    type: () => RelatedDto,
    description: 'Related entity',
    required: false,
  })
  related?: RelatedDto;

  @ApiProperty({
    type: () => [RelatedDto],
    description: 'Related entities array',
    required: false,
  })
  relatedArray?: RelatedDto[];
}
```

### Step 3: Update Controller

Add the `@ApiJsonResponse` decorator to methods:

```typescript
@ApiJsonResponse({
  type: EntityResponseDto,
  isArray: true,  // For list endpoints
  status: 201,    // For create endpoints (optional, defaults to 200)
  extraModels: [
    NestedDto1,
    NestedDto2,
    // All nested DTOs used in the response
  ],
})
```

### Step 4: Export DTOs

Add exports to `dto/index.ts`:

```typescript
export * from './entity-response.dto';
export * from './nested-response.dto';
```

## Controllers Requiring Implementation

The following controllers in `apps/e-commerce/src/` use `@UseInterceptors(JsonResponseTransformInterceptor)` and need response DTOs:

### Admin Section

- [x] vendor/vendor.controller.ts ✓
- [ ] public-photo/public-photo.controller.ts
- [ ] product-section/product/product.controller.ts
- [ ] product-section/product-photo/product-photo.controller.ts
- [ ] product-section/product-video/product-video.controller.ts
- [ ] product-section/product-comment/product-comment.controller.ts
- [ ] product-section/selected-product/selected-product.controller.ts
- [ ] product-section/selected-product-items/selected-product-item.controller.ts
- [ ] product-section/variation-price/variation-price.controller.ts
- [ ] product-section/inventory-history/inventory-history.controller.ts
- [ ] product-section/inventory-status/inventory-status.controller.ts
- [ ] order-section/totalOrders/total-order.controller.ts
- [ ] order-section/pendingOrder/pending-order.controller.ts
- [ ] order-section/deliveryOrder/delivery-order.controller.ts
- [ ] order-section/postageOrder/postage-order.controller.ts
- [ ] order-section/cancell-order/cancell-order.controller.ts
- [ ] order-section/courier/courier.controller.ts
- [ ] order-section/courier-price/courier-price.controller.ts
- [ ] order-section/courierOrder/courier-order.controller.ts
- [ ] order-section/order-status/order-status.controller.ts
- [ ] order-section/order-shipmentway/order-shipmentway.controller.ts
- [ ] order-section/payment-gateway/payment-gateway.controller.ts
- [ ] order-section/transaction/transaction.controller.ts
- [ ] discount-section/discount/discount.controller.ts
- [ ] discount-section/discount-type/discount-type.controller.ts
- [ ] discount-section/discount-condition/discount-condition.controller.ts
- [ ] discount-section/discount-condition-type/discount-condition-type.controller.ts
- [ ] discount-section/discount-condition-value/discount-condition-value.controller.ts
- [ ] discount-section/discount-action-type/discount-action-type.controller.ts
- [ ] discount-section/discount-action-rule/discount-action-rule.controller.ts
- [ ] discount-section/factor-discount/discount.controller.ts
- [ ] logistic-section/logistic/admin-logistic.controller.ts
- [ ] logistic-section/logistic-user/admin-logistic-user.controller.ts
- [ ] logistic-section/logistic-weekly-period/logistic-weekly-period.controller.ts
- [ ] logistic-section/logistic-sending-period/logistic-sending-period.controller.ts
- [ ] logistic-section/logistic-shipment-way/admin-logistic-shipmentway.controller.ts
- [ ] logistic-section/schedule-sending-type/schedule-sending-type.controller.ts
- [ ] logistic-order-section/totalOrders/logistic-total-order.controller.ts
- [ ] logistic-order-section/pendingOrder/logistic-pending-order.controller.ts
- [ ] logistic-order-section/deliveryOrder/logistic-delivery-order.controller.ts
- [ ] logistic-order-section/postageOrder/logistic-postage-order.controller.ts
- [ ] logistic-order-section/cancell-order/logistic-cancell-order.controller.ts
- [ ] logistic-order-section/courierOrder/logistic-courier-order.controller.ts
- [ ] home-page-section/home-page/home-page.controller.ts
- [ ] home-page-section/home-page-photo/home-page-photo.controller.ts
- [ ] home-page-section/header-notification/notification.controller.ts
- [ ] home-page-section/entity-type-sort/entity-type-sort.controller.ts
- [ ] page/page.controller.ts
- [ ] address/addess.controller.ts
- [ ] additional-entity-type-section/linked-entity-type-brand/linked-entity-type-brand.controller.ts
- [ ] additional-entity-type-section/entity-type-factor/entity-type-factor.controller.ts
- [ ] notification/notification.controller.ts

### Client Section

- [ ] client/vendor/client-vendor.controller.ts
- [ ] client/product/product.controller.ts
- [ ] client/product-comment/product-comment.controller.ts
- [ ] client/product-view/product-view.controller.ts
- [ ] client/productFeed/product-feed.controller.ts
- [ ] client/brand/brand.controller.ts
- [ ] client/color/color.controller.ts
- [ ] client/city/city.controller.ts
- [ ] client/province/province.controller.ts
- [ ] client/neighborhood/neighborhood.controller.ts
- [ ] client/guarantee/guarantee.controller.ts
- [ ] client/guarantee-month/guarantee-month.controller.ts
- [ ] client/order/client-order.controller.ts
- [ ] client/page/page.controller.ts
- [ ] client/home/home.controller.ts
- [ ] client/home-photo/home-photo.controller.ts
- [ ] client/public-photo/public-photo.controller.ts
- [ ] client/linked-entity-type-brand/linked-entity-type-brand.controller.ts
- [ ] client/shopping-section/based-logistic/shipment-price/shipment-price.controller.ts
- [ ] client/shopping-section/based-logistic/payment/logistic-payment.controller.ts
- [ ] client/shopping-section/based-logistic/logistic-period/logistic-period.controller.ts

### User Section

- [ ] user/user-vendor/user-vendor.controller.ts
- [ ] user/transaction/transaction.controller.ts
- [ ] user/shopping/stock/stock.controller.ts
- [ ] user/shopping/single-vendor-shopping/shopping-cart/shopping-cart.controller.ts
- [ ] user/shopping/single-vendor-shopping/payment/payment.controller.ts
- [ ] user/shopping/payment/payment.controller.ts
- [ ] user/order/user-order.controller.ts
- [ ] user/selected-product/selected-product.controller.ts
- [ ] user/product-favorite/product-favorite.controller.ts
- [ ] user/comment/comment.controller.ts
- [ ] user/notification/notification.controller.ts
- [ ] user/header-notification/notification.controller.ts
- [ ] user/dashboard/dashboard.controller.ts
- [ ] user/session/session.controller.ts
- [ ] user/address/addess.controller.ts
- [ ] user/charging-wallet-payment/charging-wallet-payment.controller.ts
- [ ] user/login/login.controller.ts

### Anonymous Section

- [ ] anonymous/vendor-entity-type/vendor-entity-type.controller.ts
- [ ] anonymous/shipping-way/shipping-way.controller.ts
- [ ] anonymous/publish-status/publish-status.controller.ts
- [ ] anonymous/payment-gateway/payment-gateway.controller.ts
- [ ] anonymous/nearby-vendor/nearby-vendor.controller.ts
- [ ] anonymous/inventory-status/inventory-status.controller.ts
- [ ] anonymous/torob-product/torob-product.controller.ts

### Report Section

- [ ] report/vendor-sale/vendor-sale.controller.ts
- [ ] report/product-sale/product-sale.controller.ts
- [ ] report/payment-transaction/payment-transaction.controller.ts
- [ ] report/inventory/inventory-report.controller.ts
- [ ] report/courier/courier-report.controller.ts
- [ ] report/admin-sale/admin-sale.controller.ts
- [ ] report/admin-post/admin-post.controller.ts
- [ ] report/admin-courier/admin-courier.controller.ts
- [ ] report/based-logistic/vendor-sale/vendor-sale.controller.ts
- [ ] report/based-logistic/product-sale/product-sale.controller.ts
- [ ] report/based-logistic/payment-transaction/payment-transaction.controller.ts
- [ ] report/based-logistic/courier/courier-report.controller.ts
- [ ] report/based-logistic/admin-sale/admin-sale.controller.ts
- [ ] report/based-logistic/admin-post/admin-post.controller.ts
- [ ] report/based-logistic/admin-courier/admin-courier.controller.ts

### Other

- [ ] vendor-address/vendor-address.controller.ts
- [ ] verify-payment/verify-payment.controller.ts
- [ ] customer-customize/gold/gold-price/gold-price.controller.ts
- [ ] customer-customize/gold/admin/price-formula/price-formula.controller.ts
- [ ] customer-customize/gold/admin/current-price/current-price.controller.ts
- [ ] client/persiandate/bymonth/persian-date-month.controller.ts

## Important Notes

1. **Nested Models**: Always include all nested DTOs in the `extraModels` array
2. **Array Responses**: Use `isArray: true` for list endpoints
3. **Create Endpoints**: Use `status: 201` for POST endpoints
4. **Optional Fields**: Mark optional fields with `required: false`
5. **Types**: Use proper TypeScript types matching the Sequelize model types
6. **Circular References**: Use lazy loading with `type: () => DtoClass` for circular references
7. **File Uploads**: For file upload endpoints, check what the service returns

## Testing

After implementing, run:

```bash
npm run build
npm run lint
```

Verify Swagger documentation is correctly generated at `/api` endpoint when running the application.

# AGENTS.md

This file provides guidance for AI agents working on this NestJS monorepo.

## Build, Lint, and Test Commands

```bash
# Build the project
npm run build

# Format code with Prettier
npm run format

# Run ESLint with auto-fix
npm run lint

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run tests for specific app
npm run test -- apps/<app_name>

# Run E2E tests
npm run test:e2e
npm run test:e2e:ecommerce
npm run test:e2e:ecommerce:client-order

# Run a specific test file
npm run test -- path/to/test.spec.ts

# Run specific app in development mode
npm run start:dev e-commerce
```

## Monorepo Structure

- `apps/` - Applications: core, e-commerce, guarantee, bpmn, pcm, eav, discount-coffe, core-dashboard
  - `e-commerce/src/admin/` - Administration panel (products, orders, logistics)
  - `e-commerce/src/client/` - Public-facing features (products, brands)
  - `e-commerce/src/user/` - Authenticated user features (account, orders)
  - `e-commerce/src/anonymous/` - Anonymous user features (login, registration)
  - `e-commerce/src/shared/` - Cross-cutting concerns (discount logic, exceptions)
  - `e-commerce/src/job/` - Background jobs (BullMQ)
  - `e-commerce/src/report/` - Report generation (older modules use Knex, newer use Sequelize)
- `libs/` - Shared libraries: file, thumbnail, logger, query-filter, redis-client, sms, minio-client, pay, permission-checker, response, commontools, localdatabase

## Path Aliases

Always use path aliases instead of relative imports:

- `@rahino/ecommerce` or `@rahino/ecommerce/*` for e-commerce app
- `@rahino/guarantee` or `@rahino/guarantee/*` for guarantee app
- `@rahino/bpmn` or `@rahino/bpmn/*` for bpmn app
- `@rahino/localdatabase` or `@rahino/localdatabase/*` for models
- `@rahino/<lib-name>` for library imports

## Code Style Guidelines

### Imports

- External packages first, then internal packages using path aliases
- Group imports with blank lines between groups
- Example:

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { SomeModel } from '@rahino/localdatabase/models';
import { SomeService } from './some.service';
```

### Formatting

- Use single quotes
- Trailing commas everywhere
- Prettier handles formatting (run `npm run format`)

### Types

- Use `bigint` for IDs in TypeScript
- Use `class-validator` decorators for DTO validation
- Use `@ApiProperty()` from `@nestjs/swagger` for API documentation
- Use `IsInt()` instead of `IsBigInt()` (which doesn't exist)

### Naming Conventions

- Modules: lowercase with hyphens (e.g., `product.module.ts`, `product-service.module.ts`)
- Controllers: `<Feature>Controller` (e.g., `ProductController`)
- Services: `<Feature>Service` or `<Action>Service` (e.g., `ProductService`, `RemoveEmptyPriceService`)
- DTOs: `<Purpose>Dto` (e.g., `GetProductDto`, `CreateProductDto`, `PriceFilterDto`)
- Models: `<TwoLetterPrefix><Name>Entity` in `libs/localdatabase/src/models/`
- Queue processors: `<QueueName>Processor`

### Module Structure

Each feature should be a self-contained NestJS module with:

- `*.controller.ts` - Controller with endpoints
- `*.service.ts` - Main service
- `*.module.ts` - Module file
- `dto/` subdirectory - Data Transfer Objects
- `processor/` subdirectory - BullMQ processors (if needed)

### Authentication & Authorization

- Admin controllers: `@UseGuards(JwtGuard, PermissionGuard)` at class level
- Method permissions: `@CheckPermission({ permissionSymbol: 'path.to.permission' })`
- Get authenticated user: `@GetUser() user: User` parameter
- Public controllers: Use `OptionalJwtGuard`, `OptionalSessionGuard`

### Response Format

- Apply `@UseInterceptors(JsonResponseTransformInterceptor)` at method level
- Return objects with `{ result: data, total?: number }` structure for paginated responses

### ORM (Sequelize)

- Models in `libs/localdatabase/src/models/<domain>/`
- Each model directory must have an `index.ts` exporting all models
- Use `QueryOptionsBuilder` from `@rahino/query-filter` for queries
- Re-initialize builder for separate queries (no clone method)
- Filter out inactive vendors in product queries: `isnull(ECVendor.isActive, 1) = 1`
- Complex query logic should be encapsulated in query builder services (e.g., `LogisticSaleQueryBuilderService`)
- For paginated data, total count with `group` is the length of the resulting array

### Background Jobs (BullMQ)

- Import from `@nestjs/bullmq` (NOT `@nestjs/bull`)
- Processors extend `WorkerHost` and use `@Processor(QUEUE_NAME)` decorator
- Implement `async process(job: Job)` method
- Delete temporary files after processing
- Job dispatch: When entity status is updated (e.g., vendor's `isActive` flag), dispatch background job via BullMQ to update related entities (e.g., product inventories)
- Temporary file paths should be passed directly to job payload; file must be deleted after processing
- Job structure (guarantee app): New jobs have own directory under `apps/guarantee/src/job/` with `constants` and `processor` subdirectories

### DTOs

- Use `IntersectionType` from `@nestjs/swagger` to combine DTOs
- Base filter DTO + specific properties = complete filter DTO
- Use `@Type(() => Number)` for numeric conversions
- Use `IsOptional()` for optional fields
- Export all DTOs from `dto/index.ts`
- Do not use generic types (like `DateFilter`). A base DTO with specific properties (e.g., `beginDate`) is combined with `ListFilter` from `@rahino/query-filter` using `IntersectionType`

### Database Migrations

- **Core Files (`apps/main/src/sql/Core/`)**: `Core-V1.sql`, `Core-Data.sql`, `Core-Permission.sql`
- **e-commerce Files (`apps/main/src/sql/Ecommerce/`)**: `Ecommerce-Table.sql`, `Ecommerce-Data.sql`, `Ecommerce-EAV-Table.sql`, `EAV-Table.sql`, `EAV-Data.sql`
- **Guarantee/BPMN Files (`apps/main/src/sql/BPMN/`)**: `Ariakish-Club-Table.sql`, `Ariakish-Club-Data.sql`, `BPMN-Table.sql`, `BPMN-Data.sql`
- SQL migrations in `apps/main/src/sql/`
- Append new entries to end of file with two empty lines after
- Do not hardcode primary keys in data inserts
- **Status tables (e.g., GSIrangsImportStatus)**: Must use static non-identity primary key (`id INT PRIMARY KEY`) with manual default values inserted in migration script
- Corresponding Enum must be created in the code for status tables

### Testing

- `bpmn`, `e-commerce`, and `guarantee` applications do not currently contain any test files that are executed by the specific app test command
- Guard mocking: `.overrideGuard()` in test setup
- Decorator mocking: custom `NestInterceptor` for `@GetUser()`
- E2E configs in `apps/<app>/test/jest-e2e.json` with relative paths
- E2E config requires local `moduleNameMapper` with paths relative to config file's location (e.g., using `../`)

### BPMN Dynamic Actions & Conditions

- **Actions in `apps/bpmn/src/dynamic-action/guarantee/`**
- **Conditions in `apps/bpmn/src/dynamic-condition/guarantee/`**
- Action services implement `ActionServiceImp` interface with `executeAction(dto: ExecuteActionDto)` method
- Condition services implement `check()` method returning boolean
- Action naming: `NotificationSenderFor...ActionService` or similar
- Service name must match `actionSource` column in `BPMNActions` table
- Condition service name must match `conditionSource` column in `BPMNNodeConditions` table
- `TraverseService` in `apps/bpmn/src/modules/traverse/traverse.service.ts` drives the BPMN flow
- Workflow steps: Get current request state → Find node → Check conditions → Execute actions → Update state → Log history
- Outbound actions execute before leaving current activity; inbound actions execute after transitioning
- `BPMNRequestHistory.fromUserId` tracks user who executed action
- `BPMNRequest` holds `organizationId`

### Error Handling

- Use HTTP status codes with `@HttpCode(HttpStatus.*)`
- Use `ValidationPipe({ transform: true })` for DTO validation
- Use `@UsePipes(new ValidationPipe({ transform: true }))` at method level

### Best Practices

- Reuse query logic in private helper methods in services (e.g., by `findAll` and `exportExcel`)
- Cache small lookup tables for performance in import operations
- Use `RegExp` for `FileTypeValidator` (escape special characters with double backslashes)
- Use `@AutoMap()` from `automapper-classes` on model properties for mapping
- For refactoring, create new modules alongside old ones with distinct API paths
- Modify existing controller and service files instead of creating new ones for feature updates

## E-commerce Specifics

- **Product API endpoints**: `/api/ecommerce/products` with GET endpoints for listing, nearby, price range, slug, and ID
- **Discount engine**: Core logic in `apps/e-commerce/src/shared/discount` directory
- **API documentation**: Access Swagger docs at `/api` endpoint when running
- **Import operations**: Use `'xlsx'` for parsing, `'persian-date'` for Jalali/Gregorian conversions, `'exceljs'` for generation
- **Excel 1900 leap year bug**: Must handle in date parsing logic
- **Reporting**: Located in `apps/e-commerce/src/report/`. Newer modules use Sequelize, even if older modules used Knex

## Guarantee Specifics

- **Shared Services**: Provides a shared `SmsSenderService` (`@rahino/guarantee/shared/sms-sender`)
- **Import Headers (Persian)**: 'برند', 'محصول', 'مدل', 'شناسه رهگیری', 'تاریخ شروع', 'تاریخ انقضا'
- **Business Logic**: Cleaning text, parsing Jalali/Excel dates, looking up/creating related entities, preventing duplicates based on serial number

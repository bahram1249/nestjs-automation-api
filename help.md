## 💡 Gemini Project Knowledge Base

### ⚙️ Architecture & Setup

- **Monorepo Structure:** NestJS monorepo with applications in `apps/` (e.g., `apps/guarantee/`, `apps/main/`, `apps/e-commerce/`) and shared libraries in `libs/`.
- **Applications:**
  - **Core:** Handles user management and permissions.
  - **e-commerce:** Main e-commerce application (`apps/e-commerce/src`). Depends on Core and EAV.
  - **guarantee (gs):** Guarantee application (`apps/guarantee/`). Depends on Core and BPMN. Feature modules are imported into `apps/guarantee/src/gs.module.ts`.
  - **BPMN:** Business Process Model and Notation project.
- **Dependencies:** Installed via `npm install`.
- **Authentication/Authorization:** Controllers are secured using:
  - `@UseGuards(JwtGuard, PermissionGuard)` at the class level.
  - `@CheckPermission('permission.symbol')` decorator from `@rahino/permission-checker` at the method level.
  - A custom decorator, `@GetUser()`, from `@rahino/auth` is available to retrieve the authenticated user object in controllers.

### 💾 Data & Persistence (Sequelize ORM)

- **ORM:** The project uses **Sequelize** as its ORM.
- **Models:**
  - **Core Models:** (e.g., `User`, `Permission`) are imported from the `@rahino/database` package.
  - **Application Models:** Located in subdirectories within `libs/localdatabase/src/models/` (e.g., `ecommerce-eav/`, `guarantee/`). Imported via the `@rahino/localdatabase/models` path alias.
  - Each model subdirectory must have an updated `index.ts` that exports all models within it.
- **Querying:**
  - A reusable `QueryOptionsBuilder` for constructing Sequelize queries is available in `libs/query-filter/src/sequelize-query-builder/`.
  - To create separate but related queries (e.g., for data and for total count), the builder should be **re-initialized** as it lacks a `clone()` method.
  - Complex query logic for specific features should be encapsulated in dedicated **query builder services** (e.g., `LogisticSaleQueryBuilderService`).
  - For paginated data, the total count should be calculated efficiently using Sequelize's `count()`. If `group` is used, the total count is the **length of the resulting array**.

### 🔄 Database Migrations (SQL Files)

- **Migration Style:** New entries/changes must be **appended** to the absolute end of the relevant SQL migration file, followed by two empty lines.
- **Core Files (`apps/main/src/sql/Core/`):**
  - `Core-V1.sql`: Core table creation/alteration.
  - `Core-Data.sql`: Core table seed data.
  - `Core-Permission.sql`: All project permission symbols for controllers.
- **e-commerce Files (`apps/main/src/sql/Ecommerce/`):**
  - `Ecommerce-Table.sql`: E-commerce table creation/alteration.
  - `Ecommerce-Data.sql`: E-commerce seed data.
  - `Ecommerce-EAV-Table.sql`: EAV related to e-commerce.
  - `EAV-Table.sql`: EAV project table creation/alteration.
  - `EAV-Data.sql`: EAV project seed data.
- **Guarantee/BPMN Files (`apps/main/src/sql/BPMN/`):**
  - `Ariakish-Club-Table.sql`: Guarantee/club table creation/alteration.
  - `Ariakish-Club-Data.sql`: Guarantee/club seed data.
  - `BPMN-Table.sql`: BPMN table creation/alteration.
  - `BPMN-Data.sql`: BPMN seed data.
- **Primary Keys:** When adding new data to tables like `BPMNActions`, the primary key (`id`) must **not be hardcoded** to allow the database to assign it automatically.
- **Status Tables (e.g., GSIrangsImportStatus):** Must use a static, **non-identity primary key** (`id INT PRIMARY KEY`). Default values must be inserted manually in the migration script, and a corresponding Enum must be created in the code.

### 🚀 Background Jobs (BullMQ)

- **Library:** Uses **`@nestjs/bullmq`** (NOT `@nestjs/bull`). Modules must import `BullModule` from `@nestjs/bullmq`.
- **Processor Structure:**
  - Processors must extend `WorkerHost`.
  - Decorated with `@Processor(QUEUE_NAME)`.
  - Must implement an `async process(job: Job)` method.
- **Job Structure (Guarantee App):** New jobs are structured in their own directory under `apps/guarantee/src/job/` with subdirectories for `constants` and `processor`.
- **Job Dispatch:** When an entity's status is updated (e.g., a vendor's `isActive` flag), a background job should be dispatched via BullMQ to update the status of related entities (e.g., product inventories).
- **Temporary Files:** Paths for temporary uploaded files (for background processing) should be passed **directly to the job payload** and the file **must be deleted** after processing is complete.

### 💻 Development & Features

- **New Feature Creation:** Create as a self-contained NestJS module (controller, service, module file, and a `dto` subdirectory).
- **Existing Feature Modification:** Modify the existing controller and service files instead of creating new ones.
- **Code Reusability:** Complex or duplicated database query logic should be encapsulated in **private helper methods** in services to be reused (e.g., by `findAll` and `exportExcel`).
- **Refactoring Preference:** If refactoring, new modules should be created alongside the old ones with **distinct API paths** to keep the old versions functional.
- **Filtering DTOs:** Do not use generic types (like `DateFilter`). A base DTO with specific properties (e.g., `beginDate`) is combined with `ListFilter` from `@rahino/query-filter` using NestJS's `IntersectionType`.
- **Validation:** Use `IsNumber` instead of the non-existent `IsBigInt` validator from `class-validator`.

### 📦 E-commerce Specifics

- **Inactive Vendor Filter:** Product queries must filter out inventories from inactive vendors. Use the SQL condition: `isnull(ECVendor.isActive, 1) = 1` for backward compatibility.
- **Reporting:** Located in `apps/e-commerce/src/report/`. Newer modules are in the `based-logistic` subdirectory and use **Sequelize**, even if older modules used Knex.

### 📝 Guarantee Import Logic

- **Libraries:** Uses `'xlsx'` for parsing Excel, `'persian-date'` for Jalali/Gregorian conversions. **`exceljs`** is used for generating Excel files.
- **Import Headers (Persian):** 'برند', 'محصول', 'مدل', 'شناسه رهگیری', 'تاریخ شروع', 'تاریخ انقضا'.
- **Business Logic:** Involves cleaning text, parsing Jalali/Excel dates, handling the **Excel's 1900 leap year bug**, looking up/creating related entities, and preventing duplicates based on serial number.
- **Performance:** Pre-fetch and cache small, frequently accessed lookup tables (e.g., guarantee periods) in memory to avoid database queries inside loops.
- **Shared Services:** Provides a shared `SmsSenderService` (`@rahino/guarantee/shared/sms-sender`).

### 🔧 Testing (Jest)

- **Test Command:** To run tests for a specific app: `npm run test -- apps/<app_name>`.
- **Test Files:**
  - `bpmn`, `e-commerce`, and `guarantee` applications **do not currently contain any test files** that are executed by the specific app test command.
  - The `guarantee` app's e2e config is at `apps/guarantee/test/jest-e2e.json`.
- **Mocking Guards:** Guards (like `JwtGuard`, `PermissionGuard`) can be mocked using `.overrideGuard()` on the testing module builder.
- **Mocking Decorators:** The `@GetUser()` decorator can be mocked using a custom **`NestInterceptor`** to attach a mock user object to the request.
- **E2E Config (`jest-e2e.json`):** Requires a local `moduleNameMapper` with paths **relative to the config file's location** (e.g., using `../`).

### ⚙️ BPMN Dynamic Actions

- **Concept:** Supports `SOURCE_ACTION` dynamic actions, defined in the `BPMNActions` database table, which trigger a corresponding NestJS service.
- **Action Service Location:** Handler services must be located in a dedicated directory within `apps/bpmn/src/dynamic-action/guarantee/`.
- **Action Service Naming:** Services must implement the `ActionServiceImp` interface and follow the **`NotificationSenderFor...ActionService`** convention. This name must be used for the `name` and `actionSource` in the `BPMNActions` table.
- **`actionSource`:** Column should contain the string name of the injectable NestJS service that handles the action.
- **Service Resolution:** The `ActionLoaderService` (`apps/bpmn/src/modules/action-loader/`) dynamically resolves and executes `SOURCE_ACTION` services using `ModuleRef`.
- **Workflow Tracking:** `BPMNRequestHistory.fromUserId` identifies the user who executed an action. `BPMNRequest` holds the `organizationId`.

### 🛠️ Utilities & Best Practices

- **`FileTypeValidator`:** Use a **`RegExp`** for the `fileType` option instead of a direct string to avoid MIME type issues (e.g., with charsets).
- **`RegExp` Special Characters:** When creating a `RegExp` from a string, special characters (e.g., `.`) must be **double-escaped** (e.g., `\\.`) to be treated as literals.
- **API Documentation:** Use `@nestjs/swagger` decorators like `@ApiTags` and `@ApiOperation`.

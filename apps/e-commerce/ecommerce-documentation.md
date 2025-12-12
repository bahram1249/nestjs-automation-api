# E-Commerce Application Documentation

## 1. High-Level Overview

This document provides a technical overview of the E-Commerce application, a modular and scalable solution built with the NestJS framework. The application is designed to handle all aspects of an online store, from product and order management to customer interactions and background processing.

## 2. Application Structure

The application follows a modular architecture, with a clear separation of concerns based on user roles and application features. The main modules are located in the `apps/e-commerce/src` directory and are divided as follows:

-   **`admin/`**: Contains all modules related to the administration panel. This includes features for managing products, orders, logistics, and more.
-   **`client/`**: Holds the public-facing features of the e-commerce store, such as viewing products, brands, and pages. This represents the primary interface for a typical shopper.
-   **`user/`**: Contains features for authenticated users, such as managing their account, addresses, orders, and sessions.
-   **`anonymous/`**: Handles features for anonymous users, such as login and registration.
-   **`shared/`**: Contains cross-cutting concerns like discount logic, custom exceptions, and shared data models (enums, constants).
-   **`job/`**: Contains modules for background processing using message queues (BullMQ).
-   **`report/`**: Contains modules for generating reports.

## 3. Core Features

The e-commerce application provides a rich set of features, including:

### Product Management

-   **Product Catalog:** The application supports a full product catalog with categories, brands, and detailed product information.
-   **Inventory Management:** Inventory levels are tracked and updated automatically.
-   **Search and Filtering:** The `ProductService` (`apps/e-commerce/src/client/product/product.service.ts`) provides robust search and filtering capabilities.

### Order Management

-   **Shopping Cart:** Users can add products to a shopping cart and proceed to checkout.
-   **Order Processing:** The order lifecycle is managed from placement to fulfillment and delivery.
-   **Order History:** Authenticated users can view their order history.

### Discount Engine

-   A sophisticated discount engine allows for various types of promotions and discounts to be applied to products and orders. The core logic can be found in the `apps/e-commerce/src/shared/discount` directory.

### Logistics

-   The application supports logistics and shipment tracking, with dedicated modules in the `admin/logistic-section` directory.

### Customization (`customer-customize`)

-   A special `customer-customize` module suggests bespoke functionality. Given the project's context, this might be related to customizing products like gold items.

## 4. Background Jobs

The application uses **BullMQ** for handling background jobs. These jobs are defined in the `apps/e-commerce/src/job` directory and are used for tasks such as:

-   **Analytics:** Processing and aggregating analytics data.
-   **Caching:** Caching frequently accessed data to improve performance.
-   **Data Cleanup:** Performing regular data cleanup tasks.

## 5. API Documentation

The application's API is documented using **Swagger**. You can access the API documentation by running the application and navigating to the `/api` endpoint in your browser.

## 6. Development Guide

### Setup

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Set up your environment variables by copying `.env.sample` to `.env` and filling in the required values.

### Running the Application

To run the e-commerce application in development mode, use the following command:

```bash
npm run start:dev e-commerce
```

### Contributing

-   Follow the existing code style and conventions.
-   Write unit tests for new features.
-   Ensure that all tests pass before submitting a pull request.

## 7. Client API Endpoints

This section documents the API endpoints available in the `client` module.

### Products (`/api/ecommerce/products`)

This module provides endpoints for accessing product information.

#### `GET /`

-   **Description:** Retrieves a paginated list of all products.
-   **Query Parameters:**
    -   `filter`: A `GetProductDto` object that can be used to filter the results. This includes options for filtering by price, brand, color, vendor, and more.
-   **Returns:** A paginated list of products.

#### `GET /byVendorNearby`

-   **Description:** Retrieves a list of products from vendors near a given location.
-   **Query Parameters:**
    -   `filter`: A `GetProductLatLonDto` object that includes latitude and longitude, as well as all the filtering options from `GetProductDto`.
-   **Returns:** A list of products from nearby vendors.

#### `GET /priceRange`

-   **Description:** Gets the minimum and maximum price for products that match the given filter.
-   **Query Parameters:**
    -   `filter`: A `GetUnPriceDto` object to filter the products.
-   **Returns:** An object containing the minimum and maximum price.

#### `GET /:slug`

-   **Description:** Retrieves a single product by its slug.
-   **Parameters:**
    -   `slug`: The slug of the product.
-   **Query Parameters:**
    -   `filter`: A `GetProductDto` object.
-   **Returns:** The product object.

#### `GET /id/:id`

-   **Description:** Retrieves a single product by its ID.
-   **Parameters:**
    -   `id`: The ID of the product.
-   **Query Parameters:**
    -   `filter`: A `GetProductDto` object.
-   **Returns:** The product object.

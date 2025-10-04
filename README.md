## Description

## Installation

```bash
$ npm install
```

## Initial database

```bash
$ sudo docker pull mcr.microsoft.com/mssql/server:2022-latest
$ sudo docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<YourStrong@Passw0rd>" \
   -p 1433:1433 --name sql1 --hostname sql1 \
   -d \
   mcr.microsoft.com/mssql/server:2022-latest
```

create a .env file in root of project and set the variable like below:

```bash
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASS=<YourStrong@Passw0rd>
DB_DIALECT=mssql
DB_NAME_DEVELOPMENT=nest
DB_AUTO_LOAD_MODELS=true
DB_SYNCHRONIZE=true
DB_TIMEZONE='fa-IR'
DB_LOG=false
```

Create a database in your sql server instance with the name of your choose for your DB_NAME

We highly suggest you to disable DB_SYNCHRONIZE and use sql scripts in apps/core/sql

## Set Authentication and server variable

In .env file set variable like below:

```bash
JWT_SECRET=<YourStrongSecret>
TOKEN_EXPIRATION=48h
BEARER=Bearer
HOST_PORT=3000
HOST_NAME=0.0.0.0
```

## Site settings

```bash
PROJECT_NAME="<SET_YOUR_PROJECT_NAME> from list: [/apps/main/src/dynamic-provider]"
LOGO_PATH='/theme/discountcoffe/assets/img/png/logo.svg'
TEMP_ATTACHMENT="/tmp/attachmentFile"
PROFILE_PATH_ATTACHMENT="/profile/big"
PROFILE_PATH_THUMB_ATTACHMENT="/profile/thumb"
SESSION_KEY=<YourStrongSecret>
QR_PATH="/qrcode"
SITE_NAME="<YOUR_SITE_NAME>"
```

## Throttler Config

```bash
THROTTLER_SHORT_LIMIT=40
THROTTLER_MEDIUM_LIMIT=200
THROTTLER_LONG_LIMIT=500
```

## If you are Using REDIS

```bash
REDIS_ADDRESS=<YOUR_REDIS_HOST>
REDIS_PORT=<YOUR_REDIS_PORT>
REDIS_PASSWORD=<YOUR_REDIS_PASSWORD>
```

## If you are Using MinIO

```bash
MINIO_ENDPOINT=<YOUR_MINIO_ENDPOINT>
MINIO_PORT=<YOUR_MINIO_PORT>
MINIO_ACCESS_KEY=<YOUR_MINIO_ACCESS_KEY>
MINIO_SECRET_KEY=<YOUR_MINIO_SECRET_KEY>
```

## IF your are using ECommerce Project

```bash
BRAND_IMAGE_HEIGHT=700
BRAND_IMAGE_WIDTH=700
GUARANTEE_IMAGE_HEIGHT=700
GUARANTEE_IMAGE_WIDTH=700
ENTITY_TYPE_IMAGE_HEIGHT=700
ENTITY_TYPE_IMAGE_WIDTH=700
PRODUCT_PHOTO_IMAGE_HEIGHT=700
PRODUCT_PHOTO_IMAGE_WIDTH=700
VENDOR_IMAGE_HEIGHT=700
VENDOR_IMAGE_WIDTH=700
USER_SESSION_LIMIT_DAY=30
SKU_PREFIX="<SET_PREFIX_SKU_ECOMMERCE>"
```

# Bullmq job

```bash
PRODUCT_INVENTORY_STATUS_KEEPJOBS=100
```

# SMS

```bash
SMS_USERNAME=<Api_Username>
SMS_PASSWORD=<Api_Password>
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Swagger api doc

Open the api doc url:

```bash
http://yourhost:port/api/core
http://yourhost:port/api/ecommerce
http://yourhost:port/api/eav
http://yourhost:port/api/bpmn
```

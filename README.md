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
DB_LOG=false
```

Create a database in your sql server instance with the name of your choose for your DB_NAME

We highly suggest you to disable DB_SYNCHRONIZE and use sql scripts in apps/core/sql

## Set Authentication variable

In .env file set variable like below:

```bash
JWT_SECRET=<YourStrongSecret>
TOKEN_EXPIRATION=48h
BEARER=Bearer
HOST_PORT=3000
HOST_NAME=0.0.0.0
TEMP_ATTACHMENT="/tmp/attachmentFile"
PROFILE_PATH_ATTACHMENT="/profile/big"
PROFILE_PATH_THUMB_ATTACHMENT="/profile/thumb"
SESSION_KEY=<YourStrongSecret>
QR_PATH="/qrcode"
SITE_NAME="<YOUR_SITE_NAME>"
REDIS_ADDRESS=<YOUR_REDIS_HOST>
REDIS_PORT=<YOUR_REDIS_PORT>
REDIS_PASSWORD=<YOUR_REDIS_PASSWORD>
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
http://yourhost:port/api
```

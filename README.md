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
```

Create a database in your sql server instance with the name of your choose for your DB_NAME

## Set Authentication variable

In .env file set variable like below:

```bash
JWT_SECRET=<YourStrongSecret>
TOKEN_EXPIRATION=48h
BEARER=Bearer
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

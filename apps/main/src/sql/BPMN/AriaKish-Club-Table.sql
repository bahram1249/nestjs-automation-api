
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-providers-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('ariakish'))
    )
    BEGIN

        CREATE TABLE GSProviders
        (
            id                          int                                 PRIMARY KEY,
            title                       nvarchar(256)                       NOT NULL,
            [createdAt]				    datetimeoffset			            NOT NULL,
            [updatedAt]				    datetimeoffset			            NOT NULL,
        )


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-providers-v1', GETDATE(), GETDATE()
    END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-product-types-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('ariakish'))
    )
    BEGIN

        CREATE TABLE GSProductTypes
        (
            id                          int identity(1,1)                   PRIMARY KEY,
            title                       nvarchar(256)                       NOT NULL,
            providerId                  int                                 NULL
                CONSTRAINT FK_GSProductTypes_ProviderId
                    FOREIGN KEY REFERENCES GSProviders(id),
            mandatoryAttendance         bit                                 NULL,
            description                 ntext                               NULL,
            [createdAt]				    datetimeoffset			            NOT NULL,
            [updatedAt]				    datetimeoffset			            NOT NULL,
        )


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-product-types-v1', GETDATE(), GETDATE()
    END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-brands-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('ariakish'))
    )
    BEGIN

        CREATE TABLE GSBrands
        (
            id                          int identity(1,1)                   PRIMARY KEY,
            title                       nvarchar(256)                       NOT NULL,
            providerId                  int                                 NULL
                CONSTRAINT FK_GSBrands_ProviderId
                    FOREIGN KEY REFERENCES GSProviders(id),
            description                 ntext                               NULL,
            [createdAt]				    datetimeoffset			            NOT NULL,
            [updatedAt]				    datetimeoffset			            NOT NULL,
        )


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-brands-v1', GETDATE(), GETDATE()
    END

GO



IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guaranteeconfirmstatuses-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('ariakish'))
    )
    BEGIN

        CREATE TABLE GSGuaranteeConfirmStatuses
        (
            id                          int									PRIMARY KEY,
			title						nvarchar(256)						NOT NULL,
            [createdAt]				    datetimeoffset			            NOT NULL,
            [updatedAt]				    datetimeoffset			            NOT NULL,
        )

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-guaranteeconfirmstatuses-v1', GETDATE(), GETDATE()
    END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guaranteeperiods-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('ariakish'))
    )
    BEGIN

        CREATE TABLE GSGuaranteePeriods
        (
            id                          int identity(1,1)					PRIMARY KEY,
			title						nvarchar(256)						NOT NULL,
			providerText				nvarchar(256)						NULL,
            [createdAt]				    datetimeoffset			            NOT NULL,
            [updatedAt]				    datetimeoffset			            NOT NULL,
        )


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-guaranteeperiods-v1', GETDATE(), GETDATE()
    END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guaranteetypes-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('ariakish'))
    )
    BEGIN

        CREATE TABLE GSGuaranteeTypes
        (
            id                          int					                PRIMARY KEY,
			title						nvarchar(256)						NOT NULL,
            [createdAt]				    datetimeoffset			            NOT NULL,
            [updatedAt]				    datetimeoffset			            NOT NULL,
        )


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-guaranteetypes-v1', GETDATE(), GETDATE()
    END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guarantees-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('ariakish'))
    )
    BEGIN

        CREATE TABLE GSGuarantess
        (
            id                          bigint identity(1,1)                PRIMARY KEY,
            providerId                  int                                 NULL
                CONSTRAINT FK_GSGurantees_ProviderId
                    FOREIGN KEY REFERENCES GSProviders(id),
			brandId						int									NULL
				CONSTRAINT FK_GSGuarantees_BrandId
					FOREIGN KEY REFERENCES GSBrands(id),
			guaranteeTypeId				int									NOT NULL
				CONSTRAINT FK_GSGuarantees_GuaranteeTypeId
					FOREIGN KEY REFERENCES GSGuaranteeTypes(id),
			guaranteePeriodId			int									NULL
				CONSTRAINT FK_GSGuarantees_GuaranteePeriodId
					FOREIGN KEY REFERENCES GSGuaranteePeriods(id),
			guaranteeConfirmStatusId	int									NOT NULL
				CONSTRAINT FK_GSGuarantees_GuranteeConfirmStatusId
					FOREIGN KEY REFERENCES GSGuaranteeConfirmStatuses(id),
			prefixSerial				nvarchar(256)						NULL,
			serialNumber				nvarchar(256)						NOT NULL,
			startDate					datetime							NOT NULL,
			endDate						datetime							NOT NULL,
			variantName					nvarchar(256)						NULL,
            description                 ntext                               NULL,
            [createdAt]				    datetimeoffset			            NOT NULL,
            [updatedAt]				    datetimeoffset			            NOT NULL,
        )


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-guarantees-v1', GETDATE(), GETDATE()
    END

GO


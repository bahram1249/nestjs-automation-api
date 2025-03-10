
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-providers-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
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
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
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

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-product-types-v2'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN

        ALTER TABLE GSProductTypes
        ADD providerBaseId int null


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-product-types-v2', GETDATE(), GETDATE()
    END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-brands-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
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

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-brands-v2'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN

        ALTER TABLE GSBrands
        ADD providerBaseId int null
        


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-brands-v2', GETDATE(), GETDATE()
    END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-variants-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN

        CREATE TABLE GSVariants
        (
            id                          int identity(1,1)                   PRIMARY KEY,
            title                       nvarchar(256)                       NOT NULL,
            providerId                  int                                 NULL
                CONSTRAINT FK_GSVariants_ProviderId
                    FOREIGN KEY REFERENCES GSProviders(id),
            description                 ntext                               NULL,
            providerBaseId              int                                 NULL,
            [createdAt]				    datetimeoffset			            NOT NULL,
            [updatedAt]				    datetimeoffset			            NOT NULL,
        )


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-variants-v1', GETDATE(), GETDATE()
    END

GO



IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guaranteeconfirmstatuses-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
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
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
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
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
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

-- gs-guarantees-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guarantees-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN

        CREATE TABLE GSGuarantees
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
			allowedDateEnterProduct		datetime							NULL,
			variantName					nvarchar(256)						NULL,
            description                 ntext                               NULL,
            [createdAt]				    datetimeoffset			            NOT NULL,
            [updatedAt]				    datetimeoffset			            NOT NULL,
        )


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-guarantees-v1', GETDATE(), GETDATE()
    END

GO

-- gs-guarantees-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guarantees-v2'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN

        ALTER TABLE GSGuarantees
        ADD providerBaseId int null


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-guarantees-v2', GETDATE(), GETDATE()
    END

GO

-- gs-guarantees_v3
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guarantees-v3'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN

        ALTER TABLE GSGuarantees
        ADD variantId int null
            CONSTRAINT FK_GSGuarantees_VariantId
                FOREIGN KEY REFERENCES GSVariants(id)


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-guarantees-v3', GETDATE(), GETDATE()
    END

GO

-- gs-guarantees_v4
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guarantees-v4'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN

        ALTER TABLE GSGuarantees
        ADD productTypeId int not null
            CONSTRAINT FK_GSGuarantees_ProductTypeId
                FOREIGN KEY REFERENCES GSProductTypes(id)


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-guarantees-v4', GETDATE(), GETDATE()
    END

GO

-- gs-guarantees_v5
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guarantees-v5'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN

        ALTER TABLE GSGuarantees
            ALTER COLUMN productTypeId int null
            

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-guarantees-v5', GETDATE(), GETDATE()
    END

GO

-- gs-assigned-guarantees-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-assigned-guarantees-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN

        CREATE TABLE GSAssignedGuarantees
        (
            id                          bigint identity(1,1)                   PRIMARY KEY,
            guaranteeId                 bigint                              NOT NULL
                CONSTRAINT FK_GSAssignedGuarantees_GuaranteeId
                    FOREIGN KEY REFERENCES GSGuarantees(id),
            userId                      bigint                              NOT NULL
                CONSTRAINT FK_GSAssignedGuarantees_UserId
                    FOREIGN KEY REFERENCES Users(id),
            isDeleted                   bit                                 NULL,
            [createdAt]				    datetimeoffset			            NOT NULL,
            [updatedAt]				    datetimeoffset			            NOT NULL,
        )


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-assigned-guarantees-v1', GETDATE(), GETDATE()
    END

GO

-- gs-provinces
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-provinces-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSProvinces (
		id							int							PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		[slug]						nvarchar(256)				NOT NULL,
		isDeleted					bit							NULL,
		[order]						int							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-provinces-v1', GETDATE(), GETDATE()
END

GO

-- gs-cities
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-cities-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSCities (
		id							int							PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		[slug]						nvarchar(256)				NULL,
		
		[neighborhoodBase]			bit							NULL,
		[provinceId]				int							NOT NULL
			CONSTRAINT FK_GSCities_ProvinceId
				FOREIGN KEY REFERENCES GSProvinces(id),
		[order]						int							NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-cities-v1', GETDATE(), GETDATE()
END

GO

-- gs-neighborhoods
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-neighborhoods-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSNeighborhoods (
		id							int							PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		[slug]						nvarchar(256)				NULL,
		[order]						int							NULL,
		[cityId]				int								NOT NULL
			CONSTRAINT FK_GSNeighborhoods_CityId
				FOREIGN KEY REFERENCES GSCities(id),
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-neighborhoods-v1', GETDATE(), GETDATE()
END

GO

-- gs-addresses
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-addresses-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSAddresses (
		id							bigint	identity(1,1)		PRIMARY KEY,
		name						nvarchar(512)				NULL,
		[latitude]					nvarchar(256)				NULL,
		[longitude]					nvarchar(256)				NULL,
		[provinceId]				int							NOT NULL
			CONSTRAINT FK_GSAddresses_ProvinceId
				FOREIGN KEY REFERENCES GSProvinces(id),
		[cityId]					int							NOT NULL
			CONSTRAINT FK_GSAddresses_CityId
				FOREIGN KEY REFERENCES GSCities(id),
		[neighborhoodId]			int							NULL
			CONSTRAINT FK_GSAddresses_NeighborhoodId
				FOREIGN KEY REFERENCES GSNeighborhoods(id),
		street						nvarchar(1024)				NULL,
		alley						nvarchar(1024)				NULL,
		plaque						nvarchar(256)				NULL,
		floorNumber					nvarchar(25)				NULL,
		userId						bigint						NULL
			CONSTRAINT FK_GSAddresses_UserId
				FOREIGN KEY REFERENCES Users(id),
        postalCode                  nvarchar(128)               NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-addresses-v1', GETDATE(), GETDATE()
END

GO

-- gs-guaranteeorganizations
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guaranteeorganizations-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSGuaranteeOrganizations (
		id				            int                         NOT NULL
	        CONSTRAINT FK_GSGuaranteeOrganizations_Id
	            FOREIGN KEY REFERENCES BPMNOrganizations(id),
		addressId                   bigint                      NOT NULL
		    CONSTRAINT FK_GSGuaranteeOrganizations_AddressId
		        FOREIGN KEY REFERENCES GSAddresses(id),
		userId						bigint						NOT NULL
			CONSTRAINT FK_GSGuaranteeOrganizations_UserId
				FOREIGN KEY REFERENCES Users(id),
        isNationwide                bit                         NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
        CONSTRAINT PK_GSGuaranteeOrganizations_OrganizationId_AddressId
	            PRIMARY KEY CLUSTERED (id)
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-guaranteeorganizations-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guaranteeorganizations-v2'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSGuaranteeOrganizations
        ADD isOnlinePayment bit null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-guaranteeorganizations-v2', GETDATE(), GETDATE()
END

GO
-- gs-guaranteeorganizationcontracts
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guaranteeorganizationcontracts-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSGuaranteeOrganizationContracts (
		id                          bigint identity(1,1)        NOT NULL,
        organizationId              int                         NOT NULL
            CONSTRAINT FK_GSGuaranteeOrganizationContracts_OrganizationId
                FOREIGN KEY REFERENCES GSGuaranteeOrganizations(id),
        startDate                   datetime                    NOT NULL,
        endDate                     datetime                    NOT NULL,
        representativeShare         decimal                     NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
        CONSTRAINT PK_GSGuaranteeOrganizationContracts_OrganizationId_Id
	        PRIMARY KEY CLUSTERED (organizationId, id)
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-guaranteeorganizationcontracts-v1', GETDATE(), GETDATE()
END

GO

-- gs-guaranteeorganizationcontracts
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guaranteeorganizationcontracts-v2'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSGuaranteeOrganizationContracts 
        ADD isDeleted bit null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-guaranteeorganizationcontracts-v2', GETDATE(), GETDATE()
END

GO


-- gs-request-types like : install or repair
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-request-types-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSRequestTypes (
		id                          int                         PRIMARY KEY,
        title                       nvarchar(256)               NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-request-types-v1', GETDATE(), GETDATE()
END

GO

-- gs-request-categories like : normal gaurantee, vip guarantee, without guarantee
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-request-categories-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSRequestCategories (
		id                          int                         PRIMARY KEY,
        title                       nvarchar(256)               NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-request-categories-v1', GETDATE(), GETDATE()
END

GO

-- gs-request-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-requests-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSRequests (
		id                          bigint                      NOT NULL
            CONSTRAINT FK_GSRequests_Id
                FOREIGN KEY REFERENCES BPMNRequests(id),
        requestTypeId               int                         NOT NULL
            CONSTRAINT FK_GSRequests_RequestTypeId
                FOREIGN KEY REFERENCES GSRequestTypes(id),
        requestCategoryId           int                         NOT NULL
            CONSTRAINT FK_GSRequests_RequestCategoryId
                FOREIGN KEY REFERENCES GSRequestCategories(id),
        brandId                     int                         NULL
            CONSTRAINT FK_GSRequests_BrandId
                FOREIGN KEY REFERENCES GSBrands(id),
        variantId                   int                         NULL
            CONSTRAINT FK_GSRequests_VariantId
                FOREIGN KEY REFERENCES GSVariants(id),
        productTypeId               int                         NULL
            CONSTRAINT FK_GSRequests_ProductTypeId
                FOREIGN KEY REFERENCES GSProductTypes(id),      
        organizationId              int                         NULL
            CONSTRAINT FK_GSRequests_OrganizationId
                FOREIGN KEY REFERENCES GSGuaranteeOrganizations(id),
        guaranteeId                 bigint                      NULL
            CONSTRAINT FK_Requests_GuaranteeId
                FOREIGN KEY REFERENCES GSGuarantees(id),
        userId                      bigint                      NOT NULL
            CONSTRAINT FK_GSRequests_UserId
                FOREIGN KEY REFERENCES Users(id),
        phoneNumber                 nvarchar(128)               NULL,
        addressId                   bigint                      NOT NULL
            CONSTRAINT FK_GSRequests_AddressId
                FOREIGN KEY REFERENCES GSAddresses(id),
        isDeleted                   bit                         NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
        CONSTRAINT PK_GSRequests_Id
	        PRIMARY KEY CLUSTERED (id)
	);

    CREATE NONCLUSTERED INDEX NIX_GSRequests_UserId ON GSRequests(id);
    CREATE NONCLUSTERED INDEX NIX_GSRequests_IsDeleted ON GSRequests(isDeleted);
    CREATE NONCLUSTERED INDEX NIX_GSRequests_GuaranteeId ON GSRequests(guaranteeId);
    CREATE NONCLUSTERED INDEX NIX_GSRequests_OrganizationId ON GSRequests(organizationId);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-requests-v1', GETDATE(), GETDATE()
END

GO
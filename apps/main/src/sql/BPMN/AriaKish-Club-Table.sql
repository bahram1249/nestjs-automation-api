
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


-- gs-vip-bundle-types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-vip-bundle-types-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN


	CREATE TABLE GSVipBundleTypes (
		id                          int identity(1,1)           PRIMARY KEY,
        title                       nvarchar(256)               NOT NULL,
		monthPeriod					int							NOT NULL,
		cardColor					nvarchar(128)				NOT NULL,
		price						bigint 						NOT NULL,
		fee							bigint						NOT NULL,
		unitPriceId					int							NOT NULL
			CONSTRAINT FK_GSVipBundleTypes_UnitPriceId
				FOREIGN KEY REFERENCES GSUnitPrices(id),
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-vip-bundle-types-v1', GETDATE(), GETDATE()
END

GO


-- gs-vip-generator-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-vip-generator-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSVipGenerators (
		id                          bigint identity(1,1)           PRIMARY KEY,
        title                       nvarchar(256)                   NOT NULL,
		vipBundleTypeId             int                             NOT NULL
	        CONSTRAINT FK_GSVipGenerators_VipBundleTypeId
	                FOREIGN KEY REFERENCES GSVipBundleTypes(id),
        isCompleted                 bit                             NOT NULL,
        qty                         int                             NOT NULL,
        price                       bigint                          NOT NULL,
        fee                         bigint                          NOT NULL,
        userId                      bigint                          NOT NULL
            CONSTRAINT FK_GSVipGenerators_UserId
                FOREIGN KEY REFERENCES Users(id),
		[createdAt]					datetimeoffset				    NOT NULL,
		[updatedAt]					datetimeoffset				    NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-vip-generator-v1', GETDATE(), GETDATE()
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


-- gs-guarantees_v6
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guarantees-v6'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN


    ALTER TABLE GSGuarantees
        ADD vipBundleTypeId int null
            CONSTRAINT GSGuarantees_VipBundleTypeId
                FOREIGN KEY REFERENCES GSVipBundleTypes(id),
            totalCredit bigint null,
            availableCredit bigint null

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-guarantees-v6', GETDATE(), GETDATE()
    END

GO


-- gs-guarantees_v7
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guarantees-v7'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN


    ALTER TABLE GSGuarantees
        ADD vipGeneratorId bigint null
            CONSTRAINT FK_GSGuarantee_VipGeneratorId
                FOREIGN KEY REFERENCES GSVipGenerators(id)

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'gs-guarantees-v7', GETDATE(), GETDATE()
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

-- gs-provinces
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-provinces-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSProvinces
		add geographyPolygon geography null


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-provinces-v2', GETDATE(), GETDATE()
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

-- gs-addresses-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-addresses-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSAddresses 
	ALTER COLUMN cityId int null


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-addresses-v2', GETDATE(), GETDATE()
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


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-guaranteeorganizations-v3'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSGuaranteeOrganizations
        ADD code nvarchar(256) null,
			licenseDate datetime null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-guaranteeorganizations-v3', GETDATE(), GETDATE()
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
        representativeShare         decimal(10, 2)              NOT NULL,
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


-- gs-shipping-way
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-shipping-way-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN


	CREATE TABLE GSShippingWays (
		id                          int                         PRIMARY KEY,
        title                       nvarchar(256)               NOT NULL,
        icon                        nvarchar(256)               NOT NULL,
		isClientSide                bit                         NULL,
        isCartableSide              bit                         NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-shipping-way-v1', GETDATE(), GETDATE()
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


-- gs-request-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-requests-v2'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSRequests
	ADD technicalUserId bigint null
		CONSTRAINT FK_GSRequests_TechnicalUserId
			FOREIGN KEY REFERENCES Users(id)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-requests-v2', GETDATE(), GETDATE()
END

GO


-- gs-request-v3
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-requests-v3'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSRequests
	ADD technicalUserVisitDate datetime null,
		technicalUserVisitTime nvarchar(128) null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-requests-v3', GETDATE(), GETDATE()
END

GO

-- gs-request-v4
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-requests-v4'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSRequests
	ADD clientShipmentWayId int null
	        CONSTRAINT FK_GSRequests_ClientShipmentWatyId
	            FOREIGN KEY REFERENCES GSShippingWays(id),
	    clientShipmentWayTrackingCode nvarchar(256) null,
	    cartableShipmentWayId int null
	        CONSTRAINT FK_GSRequests_CartableShipmentWayId
	            FOREIGN KEY REFERENCES GSShippingWays(id),
	    cartableShipmentWayTrackingCode nvarchar(256) null


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-requests-v4', GETDATE(), GETDATE()
END

GO

-- gs-request-v5
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-requests-v5'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSRequests
		ADD mandatoryAttendance bit null


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-requests-v5', GETDATE(), GETDATE()
END

GO


-- gs-request-v6
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-requests-v6'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSRequests
		ADD isCash bit null


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-requests-v6', GETDATE(), GETDATE()
END

GO


-- gs-unit-prices v1 :-> rial, toman
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-unit-prices-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSUnitPrices (
		id                          int                         PRIMARY KEY,
        title                       nvarchar(256)               NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-unit-prices-v1', GETDATE(), GETDATE()
END

GO

-- gs-additional-package
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-additional-packages-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSAdditionalPackages (
		id                          int identity(1,1)           PRIMARY KEY,
        title                       nvarchar(256)               NOT NULL,
        price                       bigint                      NOT NULL,
        unitPriceId                 int                         NOT NULL
            CONSTRAINT FK_GSAdditionalPackages_UnitPriceId
                FOREIGN KEY REFERENCES GSUnitPrices(id),
        isDeleted                   bit                         NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-additional-packages-v1', GETDATE(), GETDATE()
END

GO

-- gs-assignedguarantee-additional-package
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-assginedguaranteeadditionalpackage-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSAssignedGuaranteeAdditionalPackages (
		id                          bigint identity(1,1)       PRIMARY KEY,
        assignedGuaranteeId         bigint                      NOT NULL
            CONSTRAINT FK_GSAssignedGuaranteeAdditionalPackages_AssignedGuaranteeId
                FOREIGN KEY REFERENCES GSAssignedGuarantees(id),
        additionalPackageId         int                         NOT NULL
            CONSTRAINT FK_GSAssignedGuaranteeAdditionalPackages_additionalPackageId
                FOREIGN KEY REFERENCES GSAdditionalPackages(id),
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-assginedguaranteeadditionalpackage-v1', GETDATE(), GETDATE()
END

GO


-- gs-factor-status
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factor-statuses-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSFactorStatuses (
		id                          int                         PRIMARY KEY,
        title                       nvarchar(256)               NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factor-statuses-v1', GETDATE(), GETDATE()
END

GO


-- gs-factor-type
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factor-types-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSFactorTypes (
		id                          int                         PRIMARY KEY,
        title                       nvarchar(256)               NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factor-types-v1', GETDATE(), GETDATE()
END

GO


-- gs-factors
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factors-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSFactors (
		id                          bigint identity(1,1)        PRIMARY KEY,
        unitPriceId                 int                         NOT NULL
            CONSTRAINT FK_GSFactors_UnitPriceId
                FOREIGN KEY REFERENCES GSUnitPrices(id),
        totalPrice                  bigint                      NOT NULL,
        factorStatusId              int                         NOT NULL
            CONSTRAINT FK_GSFactors_FactorStatusId
                FOREIGN KEY REFERENCES GSFactorStatuses(id),
        factorTypeId                int                         NOT NULL
            CONSTRAINT FK_GSFactors_FactorTypeId
                FOREIGN KEY REFERENCES GSFactorTypes(id),
        userId                      bigint                      NOT NULL
            CONSTRAINT FK_GSFactors_UserId
                FOREIGN KEY REFERENCES Users(id),
        expireDate                  datetime                    NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factors-v1', GETDATE(), GETDATE()
END

GO



-- gs-factor-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factors-v2'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSFactors 
        ADD requestId bigint NULL
            CONSTRAINT FK_GSFactors_RequestId
                FOREIGN KEY REFERENCES GSRequests(id)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factors-v2', GETDATE(), GETDATE()
END

GO


-- gs-factor-v3
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factors-v3'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSFactors
        ADD guaranteeId bigint null
	        CONSTRAINT FK_GSFactors_GuaranteeId
	            FOREIGN KEY REFERENCES GSGuarantees(id)


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factors-v3', GETDATE(), GETDATE()
END

GO

-- gs-factor-v4
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factors-v4'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSFactors
        ADD representativeShareOfSolution bigint null


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factors-v4', GETDATE(), GETDATE()
END

GO

-- gs-factor-v5
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factors-v5'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSFactors
        Add isDeleted bit null


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factors-v5', GETDATE(), GETDATE()
END

GO



-- gs-factor-v6
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factors-v6'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSFactors
        Add createdByUserId bigint null
	        CONSTRAINT FK_GSFactor_CreatedByUserId
	            FOREIGN KEY REFERENCES Users(id)


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factors-v6', GETDATE(), GETDATE()
END

GO


-- gs-factor-v7
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factors-v7'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSFactors
        Add settlementDate datetime null


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factors-v7', GETDATE(), GETDATE()
END

GO



-- gs-factor-v8
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factors-v8'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSFactors
        Add traverseRequestId bigint null,
            traverseRequestStateId bigint null,
            traverseNodeId int null,
            traverseNodeCommandId int null


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factors-v8', GETDATE(), GETDATE()
END

GO


-- gs-factor-v9
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factors-v9'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSFactors
        Add representativeSharePercent decimal(10,2) null,
			sumOfSolutionIncludeWarranty bigint null,
			sumOfSolutionOutOfWarranty bigint null,
			sumOfPartIncludeWarranty bigint null,
			sumOfPartOutOfWarranty bigint null,
			atLeastPayFromCustomerForOutOfWarranty bigint null,
			givenCashPayment bigint null,
			extraCashPaymentForUnavailableVip bigint null,
			organizationToCompany bigint null,
			companyToOrganization bigint null,
			sumOfOrganizationToCompany bigint null,
			sumOfCompanyToOrganization bigint null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factors-v9', GETDATE(), GETDATE()
END

GO


-- gs-paymentways
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-paymentways-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSPaymentWays (
		id                          int                         PRIMARY KEY,
        title                       nvarchar(256)               NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-paymentways-v1', GETDATE(), GETDATE()
END

GO


-- gs-paymentgateways
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-paymentgateways-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSPaymentGateways (
		id                          int identity(1,1)           PRIMARY KEY,
        title                       nvarchar(256)               NOT NULL,
        paymentWayId                int                         NOT NULL
            CONSTRAINT FK_GSPaymentGateways_PaymentWayId
                FOREIGN KEY REFERENCES GSPaymentWays(id),
        serviceProvider             nvarchar(1024)              NULL,
        username                    nvarchar(256)               NULL,
        password                    nvarchar(256)               NULL,
        clientToken                 nvarchar(256)               NULL,
        secretToken                 nvarchar(256)               NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-paymentgateways-v1', GETDATE(), GETDATE()
END

GO

-- gs-paymentgateways-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-paymentgateways-v2'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSPaymentGateways
	    ADD icon nvarchar(256) null,
	        merchantId nvarchar(256) null,
	        terminalId nvarchar(256) null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-paymentgateways-v2', GETDATE(), GETDATE()
END

GO

-- gs-paymentgateways-v3
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-paymentgateways-v3'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSPaymentGateways
	    ADD merchantKey nvarchar(256) null


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-paymentgateways-v3', GETDATE(), GETDATE()
END

GO

-- gs-transaction-statuses
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-transaction-statuses-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSTransactionStatuses (
		id                          int                         PRIMARY KEY,
        title                       nvarchar(256)               NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-transaction-statuses-v1', GETDATE(), GETDATE()
END

GO


-- gs-transactions
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-transactions-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSTransactions (
		id                          bigint identity(1,1)        PRIMARY KEY,
        transactionStatusId         int                         NOT NULL
            CONSTRAINT FK_GSTransactions_TransactionStatusId
                FOREIGN KEY REFERENCES GSTransactionStatuses(id),
        unitPriceId                 int                         NOT NULL
            CONSTRAINT FK_GSTransactions_UnitPriceId
                FOREIGN KEY REFERENCES GSUnitPrices(id),
        totalPrice                  bigint                      NOT NULL,
        factorId                    bigint                      NOT NULL
            CONSTRAINT FK_GSTransactions_FactorId
                FOREIGN KEY REFERENCES GSFactors(id),
        userId                      bigint                      NOT NULL
            CONSTRAINT FK_GSTransactions_UserId
                FOREIGN KEY REFERENCES Users(id),
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-transactions-v1', GETDATE(), GETDATE()
END

GO

-- gs-transactions-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-transactions-v2'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSTransactions
	    ADD paymentGatewayId int not null
	        CONSTRAINT FK_GSTransations_PaymentGatewayId
	            FOREIGN KEY REFERENCES GSPaymentGateways(id),
	        token nvarchar(512) null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-transactions-v2', GETDATE(), GETDATE()
END

GO

-- gs-transactions-v3
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-transactions-v3'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSTransactions
	    ADD signData nvarchar(2048) null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-transactions-v3', GETDATE(), GETDATE()
END

GO

-- gs-factor-additional-packages
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factor-additional-packages-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSFactorAdditionalPackages (
		id                          bigint identity(1,1)        PRIMARY KEY,
        factorId                    bigint                      NOT NULL
            CONSTRAINT FK_GSFactorAdditionalPackages_FactorId
                FOREIGN KEY REFERENCES GSFactors(id),
        additionalPackageId         int                         NOT NULL
            CONSTRAINT FK_GSFactorAdditionalPackages_AdditionalPackageId
                FOREIGN KEY REFERENCES GSAdditionalPackages(id),
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factor-additional-packages-v1', GETDATE(), GETDATE()
END

GO


-- gs-factor-additional-packages-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factor-additional-packages-v2'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSFactorAdditionalPackages
	    ADD itemPrice bigint null,
	        unitPriceId int null
	            CONSTRAINT FK_GSFActorAdditionalPackages_UnitPriceId
	                FOREIGN KEY REFERENCES GSUnitPrices(id)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factor-additional-packages-v2', GETDATE(), GETDATE()
END

GO

-- gs-assignedproductassignedguarantees
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-assignedproductassignedguarantees-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN


	CREATE TABLE GSAssignedProductAssignedGuarantees (
		id                          bigint identity(1,1)        PRIMARY KEY,
        assignedGuaranteeId         bigint                      NOT NULL
            CONSTRAINT FK_AssignedProductAssignedGuarantees_AssignedGuaranteeId
                FOREIGN KEY REFERENCES GSAssignedGuarantees(id),
        productTypeId               int                         NOT NULL
            CONSTRAINT FK_AssignedProductAssignedGuarantees_ProductTypeId
                FOREIGN KEY REFERENCES GSProductTypes(id),
        variantId                   int                         NOT NULL
            CONSTRAINT FK_AssignedProductAssignedGuarantees_VaraintId
                FOREIGN KEY REFERENCES GSVariants(id),
        brandId                     int                         NOT NULL
            CONSTRAINT FK_AssignedProductAssignedGuarantees_BrandId
                FOREIGN KEY REFERENCES GSBrands(id),
        isDeleted                   bit                         NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-assignedproductassignedguarantees-v1', GETDATE(), GETDATE()
END

GO

-- gs-solutions
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-solutions-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSSolutions (
		id                          int identity(1,1)           PRIMARY KEY,
        title                       nvarchar(256)               NULL,
        fee                         bigint                      NOT NULL,
        unitPriceId                 int                         NOT NULL
            CONSTRAINT FK_GSSolutions_UnitPriceId
                FOREIGN KEY REFERENCES GSUnitPrices(id),
        provinceId                  int                         NULL
            CONSTRAINT FK_GSSolutions_ProvinceId
                FOREIGN KEY REFERENCES GSProvinces(id),
        parentId                    int                         NULL
            CONSTRAINT FK_GSSolutions_ParentId
                FOREIGN KEY REFERENCES GSSolutions(id),
        isDeleted                   bit                         NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-solutions-v1', GETDATE(), GETDATE()
END

GO

-- gs-parts
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-parts-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSParts (
		id                          int identity(1,1)           PRIMARY KEY,
        title                       nvarchar(512)               NOT NULL,
        minFee                      bigint                      NOT NULL,
        unitPriceId                 int                         NOT NULL
            CONSTRAINT FK_GSParts_UnitPriceId
                FOREIGN KEY REFERENCES GSUnitPrices(id),
        dollarBaseFee               decimal(10,2)               NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-parts-v1', GETDATE(), GETDATE()
END

GO


-- gs-technicalperson
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-technicalpersons-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSTechnicalPersons (
		id                          bigint identity(1,1)           	PRIMARY KEY,
        userId						bigint							NOT NULL
			CONSTRAINT FK_GSTechnicalPersons_UserId
				FOREIGN KEY REFERENCES Users(id),
		organizationId				int								NOT NULL
			CONSTRAINT FK_GSTechnicalPersons_OrganizationId
				FOREIGN KEY REFERENCES GSGuaranteeOrganizations(id),
		[createdAt]					datetimeoffset					NOT NULL,
		[updatedAt]					datetimeoffset					NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-technicalpersons-v1', GETDATE(), GETDATE()
END

GO

-- gs-supplierpersons
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-supplierpersons-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSSupplierPersons (
		id                          bigint identity(1,1)           	PRIMARY KEY,
        userId						bigint							NOT NULL
			CONSTRAINT FK_GSSupplierPersons_UserId
				FOREIGN KEY REFERENCES Users(id),
		organizationId				int								NOT NULL
			CONSTRAINT FK_GSSupplierPersons_OrganizationId
				FOREIGN KEY REFERENCES GSGuaranteeOrganizations(id),
		[createdAt]					datetimeoffset					NOT NULL,
		[updatedAt]					datetimeoffset					NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-supplierpersons-v1', GETDATE(), GETDATE()
END

GO

-- gs-supervisorusers
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-supervisorusers-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSSuperVisorUsers (
		id                          bigint identity(1,1)           	PRIMARY KEY,
        userId						bigint							NOT NULL
			CONSTRAINT FK_GSSuperVisorUsers_UserId
				FOREIGN KEY REFERENCES Users(id),
		
		[createdAt]					datetimeoffset					NOT NULL,
		[updatedAt]					datetimeoffset					NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-supervisorusers-v1', GETDATE(), GETDATE()
END

GO

-- gs-service-types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-service-types-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN


	CREATE TABLE GSServiceTypes (
		id                          int                         PRIMARY KEY,
        title                       nvarchar(256)               NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-service-types-v1', GETDATE(), GETDATE()
END

GO

-- gs-warranty-service-types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-warranty-service-types-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSWarrantyServiceTypes (
		id                          int                         PRIMARY KEY,
        title                       nvarchar(256)               NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-warranty-service-types-v1', GETDATE(), GETDATE()
END

GO



-- gs-factor-services
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factor-service-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSFactorServices (
		id                          bigint identity (1,1)       PRIMARY KEY,
        factorId                    bigint                      NOT NULL
            CONSTRAINT FK_GSFactorServices_FactorId
                FOREIGN KEY REFERENCES GSFactors(id),
        solutionId                  int                         NULL
            CONSTRAINT FK_GSFactorServices_SolutionId
                FOREIGN KEY REFERENCES GSSolutions(id),
        partName                    nvarchar(256)               NULL,
        qty                         int                         NOT NULL,
        unitPriceId                 int                         NOT NULL
            CONSTRAINT FK_GSFactorServices_UnitPriceId
                FOREIGN KEY REFERENCES GSUnitPrices(id),
        price                   bigint                      NOT NULL,
        warrantyServiceTypeId       int                         NOT NULL
            CONSTRAINT FK_GSFactorServices_WarrantyServiceTypeId
                FOREIGN KEY REFERENCES GSWarrantyServiceTypes(id),
        serviceTypeId               int                         NOT NULL
            CONSTRAINT FK_GSFactorServices_ServiceTypeId
                FOREIGN KEY REFERENCES GSServiceTypes(id),
        createdByUserId            bigint                      NOT NULL
            CONSTRAINT FK_GSFactorServices_CreatedBy
                FOREIGN KEY REFERENCES Users(id),
        isDeleted                   bit                         NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factor-service-v1', GETDATE(), GETDATE()
END

GO

-- gs-factor-services-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factor-service-v2'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	ALTER TABLE GSFactorServices
	ADD representativeShareOfSolution bigint null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factor-service-v2', GETDATE(), GETDATE()
END

GO


-- gs-factor-vip-bundles
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factor-vip-bundle-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSFactorVipBundles (
		id                          bigint identity (1,1)       PRIMARY KEY,
        factorId                    bigint                      NOT NULL
            CONSTRAINT FK_GSFactorVipBundles_FactorId
                FOREIGN KEY REFERENCES GSFactors(id),
        vipBundleTypeId             int                         NOT NULL
            CONSTRAINT FK_GSFactorVipBundles_VipBundleTypeId
                FOREIGN KEY REFERENCES GSVipBundleTypes(id),
        itemPrice                   bigint                      NOT NULL,
        unitPriceId                 int                         NOT NULL
            CONSTRAINT FK_GSFactorVipBundles_UnitPriceId
                FOREIGN KEY REFERENCES GSUnitPrices(id),
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factor-vip-bundle-v1', GETDATE(), GETDATE()
END

GO

-- gs-factor-vip-bundles-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-factor-vip-bundle-v2'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	ALTER TABLE GSFactorVipBundles
	    ADD fee bigint not null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-factor-vip-bundle-v2', GETDATE(), GETDATE()
END

GO

-- gs-questions-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-questions-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	

	CREATE TABLE GSQuestions (
		id                          bigint identity (1,1)       PRIMARY KEY,
        title						nvarchar(512)				NOT NULL,
		isDeleted					bit							NULL,
		priority					int							NULL,
		maxWeight					decimal(5,2)				NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-questions-v1', GETDATE(), GETDATE()
END

GO

-- gs-answer-options-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-answer-options-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	

	CREATE TABLE GSAnswerOptions (
		id                          bigint identity (1,1)       PRIMARY KEY,
		questionId					bigint						NOT NULL
			CONSTRAINT FK_GSAnswerOptions_QuestionId
				FOREIGN KEY REFERENCES GSQuestions(id),
		title						nvarchar(256)				NOT NULL,
		weight						decimal(5,2) 				NOT NULL DEFAULT 0.00,
		priority					int 						NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-answer-options-v1', GETDATE(), GETDATE()
END

GO


-- gs-responses-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-responses-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	

	CREATE TABLE GSResponses (
		id                          bigint identity (1,1)       PRIMARY KEY,
		requestId					bigint						NOT NULL
			CONSTRAINT FK_GSResponses_RequestId
				FOREIGN KEY REFERENCES GSRequests(id),
		userId						bigint						NOT NULL
			CONSTRAINT FK_GSResponses_UserId
				FOREIGN KEY REFERENCES Users(id),
		fromScore					DECIMAL(10,2)				NOT NULL,
		totalScore					DECIMAL (10,2)				DEFAULT 0.00,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-responses-v1', GETDATE(), GETDATE()
END

GO



-- gs-answer-records-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-answer-records-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	

	CREATE TABLE GSAnswerRecords (
		id                          bigint identity (1,1)       PRIMARY KEY,
		responseId					bigint						NOT NULL
			CONSTRAINT FK_GSAnswerRecords_ResponseId
				FOREIGN KEY REFERENCES GSResponses(id),
		questionId					bigint						NOT NULL
			CONSTRAINT FK_GSAnswerRecords_QuestionId
				FOREIGN KEY REFERENCES GSQuestions(id),
		answerOptionId				bigint						NOT NULL
			CONSTRAINT FK_GSAnswerRecords_AnswerOptionId
				FOREIGN KEY REFERENCES GSAnswerOptions(id),
		weight						DECIMAL(5,2)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-answer-records-v1', GETDATE(), GETDATE()
END

GO




-- gs-request-attachment-types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-request-attachment-types-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSRequestAttachmentTypes(
		id 							int  						PRIMARY KEY,
		title						nvarchar(256)				NOT NULL,	
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-request-attachment-types-v1', GETDATE(), GETDATE()
END

GO



-- gs-request-attachments
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-requests-attachments-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	
	
	CREATE TABLE GSRequestAttachments(
		id 							bigint identity(1,1)		PRIMARY KEY,
		requestId					bigint						NOT NULL
			CONSTRAINT FK_GSRequestAttachments_RequestId
				FOREIGN KEY REFERENCES GSRequests(id),
		attachmentId				bigint						NOT NULL
			CONSTRAINT FK_GSRequestAttachments_AttachmentId
				FOREIGN KEY REFERENCES Attachments(id),
		requestAttachmentTypeId		int							NOT NULL
			CONSTRAINT FK_GSRequestAttachments_RequestAttachmentTypeId
				FOREIGN KEY REFERENCES GSRequestAttachmentTypes(id),
		userId						bigint						NOT NULL
			CONSTRAINT FK_GSRequestAttachments_UserId
				FOREIGN KEY REFERENCES Users(id),
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-requests-attachments-v1', GETDATE(), GETDATE()
END

GO

-- gs-preregistration-organization-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-preregistration-organization-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	
	CREATE TABLE GSPreRegistrationOrganizations(
		id 							bigint identity(1,1)		PRIMARY KEY,
		title						nvarchar(256)				NOT NULL,
		addressId					bigint						NOT NULL
			CONSTRAINT FK_GSPreRegistrationOrganizations_AddressId
				FOREIGN KEY REFERENCES GSAddresses(id),
		licenseDate					datetime					NOT NULL,
		licenseAttachmentId			bigint						NOT NULL
			CONSTRAINT FK_GSPreRegistrationOrganizations_LicenseAttachmentId
				FOREIGN KEY REFERENCES Attachments(id),
		nationalAttachmentId		bigint						NOT NULL
			CONSTRAINT FK_GSPreRegistrationOrganizations_NationalAttachmentId
				FOREIGN KEY REFERENCES Attachments(id),
		estateAttachmentId			bigint						NOT NULL
			CONSTRAINT FK_GSPreRegistrationOrganizations_EstateAttachmentId
				FOREIGN KEY REFERENCES Attachments(id),
		postalAttachmentId			bigint						NOT NULL
			CONSTRAINT FK_GSPreRegistrationOrganizations_PostalAttachmentId
				FOREIGN KEY REFERENCES Attachments(id),
		postalCode					nvarchar(25)				NOT NULL,

		firstname					nvarchar(256)				NOT NULL,
		lastname					nvarchar(256)				NOT NULL,
		phoneNumber					nvarchar(256)				NOT NULL,

		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-preregistration-organization-v1', GETDATE(), GETDATE()
END

GO




-- gs-preregistration-organization-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-preregistration-organization-v2'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	
	ALTER TABLE GSPreRegistrationOrganizations
		ADD isConfirm bit null,
			confirmDate datetime null 

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-preregistration-organization-v2', GETDATE(), GETDATE()
END

GO

-- gs-preregistration-organization-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-preregistration-organization-v3'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	
	ALTER TABLE GSPreRegistrationOrganizations
	 ADD licenseCode nvarchar(256)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-preregistration-organization-v3', GETDATE(), GETDATE()
END

GO


-- gs-porints-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-points-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	
	CREATE TABLE GSPoints(
		id 							bigint 						PRIMARY KEY,
		title						nvarchar(256)				NOT NULL,
		[point]						decimal(5,2)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-points-v1', GETDATE(), GETDATE()
END

GO


-- gs-userpoints-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-userpoints-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	
	CREATE TABLE GSUserPoints(
		id 							bigint identity(1,1)		PRIMARY KEY,
		pointId						bigint						NOT NULL
			CONSTRAINT FK_UserPoints_PointId
				FOREIGN KEY REFERENCES GSPoints(id),
		userId						bigint						NOT NULL
			CONSTRAINT FK_UserPoints_UserId
				FOREIGN KEY REFERENCES Users(id),
		[pointScore]						decimal(10,2)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-userpoints-v1', GETDATE(), GETDATE()
END

GO


-- gs-subcscriptions-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-subcscriptions-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSSubscriptions(
		id 							bigint identity(1,1)		PRIMARY KEY,
		phoneNumber					nvarchar(25)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-subcscriptions-v1', GETDATE(), GETDATE()
END

GO



-- gs-faqs-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-faqs-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSFaqs(
		id 							int identity(1,1)			PRIMARY KEY,
		question					nvarchar(max)				NOT NULL,
		answer						nvarchar(max)				NOT NULL,
		priority					int							NULL,
		isDeleted					bit							NULL,		
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-faqs-v1', GETDATE(), GETDATE()
END

GO


-- gs-request-item-types-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-request-item-types-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSRequestItemTypes(
		id 							int							PRIMARY KEY,
		title						nvarchar(50)				NOT NULL,	
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-request-item-types-v1', GETDATE(), GETDATE()
END

GO


-- gs-request-items-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-request-items-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN

	CREATE TABLE GSRequestItems(
		id 							bigint identity(1,1)		PRIMARY KEY,
		requestId					bigint						NOT NULL
			CONSTRAINT FK_GSRequestItems_RequestId
				FOREIGN KEY REFERENCES GSRequests(id),
		userId						bigint						NOT NULL
			CONSTRAINT FK_GSRequestItems_UserId
				FOREIGN KEY REFERENCES Users(id),
		requestItemTypeId			int							NOT NULL
			CONSTRAINT FK_GSRequestItems_RequestItemTypeId
				FOREIGN KEY REFERENCES GSRequestItemTypes(id),
		title						nvarchar(256)				NOT NULL,
		barcode						nvarchar(256)				NULL,
		isDeleted					bit							NULL,	
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-request-items-v1', GETDATE(), GETDATE()
END

GO



IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-irangs-import-statuses-v1')
BEGIN
    CREATE TABLE GSIrangsImportStatuses (
        id INT PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        createdAt DATETIMEOFFSET NOT NULL,
        updatedAt DATETIMEOFFSET NOT NULL
    );

    INSERT INTO Migrations(version, createdAt, updatedAt)
    SELECT 'gs-irangs-import-statuses-v1', GETDATE(), GETDATE();
END;
GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-irangs-import-data-v1')
BEGIN
    CREATE TABLE GSIrangsImportData (
        id BIGINT PRIMARY KEY IDENTITY(1,1),
        fileName NVARCHAR(255),
        statusId INT,
        totalRows INT DEFAULT 0,
        processedRows INT DEFAULT 0,
        error NVARCHAR(MAX),
        userId BIGINT,
        createdAt DATETIMEOFFSET NOT NULL,
        updatedAt DATETIMEOFFSET NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users(id),
        FOREIGN KEY (statusId) REFERENCES GSIrangsImportStatuses(id)
    );

    INSERT INTO Migrations(version, createdAt, updatedAt)
    SELECT 'gs-irangs-import-data-v1', GETDATE(), GETDATE();
END;
GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'gs-irangs-import-data-guarantees-v1')
BEGIN
    CREATE TABLE GSIrangsImportDataGuarantees (
        irangsImportDataId BIGINT,
        guaranteeId BIGINT,
        PRIMARY KEY (irangsImportDataId, guaranteeId),
        FOREIGN KEY (irangsImportDataId) REFERENCES GSIrangsImportData(id),
        FOREIGN KEY (guaranteeId) REFERENCES GSGuarantees(id)
    );

    INSERT INTO Migrations(version, createdAt, updatedAt)
    SELECT 'gs-irangs-import-data-guarantees-v1', GETDATE(), GETDATE();
END;
GO


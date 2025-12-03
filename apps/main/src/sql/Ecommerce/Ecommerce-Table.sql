IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-provinces-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECProvinces (
		id							int							PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		[slug]						nvarchar(256)				NOT NULL,
		isDeleted					bit							NULL,
		[order]						int							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-provinces-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-cities-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECCities (
		id							int							PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		[slug]						nvarchar(256)				NULL,
		
		[neighborhoodBase]			bit							NULL,
		[provinceId]				int							NOT NULL
			CONSTRAINT FK_ECCities_ProvinceId
				FOREIGN KEY REFERENCES ECProvinces(id),
		[order]						int							NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-cities-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-neighborhoods-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECNeighborhoods (
		id							int							PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		[slug]						nvarchar(256)				NULL,
		[order]						int							NULL,
		[cityId]				int								NOT NULL
			CONSTRAINT FK_ECNeighborhoods_CityId
				FOREIGN KEY REFERENCES ECCities(id),
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-neighborhoods-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-brands-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECBrands (
		id							int	identity(1,1)			PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		[slug]						nvarchar(256)				NOT NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-brands-v1', GETDATE(), GETDATE()
END

GO



IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-brands-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECBrands
		ADD attachmentId bigint null
			CONSTRAINT FK_ECBrands_AttachmentId
				FOREIGN KEY REFERENCES Attachments(id)


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-brands-v2', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-brands-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECBrands 
		ADD metaTitle nvarchar(512) null,
			metaKeywords nvarchar(512) null,
			metaDescription nvarchar(512) null;


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-brands-v3', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-brands-v4' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECBrands 
		ADD [description]	nvarchar(max) NULL


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-brands-v4', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-brands-v5' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	
	ALTER TABLE ECBrands 
		ADD [priority]	int NULL


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-brands-v5', GETDATE(), GETDATE()
END

GO



IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-publish-statuses-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECPublishStatuses (
		id							int							PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO ECPublishStatuses(id, name, createdAt, updatedAt)
	VALUES (1, N'منتشر شده', GETDATE(), GETDATE())
		,(2, N'پیش نویس', GETDATE(), GETDATE())


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-publish-statuses-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-inventory-status-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECInventoryStatuses (
		id							int							PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO ECInventoryStatuses(id, name, createdAt, updatedAt)
	VALUES (1, N'موجود', GETDATE(), GETDATE())
		,(2, N'ناموجود', GETDATE(), GETDATE())


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-inventory-status-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-schedule-sending-types-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECScheduleSendingTypes (
		id							int							PRIMARY KEY,
		[title]						nvarchar(256)				NOT NULL,
		icon						nvarchar(256)				NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-schedule-sending-types-v1', GETDATE(), GETDATE()
END

GO

	

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-schedule-sending-types-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	ALTER TABLE ECScheduleSendingTypes
		ADD offsetDay int null;


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-schedule-sending-types-v2', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-schedule-sending-types-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	INSERT INTO ECScheduleSendingTypes(id, title, icon, offsetDay,createdAt, updatedAt)
	VALUES (1, N'ارسال معمولی', 'normalSending.png', 2, GETDATE(), GETDATE())
		,(2, N'ارسال اکسپرس', 'expressSending.png', 0, GETDATE(), GETDATE())


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-schedule-sending-types-v3', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-schedule-sending-types-v4' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECScheduleSendingTypes 
		ADD parentId int null
			CONSTRAINT FK_ECScheduleSendingTypes_ParentId
				FOREIGN KEY REFERENCES ECScheduleSendingTypes(id);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-schedule-sending-types-v4', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-inventory-status-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECInventoryStatuses(id, name, createdAt, updatedAt)
	VALUES (3, N'معلق', GETDATE(), GETDATE())

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-inventory-status-v2', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-guarantees-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECGuarantees (
		id							int	identity(1,1)			PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		[slug]						nvarchar(256)				NOT NULL,
		[description]				ntext						NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-guarantees-v1', GETDATE(), GETDATE()
END


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-guaranteemonths-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECGuaranteeMonths (
		id							int							PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		monthCount					int							NOT NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-guaranteemonths-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-guarantees-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECGuarantees
		ADD attachmentId bigint null
			CONSTRAINT FK_ECGuarantees_AttachmentId
				FOREIGN KEY REFERENCES Attachments(id)


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-guarantees-v2', GETDATE(), GETDATE()
END
GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-guarantees-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECGuarantees
		ADD metaTitle nvarchar(512) null,
			metaKeywords nvarchar(512) null,
			metaDescription nvarchar(512) null


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-guarantees-v3', GETDATE(), GETDATE()
END
GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-guaranteemonths-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECGuaranteeMonths (
		id							int							PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		monthCount					int							NOT NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-guaranteemonths-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-colors-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECColors (
		id							int	identity(1,1)			PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		hexCode						nvarchar(256)				NOT NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-colors-v1', GETDATE(), GETDATE()
END

GO



IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-vendors-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECVendors (
		id							int	identity(1,1)			PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		[slug]						nvarchar(256)				NOT NULL,
		[address]					nvarchar(512)				NULL,
		[description]				ntext						NULL,
		[isDefault]					bit							NULL,
		[priorityOrder]				int							NULL,
		[attachmentId]				bigint						NULL
			CONSTRAINT FK_ECVendors_AttachmentId
				FOREIGN KEY REFERENCES Attachments(id),
		userId						bigint						NOT NULL
			CONSTRAINT FK_ECVendors_UserId
				FOREIGN KEY REFERENCES Users(id),
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-vendors-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-vendors-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECVendors 
		ADD metaTitle nvarchar(512) null,
			metaKeywords nvarchar(512) null,
			metaDescription nvarchar(512) null


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-vendors-v2', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-vendors-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECVendors 
		ADD coordinates GEOGRAPHY NULL,
			provinceId int null
				CONSTRAINT FK_ECVendors_ProvinceId
					FOREIGN KEY REFERENCES ECProvinces(id),
			cityId int null
				CONSTRAINT FK_ECVendors_CityId
					FOREIGN KEY REFERENCES ECCities(id)


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-vendors-v3', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-vendors-v4' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECVendors 
		ADD latitude nvarchar(256),
			longitude nvarchar(256)


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-vendors-v4', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-vendors-v7' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE SPATIAL INDEX IX_GeoLocation_ECVendors_Coordinates
	ON ECVendors(coordinates)
	USING GEOGRAPHY_GRID
	WITH (
		GRIDS = (LEVEL_1 = MEDIUM, LEVEL_2 = MEDIUM, LEVEL_3 = MEDIUM, LEVEL_4 = MEDIUM),
		CELLS_PER_OBJECT = 16,
		PAD_INDEX = OFF,
		STATISTICS_NORECOMPUTE = OFF,
		SORT_IN_TEMPDB = OFF,
		DROP_EXISTING = OFF,
		ONLINE = OFF,
		ALLOW_ROW_LOCKS = ON,
		ALLOW_PAGE_LOCKS = ON
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-vendors-v7', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-vendorusers-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECVendorUsers (
		[vendorId]					int							NOT NULL
			CONSTRAINT FK_ECVendorUsers_VendorId
				FOREIGN KEY REFERENCES ECVendors(id),
		[userId]					bigint						NOT NULL
			CONSTRAINT FK_ECVendorUsers_UserId
				FOREIGN KEY REFERENCES Users(id),
		[isDefault]					bit							NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
		PRIMARY KEY CLUSTERED ([vendorId], [userId])
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-vendorusers-v1', GETDATE(), GETDATE()
END

GO




IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-addresses-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECAddresses (
		id							bigint	identity(1,1)		PRIMARY KEY,
		name						nvarchar(512)				NULL,
		[latitude]					decimal						NULL,
		[longitude]					decimal						NULL,
		[provinceId]				int							NOT NULL
			CONSTRAINT FK_ECAddresses_ProvinceId
				FOREIGN KEY REFERENCES ECProvinces(id),
		[cityId]					int							NOT NULL
			CONSTRAINT FK_ECAddresses_CityId
				FOREIGN KEY REFERENCES ECCities(id),
		[neighborhoodId]			int							NULL
			CONSTRAINT FK_ECAddresses_NeighborhoodId
				FOREIGN KEY REFERENCES ECNeighborhoods(id),
		street						nvarchar(1024)				NULL,
		alley						nvarchar(1024)				NULL,
		plaque						nvarchar(256)				NULL,
		floorNumber					nvarchar(25)				NULL,
		userId						bigint						NULL
			CONSTRAINT FK_ECAddresses_UserId
				FOREIGN KEY REFERENCES Users(id),
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-addresses-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-addresses-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECAddresses
		ADD postalCode nvarchar(128) null


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-addresses-v2', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-addresses-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECAddresses
		ALTER COLUMN latitude nvarchar(128) null

	ALTER TABLE ECAddresses
		ALTER COLUMN longitude nvarchar(128) null



	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-addresses-v3', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-vendoraddresses-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECVendorAddresses (
		id							bigint	identity(1,1)		PRIMARY KEY,
		vendorId					int							NOT NULL
			CONSTRAINT FK_ECVendorAddresses_VendorId
				FOREIGN KEY REFERENCES ECVendors(id),
		addressId					bigint						NOT NULL
			CONSTRAINT Fk_ECVendorAddresses_AddressId
				FOREIGN KEY REFERENCES ECAddresses(id),
		userId						bigint						NOT NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-vendoraddresses-v1', GETDATE(), GETDATE()
END

GO


-- ecommerce products-price-formulas
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-product-price-formulas-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECProductPriceFormulas (
		id							int							PRIMARY KEY,
		title						nvarchar(512)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-product-price-formulas-v1', GETDATE(), GETDATE()
END

GO

-- ecommerce products
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-products-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECProducts (
		id							bigint						PRIMARY KEY,
		title						nvarchar(512)				NOT NULL,
		slug						nvarchar(512)				NOT NULL,
		sku							nvarchar(512)				NULL,
		entityTypeId				int							NULL
			CONSTRAINT FK_ECProducts_EntityTypeId
				FOREIGN KEY REFERENCES EAVEntityTypes(id),
		publishStatusId				int							NULL
			CONSTRAINT FK_ECProducts_PublishStatusId
				FOREIGN KEY REFERENCES ECPublishStatuses(id),
		inventoryStatusId			int							NULL
			CONSTRAINT FK_ECProducts_InventoryStatusId
				FOREIGN KEY REFERENCES ECInventoryStatuses(id),
		brandId						int							NULL
			CONSTRAINT FK_ECProducts_BrandId
				FOREIGN KEY REFERENCES ECBrands(id),
		colorBased					bit							NULL,
		description					nvarchar(max)				NULL,
		viewCount					bigint						NULL,
		userId						bigint						NULL
			CONSTRAINT FK_ECProducts_UserId
				FOREIGN KEY REFERENCES Users(id),
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);



	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-products-v1', GETDATE(), GETDATE()
END

GO

-- ecommerce products
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-products-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECProducts
		ADD lastPrice bigint NULL;

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-products-v2', GETDATE(), GETDATE()
END

GO



-- ecommerce products
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-products-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECProducts
		ADD metaTitle nvarchar(512) null,
			metaKeywords nvarchar(512) null,
			metaDescription nvarchar(512) null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-products-v3', GETDATE(), GETDATE()
END

GO


-- ecommerce products
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-products-v4' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECProducts
		ADD [weight]				float(53)						NULL

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-products-v4', GETDATE(), GETDATE()
END

GO


-- ecommerce products
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-products-v5' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECProducts
		ADD score	float(53)  NULL,
			cntComment		int null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-products-v5', GETDATE(), GETDATE()
END

GO


-- ecommerce products
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-products-v6' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECProducts
		ADD productFormulaId int null
				CONSTRAINT FK_ECProducts_ProductFormulaId
					FOREIGN KEY REFERENCES ECProductPriceFormulas(id),
			wages int null,
			stoneMoney bigint null
			

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-products-v6', GETDATE(), GETDATE()
END

GO



-- ecommerce variationprices
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-variationprices-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECVariationPrices (
		id						int							PRIMARY KEY,
		name					nvarchar(256)				NOT NULL,
		[required]				bit							NULL,
		[createdAt]				datetimeoffset				NOT NULL,
		[updatedAt]				datetimeoffset				NOT NULL,
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-variationprices-v1', GETDATE(), GETDATE()
END

GO


-- ecommerce inventories
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-inventories-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECInventories (
		id						bigint identity(1,1)			PRIMARY KEY,
		productId				bigint							NOT NULL
			CONSTRAINT FK_ECInventories_ProductId
				FOREIGN KEY REFERENCES ECProducts(id),
		vendorId				int								NOT NULL
			CONSTRAINT FK_ECInventories_VendorId
				FOREIGN KEY REFERENCES ECVendors(id),
		colorId					int								NULL
			CONSTRAINT FK_ECInventories_ColorId
				FOREIGN KEY REFERENCES ECColors(id),
		guaranteeId				int								NULL
			CONSTRAINT FK_ECInventories_GuaranteeId
				FOREIGN KEY REFERENCES ECGuarantees(id),
		guaranteeMonthId		int								NULL
			CONSTRAINT FK_ECInventories_GuaranteeMonthId
				FOREIGN KEY REFERENCES ECguaranteeMonths(id),
		buyPrice				bigint							NULL,
		qty						int								NOT NULL,
		onlyProvinceId			int								NULL
			CONSTRAINT FK_ECInventories_OnlyProvinceId
				FOREIGN KEY REFERENCES ECProvinces(id),
		vendorAddressId				bigint							NOT NULL
			CONSTRAINT FK_ECInventories_VendorAddressId
				FOREIGN KEY REFERENCES ECVendorAddresses(id),
		[weight]				float(53)						NULL,
		inventoryStatusId		int								NOT NULL
			CONSTRAINT FK_ECInventories_InventoryStatusId
				FOREIGN KEY REFERENCES ECInventoryStatuses(id),
		[description]			nvarchar(512)					NULL,
		userId					bigint							NOT NULL
			CONSTRAINT FK_ECInventories_UserId
				FOREIGN KEY REFERENCES Users(id),
		[isDeleted]				bit								NULL,
		deletedBy				bigint							NULL
			CONSTRAINT FK_ECInventories_DeletedBy
				FOREIGN KEY REFERENCES Users(id),
		[createdAt]				datetimeoffset					NOT NULL,
		[updatedAt]				datetimeoffset					NOT NULL,
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-inventories-v1', GETDATE(), GETDATE()
END

GO



-- ecommerce inventories
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-inventories-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECInventories
		ADD discountTypeId int null,
			discountStartDate datetime null,
			discountEndDate datetime null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-inventories-v2', GETDATE(), GETDATE()
END

GO

-- ecommerce inventories
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-inventories-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECInventories
		ADD inventoryDescriptor nvarchar(256) null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-inventories-v3', GETDATE(), GETDATE()
END

GO


-- ecommerce inventories-v4
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-inventories-v4' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECInventories
		ADD scheduleSendingTypeId int null default 1
			CONSTRAINT FK_ECInventories_ScheduleSendingTypeId
				FOREIGN KEY REFERENCES ECScheduleSendingTypes(id)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-inventories-v4', GETDATE(), GETDATE()
END

GO


-- ecommerce inventories-v5
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-inventories-v5' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECInventories
		ADD offsetDay int null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-inventories-v5', GETDATE(), GETDATE()
END

GO


-- ecommerce inventory-prices
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-inventory-prices-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

    CREATE TABLE ECInventoryPrices (
        id                      bigint identity(1,1)            PRIMARY KEY,
        inventoryId             bigint                          NOT NULL
            CONSTRAINT FK_InventoryPrices_InventoryId
                FOREIGN KEY REFERENCES ECInventories(id),
        variationPriceId        int                             NOT NULL
            CONSTRAINT FK_InventoryPrices_VariationPriceId
                FOREIGN KEY REFERENCES ECVariationPrices(id),
		buyPrice				bigint							NULL,
        price                   bigint                          NOT NULL,
        isDeleted               bit                             NULL,
        userId                  bigint                          NOT NULL
            CONSTRAINT FK_InventoryPrices_UserId
                FOREIGN KEY REFERENCES Users(id),
        deletedBy               bigint                          NULL
            CONSTRAINT FK_InventoryPrices_DeletedBy
                FOREIGN KEY REFERENCES Users(id),
        [createdAt]				datetimeoffset					NOT NULL,
        [updatedAt]				datetimeoffset					NOT NULL,
	)

    INSERT INTO Migrations(version, createdAt, updatedAt)
    SELECT 'ecommerce-inventory-prices-v1', GETDATE(), GETDATE()
END

GO


-- eav user session
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-user-session-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECUserSessions(
		id							nvarchar(256)				PRIMARY KEY,
		userId						bigint						NULL
			CONSTRAINT FK_ECUserSessions_UserId
				FOREIGN KEY REFERENCES Users(id),
		isDeleted					bit							NULL,
		expireAt					datetime					NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	CREATE NONCLUSTERED INDEX NIX_ECUserSessions_UserId ON ECUserSessions(userId, isDeleted)
	INCLUDE (id, expireAt)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-user-session-v1', GETDATE(), GETDATE()
END

GO


-- ec-requests-log-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-requests-log-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECRequestLogs(
		id							bigint identity(1,1)		PRIMARY KEY,
		userId						bigint						NULL,
		sessionId					varchar(256)				NULL,
		url							nvarchar(512)				NULL,
		ip							nvarchar(128)				NULL,
		method						varchar(20)					NULL,
		beginTime					datetime					NULL,
		endTime						datetime					NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-requests-log-v1', GETDATE(), GETDATE()
END

GO



-- ec-discount-types-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discount-types-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECDiscountTypes(
		id							int							PRIMARY KEY,
		name						nvarchar(256)				NOT NULL,
		isDeleted					bit							NULL,
		isCouponBased				bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discount-types-v1', GETDATE(), GETDATE()
END

GO

-- ec-discount-types-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discount-types-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECDiscountTypes
		ADD isFactorBased bit	NULL
	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discount-types-v2', GETDATE(), GETDATE()
END

GO


-- ec-discount-action-rules-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discount-condition-action-rules-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECDiscountActionRules(
		id							int							PRIMARY KEY,
		name						nvarchar(256)				NOT NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discount-condition-action-rules-v1', GETDATE(), GETDATE()
END

GO



-- ec-discount-action-types-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discount-action-types-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECDiscountActionTypes(
		id							int							PRIMARY KEY,
		name						nvarchar(256)				NOT NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discount-action-types-v1', GETDATE(), GETDATE()
END

GO

-- ec-discounts-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discounts-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECDiscounts(
		id							bigint identity(1,1)		PRIMARY KEY,
		[name]						nvarchar(512)				NOT NULL,
		[description]				ntext						NULL,
		discountTypeId				int							NOT NULL
			CONSTRAINT FK_ECDiscounts_DiscountTypeId
				FOREIGN KEY REFERENCES ECDiscountTypes(id),

		discountActionTypeId		int							NOT NULL
			CONSTRAINT FK_ECDiscounts_DiscountActionTypeId
				FOREIGN KEY REFERENCES ECDiscountActionTypes(id),
		discountValue				decimal						NOT NULL,
		maxValue					decimal						NULL,

		discountActionRuleId		int							NOT NULL
			CONSTRAINT FK_ECDiscounts_DiscountActionRuleI
				FOREIGN KEY REFERENCES ECDiscountActionRules(id),
		
		userId						bigint						NOT NULL
			CONSTRAINT FK_ECDiscounts_UserId
				FOREIGN KEY REFERENCES Users(id),
		couponCode					nvarchar(256)				NULL,
		priority					int							NULL,
		[limit]						int 						NULL,
		[used]						int							NULL,
		isActive					bit							NULL,
		isDeleted					bit							NULL,
		startDate					datetime					NULL,
		endDate						datetime					NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discounts-v1', GETDATE(), GETDATE()
END

GO



-- ec-discounts-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discounts-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECDiscounts
		ADD freeShipment bit null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discounts-v2', GETDATE(), GETDATE()
END

GO


-- ec-discounts-v3
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discounts-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECDiscounts
		ALTER COLUMN discountActionTypeId int null

	ALTER TABLE ECDiscounts
		ALTER COLUMN discountValue decimal null

	ALTER TABLE ECDiscounts
		ALTER COLUMN discountActionRuleId int null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discounts-v3', GETDATE(), GETDATE()
END

GO


-- ec-discounts-v4
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discounts-v4' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECDiscounts
		ADD minPrice bigint null,
			maxPrice bigint null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discounts-v4', GETDATE(), GETDATE()
END

GO



-- ec-discount-condition-types-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discount-condition-types-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECDiscountConditionTypes(
		id							int							PRIMARY KEY,
		[name]						nvarchar(512)				NOT NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discount-condition-types-v1', GETDATE(), GETDATE()
END

GO


-- ec-discount-conditions-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discount-conditions-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECDiscountConditions(
		id							bigint identity(1,1)		PRIMARY KEY,
		discountId					bigint						NOT NULL
			CONSTRAINT FK_ECDiscountConditions_DiscountId
				FOREIGN KEY REFERENCES ECDiscounts(id),
		conditionTypeId				int							NOT NULL
			CONSTRAINT FK_ECDiscountConditions_ConditionTypeId
				FOREIGN KEY REFERENCES ECDiscountConditionTypes(id),
		conditionValue				bigint						NOT NULL,
		isDefault					bit							NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discount-conditions-v1', GETDATE(), GETDATE()
END

GO




-- vendorcommissiontypess
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-vendorcommissiontypes-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECVendorCommissionTypes (
		id							int							PRIMARY KEY,
		name						nvarchar(256)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-vendorcommissiontypes-v1', GETDATE(), GETDATE()
END

GO


-- vendorcommissions
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-vendorcommissions-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECVendorCommissions (
		id							bigint	identity(1,1)		PRIMARY KEY,
		vendorId					int							NOT NULL
			CONSTRAINT FK_ECVendorCommissions_VendorId
				FOREIGN KEY REFERENCES ECVendors(id),
		variationPriceId			int							NOT NULL
			CONSTRAINT FK_ECVendorCommissions_VariationPriceId
				FOREIGN KEY REFERENCES ECVariationPrices(id),
		commissionTypeId			int							NOT NULL
			CONSTRAINT FK_ECVendorComissions_ComissionTypeId
				FOREIGN KEY REFERENCES ECVendorCommissionTypes(id),
		[amount]					bigint						NOT NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	CREATE NONCLUSTERED INDEX NIX_ECVendorCommissions_VendorId ON ECVendorCommissions(vendorId, variationPriceId)
	INCLUDE (id, commissionTypeId, amount, isDeleted)


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-vendorcommissions-v1', GETDATE(), GETDATE()
END

GO



-- ec-shippingway-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-shippingway-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECShippingWays(
		id							int							PRIMARY KEY,
		title						nvarchar(256)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-shippingway-v1', GETDATE(), GETDATE()
END

GO

-- ec-stocks-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-stocks-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECStocks(
		id							bigint identity(1,1)		NOT NULL,
		sessionId					nvarchar(256)				NOT NULL
			CONSTRAINT FK_ECStocks_SessionId
				FOREIGN KEY REFERENCES ECUserSessions(id),
		productId					bigint						NOT NULL
			CONSTRAINT FK_ECStocks_ProductId
				FOREIGN KEY REFERENCES ECProducts(id),
		inventoryId					bigint						NOT NULL
			CONSTRAINT FK_ECStocks_InventoryId
				FOREIGN KEY REFERENCES ECInventories(id),
		qty							int							NOT NULl,
		expire						datetime					NOT NULL,
		isPurchase					bit							NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
		PRIMARY KEY NONCLUSTERED(id),
	);

	CREATE CLUSTERED INDEX IX_Stocks_SessionId
		ON ECStocks(sessionId, id)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-stocks-v1', GETDATE(), GETDATE()
END

GO


-- ec-stocks-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-stocks-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECStocks
		DROP CONSTRAINT FK_ECStocks_SessionId

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-stocks-v2', GETDATE(), GETDATE()
END


GO


-- ec-stocks-v3
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-stocks-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECStocks
		ADD vendorId int null,
			shippingWayId int null
				CONSTRAINT FK_ECStocks_ShippingWayId
					FOREIGN KEY REFERENCES ECShippingWays(id)
			

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-stocks-v3', GETDATE(), GETDATE()
END


GO

-- ec-paymentgateways-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-paymentgateways-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECPaymentGateways(
		id							int 					PRIMARY KEY,
		name						nvarchar(256)			NOT NULL,
		variationPriceId			int						NOT NULL,
		serviceName					nvarchar(512)			NULL,
		isDeleted					bit						NULL,
		[createdAt]					datetimeoffset			NOT NULL,
		[updatedAt]					datetimeoffset			NOT NULL,
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-paymentgateways-v1', GETDATE(), GETDATE()
END

GO

-- ec-paymentgateways-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-paymentgateways-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECPaymentGateways
	ADD username nvarchar(512) null,
		[password]	nvarchar(512) null;

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-paymentgateways-v2', GETDATE(), GETDATE()
END

GO


-- ec-paymentgateways-v3
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-paymentgateways-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECPaymentGateways
	ADD clientId nvarchar(512) null,
		secret	nvarchar(512) null;

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-paymentgateways-v3', GETDATE(), GETDATE()
END

GO

-- ec-paymentgateways-v4
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-paymentgateways-v4' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECPaymentGateways
		ADD eligibleRequest bit null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-paymentgateways-v4', GETDATE(), GETDATE()
END

GO




-- ec-paymentgateways-v5
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-paymentgateways-v5' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECPaymentGateways
		ADD eligibleChargeWallet bit null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-paymentgateways-v5', GETDATE(), GETDATE()
END

GO


-- ec-paymentgateways-v6
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-paymentgateways-v6' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECPaymentGateways
		ADD imageUrl nvarchar(256) null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-paymentgateways-v6', GETDATE(), GETDATE()
END

GO



-- paymentgatewayscommissiontypes
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-paymentgatewayscommissiontypes-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECPaymentGatewayCommissionTypes (
		id							int							PRIMARY KEY,
		name						nvarchar(256)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-paymentgatewayscommissiontypes-v1', GETDATE(), GETDATE()
END

GO


-- paymentGatewaycommissions
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-paymentgatewaycommission-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECPaymentGatewayCommissions (
		id							int	identity(1,1)			PRIMARY KEY,
		paymentGatewayId			int							NOT NULL
			CONSTRAINT FK_ECPaymentGatewayComission_PaymentGateways
				FOREIGN KEY REFERENCES ECPaymentGateways(id),
		commissionTypeId			int							NOT NULL
			CONSTRAINT FK_ECPaymentGatewayCommisssion_CommissionTypes
				FOREIGN KEY REFERENCES ECPaymentGatewayCommissionTypes(id),
		[amount]					bigint						NOT NULL,
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	CREATE NONCLUSTERED INDEX NIX_ECPaymentGatewayCommissions_PaymentGatewayId ON ECPaymentGatewayCommissions(paymentGatewayId, commissionTypeId)
	INCLUDE (id, isDeleted, amount)


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-paymentgatewaycommission-v1', GETDATE(), GETDATE()
END

GO

-- ec-postage-fee-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-postage-fee-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECPostageFees(
		id							int identity(1,1)			PRIMARY KEY,
		fromWeight					int							NOT NULL,
		toWeight					int							NOT NULL,
		allProvincePrice			bigint						NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-postage-fee-v1', GETDATE(), GETDATE()
END

GO



-- ec-order-status
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-order-status-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECOrderStatus(
		id							int							PRIMARY KEY,
		name						nvarchar(256)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-order-status-v1', GETDATE(), GETDATE()
END

GO


-- ec-order-detail-status
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-order-detail-status-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECOrderDetailStatus(
		id							int							PRIMARY KEY,
		name						nvarchar(256)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-order-detail-status-v1', GETDATE(), GETDATE()
END

GO



-- ec-order-shipment-ways
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-order-shipment-ways-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECOrderShipmentWays(
		id							int							PRIMARY KEY,
		name						nvarchar(256)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-order-shipment-ways-v1', GETDATE(), GETDATE()
END

GO


-- ec-order-shipment-ways-2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-order-shipment-ways-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrderShipmentWays
		add isPeriodic bit null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-order-shipment-ways-v2', GETDATE(), GETDATE()
END

GO

-- ec-order-shipment-ways-2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-order-shipment-ways-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrderShipmentWays
		add icon nvarchar(256) null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-order-shipment-ways-v3', GETDATE(), GETDATE()
END

GO



-- ec-orders
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-orders-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECOrders(
		id							bigint	identity(1,1)		PRIMARY KEY,
		totalProductPrice			bigint						NULL,
		totalDiscountFee			bigint						NULL,
		totalShipmentPrice			bigint						NULL,
		orderShipmentWayId			int							NULL
			CONSTRAINT FK_ECOrders_OrderShipmentWays
				FOREIGN KEY REFERENCES ECOrderShipmentWays(id),
		totalPrice					bigint						NULL,
		orderStatusId				int							NOT NULL
			CONSTRAINT FK_ECOrders_OrderStatusId
				FOREIGN KEY REFERENCES ECOrderStatus(id),
		sessionId					nvarchar(256)				NOT NULL
			CONSTRAINT FK_ECOrders_SessionId
				FOREIGN KEY REFERENCES ECUserSessions(id),
		userId						bigint						NOT NULL
			CONSTRAINT FK_ECOrders_UserId
				FOREIGN KEY REFERENCES Users(id),
		addressId					bigint						NULL
			CONSTRAINT FK_ECOrders_AddressId
				FOREIGN KEY REFERENCES ECAddresses(id),
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-orders-v1', GETDATE(), GETDATE()
END

GO


-- ec-orders
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-orders-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrders
	ADD postReceipt nvarchar(256) null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-orders-v2', GETDATE(), GETDATE()
END

GO



-- ec-orders
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-orders-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrders
	ADD transactionId nvarchar(256) null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-orders-v3', GETDATE(), GETDATE()
END

GO


-- ec-orders
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-orders-v4' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrders
	ADD paymentId bigint null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-orders-v4', GETDATE(), GETDATE()
END

GO

-- ec-orders
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-orders-v5' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrders
	ADD courierUserId bigint null
		CONSTRAINT FK_ECOrders_CourierUserId
			FOREIGN KEY REFERENCES Users(id)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-orders-v5', GETDATE(), GETDATE()
END

GO

-- ec-orders
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-orders-v6' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrders
	ADD deliveryDate datetime null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-orders-v6', GETDATE(), GETDATE()
END

GO

-- ec-orders
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-orders-v7' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrders
	ADD sendToCustomerDate datetime null,
		sendToCustomerBy bigint null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-orders-v7', GETDATE(), GETDATE()
END

GO


-- ec-orders
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-orders-v8' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrders
		ADD realShipmentPrice bigint null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-orders-v8', GETDATE(), GETDATE()
END

GO




-- ec-orders
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-orders-v9' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrders
	drop constraint FK_ECOrders_SessionId

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-orders-v9', GETDATE(), GETDATE()
END

GO



-- ec-orders
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-orders-v10' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrders
	alter column sessionId nvarchar(256) null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-orders-v10', GETDATE(), GETDATE()
END

GO




-- ec-orders
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-orders-v11' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrders
		ADD  gregorianAtPersian datetime null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-orders-v11', GETDATE(), GETDATE()
END

GO



-- ec-orders
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-orders-v12' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrders
		ADD  paymentCommissionAmount bigint

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-orders-v12', GETDATE(), GETDATE()
END

GO


-- ec-orders
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-orders-v13' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrders
		ADD  noteDescription nvarchar(1024) null;

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-orders-v13', GETDATE(), GETDATE()
END

GO

-- ec-order-details
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-order-details-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	CREATE TABLE ECOrderDetails(
		id							bigint	identity(1,1)		PRIMARY KEY,
		orderId						bigint						NOT NULL
			CONSTRAINT FK_ECOrderDetails_OrderId
				FOREIGN KEY REFERENCES ECOrders(id),
		orderDetailStatusId			int							NOT NULL
			CONSTRAINT FK_ECOrderDetails_OrderDetailStatusId
				FOREIGN KEY REFERENCES ECOrderDetailStatus(id),
		vendorId					int							NOT NULL
			CONSTRAINT FK_ECOrderDetails_VendorId
				FOREIGN KEY REFERENCES ECVendors(id),
		productId					bigint						NOT NULL
			CONSTRAINT FK_ECOrderDetails_ProductId
				FOREIGN KEY REFERENCES ECProducts(id),
		inventoryId					bigint						NOT NULL
			CONSTRAINT FK_ECOrderDetails_InventoryId
				FOREIGN KEY REFERENCES ECInventories(id),
		inventoryPriceId			bigint						NOT NULL
			CONSTRAINT FK_ECOrderDetails_InventoryPriceId
				FOREIGN KEY REFERENCES ECInventoryPrices(id),
		stockId						bigint						NULL
			CONSTRAINT FK_ECOrderDetails_Stocks
				FOREIGN KEY REFERENCES ECStocks(id),
		qty							int							NULL,
		productPrice				bigint						NULL,
		discountFee					bigint						NULL,
		discountId					bigint						NULL
			CONSTRAINT FK_ECOrderDetails_DiscountId
				FOREIGN KEY REFERENCES ECDiscounts(id),
		totalPrice					bigint						NULL,
		userId						bigint						NULL
			CONSTRAINT FK_ECOrderDetails_UserId
				FOREIGN KEY REFERENCES Users(id),
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-order-details-v1', GETDATE(), GETDATE()
END

GO


-- ec-order-details-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-order-details-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	ALTER TABLE ECOrderDetails 
	ADD isDeleted bit null;

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-order-details-v2', GETDATE(), GETDATE()
END

GO


-- ec-order-details-v3
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-order-details-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	ALTER TABLE ECOrderDetails 
	ADD discountFeePerItem bigint null;

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-order-details-v3', GETDATE(), GETDATE()
END

GO

-- ec-order-details-v4
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-order-details-v4' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	ALTER TABLE ECOrderDetails 
	ADD vendorCommissionId bigint null
		CONSTRAINT FK_ECOrderDetails_VendorCommissionId
			FOREIGN KEY REFERENCES ECVendorCommissions(id),
		commissionAmount bigint null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-order-details-v4', GETDATE(), GETDATE()
END

GO



-- ec-order-details-v5
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-order-details-v5' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrderDetails
		ADD  gregorianAtPersian datetime null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-order-details-v5', GETDATE(), GETDATE()
END

GO


-- ec-order-details-v6
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-order-details-v6' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECOrderDetails
		DROP CONSTRAINT FK_ECOrderDetails_Stocks

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-order-details-v6', GETDATE(), GETDATE()
END

GO

-- ec-payment-status
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-payment-status-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECPaymentStatus(
		id							int							PRIMARY KEY,
		name						nvarchar(256)				NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-payment-status-v1', GETDATE(), GETDATE()
END

GO

-- ec-payment-types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-payment-types-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECPaymentTypes(
		id							int							PRIMARY KEY,
		name						nvarchar(256)				NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-payment-types-v1', GETDATE(), GETDATE()
END

GO


-- ec-payments
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-payments-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	CREATE TABLE ECPayments(
		id									bigint	identity(1,1)		PRIMARY KEY,
		paymentGatewayId					int							NOT NULL
			CONSTRAINT FK_ECPayments_paymentId
				FOREIGN KEY REFERENCES ECPaymentGateways(id),
		paymentTypeId				int							NOT NULL
			CONSTRAINT FK_ECPayments_paymentTypeId
				FOREIGN KEY REFERENCES ECPaymentTypes(id),
		paymentStatusId				int							NOT NULL
			CONSTRAINT FK_ECPayments_PaymentStatusId
				FOREIGN KEY REFERENCES ECPaymentStatus(id),
		totalprice					bigint						NULL,
		transactionId				nvarchar(256)				NULL,
		paymentToken				nvarchar(256)				NULL,
		transactionReceipt			nvarchar(512)				NULL,
		orderId						bigint						NULL
			CONSTRAINT FK_ECPayments_OrderId
				FOREIGN KEY REFERENCES ECOrders(id),
		userId						bigint						NOT NULL
			CONSTRAINT FK_ECPayments_UserId
				FOREIGN KEY REFERENCES Users(id),
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-payments-v1', GETDATE(), GETDATE()
END

GO



-- ec-payments-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-payments-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	ALTER TABLE ECPayments
		ADD 
			cardPan nvarchar(512)		NULL,
			cardHash  nvarchar(512)		NULL;

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-payments-v2', GETDATE(), GETDATE()
END

GO



-- ec-payments-v3
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-payments-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	ALTER TABLE ECPayments
		ADD parentPaymentId bigint
			CONSTRAINT FK_ECPayments_ParentPaymentId
				FOREIGN KEY REFERENCES ECPayments(id)
			

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-payments-v3', GETDATE(), GETDATE()
END

GO


-- ec-courier
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-couriers-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	CREATE TABLE ECCouriers(
		id								int	identity(1,1)		PRIMARY KEY,
		userId							bigint						NOT NULL
			CONSTRAINT FK_ECCouriers_UserId
				FOREIGN KEY REFERENCES Users(id),
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-couriers-v1', GETDATE(), GETDATE()
END

GO

-- ec-courier
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-couriers-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	ALTER TABLE ECCouriers
		ADD vendorId int null
			CONSTRAINT FK_ECCouriers_VendorId
				FOREIGN KEY REFERENCES ECVendors(id)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-couriers-v2', GETDATE(), GETDATE()
END

GO


-- ec-entityTypeFactors-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-entityTypeFactors-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	CREATE TABLE ECEntityTypeFactors(
		id								int	identity(1,1)			PRIMARY KEY,
		[name]							nvarchar(256)				NOT NULL,
		entityTypeId					int							NOT NULL
			CONSTRAINT FC_EntityTypeFactors_EntityTypeId
				FOREIGN KEY REFERENCES EAVEntityTypes(id),
		[priority]						int							NULL,
		isDeleted						bit							NULL,
		[createdAt]						datetimeoffset				NOT NULL,
		[updatedAt]						datetimeoffset				NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-entityTypeFactors-v1', GETDATE(), GETDATE()
END

GO


-- ec-productcommentstatuses-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-productcommentstatuses-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECProductCommentStatuses(
		id								int								PRIMARY KEY,
		[name]							nvarchar(256)					NOT NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-productcommentstatuses-v1', GETDATE(), GETDATE()
END

GO



-- ec-productcomments-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-productcomments-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECProductComments(
		id								bigint identity(1,1)			PRIMARY KEY,

		entityId						bigint							NULL
			CONSTRAINT FK_ECProductComments_EntityId
				FOREIGN KEY REFERENCES EAVEntities(entityId),
		statusId						int								NULL
			CONSTRAINT FK_ECProductComments_StatusId
				FOREIGN KEY REFERENCES ECProductCommentStatuses(id),
		userId							bigint							NULL
			CONSTRAINT FK_ECProductComments_UserId
				FOREIGN KEY REFERENCES Users(id),
		[description]					nvarchar(1024)					NULL,
		isDeleted						bit								NULL,
		replyId							bigint							NULL
			CONSTRAINT FK_ECProductComments_ReplyId
				FOREIGN KEY REFERENCES ECProductComments(id),
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-productcomments-v1', GETDATE(), GETDATE()
END

GO


-- ec-productcomments-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-productcomments-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECProductComments 
	ADD score float(53) NULL,
		cntFactor int null


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-productcomments-v2', GETDATE(), GETDATE()
END

GO


-- ec-productcommentfactors-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-productcommentfactors-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECProductCommentFactors(
		id								bigint identity(1,1)			PRIMARY KEY,
		commentId						bigint							NOT NULL
			CONSTRAINT FK_ECProductCommentFactors_CommentId
				FOREIGN KEY REFERENCES ECProductComments(id),
		entityId						bigint							NOT NULL
			CONSTRAINT FK_ECProductCommentFactors_EntityId
				FOREIGN KEY REFERENCES EAVEntities(entityId),
		factorId						int								NOT NULL
			CONSTRAINT FK_ECProdutCommentFactors_FactorId
				FOREIGN KEY REFERENCES ECEntityTypeFactors(id),
		score							int								NOT NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-productcommentfactors-v1', GETDATE(), GETDATE()
END

GO


-- ec-inventorytrackchangestatuses
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-inventorytrackchangestatuses-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECInventoryTrackChangeStatuses(
		id								int								PRIMARY KEY,
		[name]							nvarchar(256)					NOT NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-inventorytrackchangestatuses-v1', GETDATE(), GETDATE()
END

GO


-- ec-inventoryhistories-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-inventoryhistories-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECInventoryHistories(
		id								bigint identity(1,1)			PRIMARY KEY,
		inventoryId						bigint							NOT NULL
			CONSTRAINT FK_ECInventoryHistory_Inventoryid
				FOREIGN KEY REFERENCES ECInventories(id),
		productId						bigint							NOT NULL
			CONSTRAINT FK_ECInventoryHistory_ProductId
				FOREIGN KEY REFERENCES ECProducts(id),
		inventoryTrackChangeStatusId	int								NOT NULL
			CONSTRAINT FK_ECInventoryHistory_InventoryTrackChangeStatusId
				FOREIGN KEY REFERENCES ECInventoryTrackChangeStatuses(id),
		qty								int								NOT NULL,
		orderId							bigint							NULL
			CONSTRAINT FK_ECInventoryHistories_OrderId
				FOREIGN KEY REFERENCES ECOrders(id),
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);



	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-inventoryhistories-v1', GETDATE(), GETDATE()
END

GO



-- ec-pages-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-pages-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECPages(
		id								bigint identity(1,1)			PRIMARY KEY,
		title							nvarchar(256)					NOT NULL,
		slug							nvarchar(512)					NOT NULL,
		[description]					ntext							NULL,
		metaTitle						nvarchar(256)					NULL,
		metaDescription					nvarchar(512)					NULL,
		metaKeywords					nvarchar(512)					NULL,
		userId							bigint							NULL
			CONSTRAINT FK_ECPages_UserId
				FOREIGN KEY REFERENCES Users(id),
		isDeleted						bit								NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);

	


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-pages-v1', GETDATE(), GETDATE()
END

GO




-- ec-wallet
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-wallet-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECWallets(
		id								bigint identity(1,1)			PRIMARY KEY,
		userId							bigint							NULL
			CONSTRAINT FK_ECWallet_UserId
				FOREIGN KEY REFERENCES Users(id),
		currentAmount					bigint							NULL,
		suspendedAmount					bigint							NULL,
		isDeleted						bit								NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-wallet-v1', GETDATE(), GETDATE()
END

GO


-- ec-homepages
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-homepages-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECHomePages(
		id								bigint identity(1,1)			NOT NULL,
		userId							bigint							NULL
			CONSTRAINT FK_ECHomePages_UserId
				FOREIGN KEY REFERENCES Users(id),
		isDeleted						bit								NOT NULL,
		[priority]						int								NULL,
		[jsonContent]					nvarchar(1024)					NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
		CONSTRAINT PK_ECHomePages_isDeleted_Id PRIMARY KEY CLUSTERED (isDeleted, id)
	);

	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-homepages-v1', GETDATE(), GETDATE()
END

GO


-- ec-entityTypeSorts
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-entityTypeSorts-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECEntityTypeSorts(
		id								int								PRIMARY KEY,
		[title]							nvarchar(256)					NOT NULL,
		[sortField]						nvarchar(256)					NOT NULL,
		[sortOrder]						nvarchar(256)					NOT NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);

	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-entityTypeSorts-v1', GETDATE(), GETDATE()
END

GO


-- ec-productfavorites
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-productfavorites-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECProductFavorites(
		userId							bigint							NOT NULL
			CONSTRAINT FK_ECProductFavorites_UserId
				FOREIGN KEY REFERENCES Users(id),
		productId						bigint							NOT NULL
			CONSTRAINT FK_ECProductFavorites_ProductId
				FOREIGN KEY REFERENCES ECProducts(id),
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
		PRIMARY KEY CLUSTERED (userId, productId)
	);

	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-productfavorites-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-slugversiontypes-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECSlugVersionTypes(
		id								int								PRIMARY KEY,
		title							nvarchar(256)					NOT NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL
	);

	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-slugversiontypes-v1', GETDATE(), GETDATE()
END

GO


--ec-slugversion-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-slugversion-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECSlugVersions(
		id								bigint identity(1,1)			PRIMARY KEY,
		slug							nvarchar(256)					NOT NULL,
		slugVersionTypeId				int								NOT NULL
			CONSTRAINT FK_ECSlugVersions_SlugVersionTypeId
				FOREIGN KEY REFERENCES ECSlugVersionTypes(id),
		entityId						bigint							NOT NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-slugversion-v1', GETDATE(), GETDATE()
END

GO


--ec-notification-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-notification-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECNotifications(
		id								bigint identity(1,1)			PRIMARY KEY,
		userId							bigint							NOT NULL
			CONSTRAINT FK_ECNotifications_UserId
				FOREIGN KEY REFERENCES Users(id),
		[message]						nvarchar(1024)					NULL,
		[isDeleted]						bit								NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-notification-v1', GETDATE(), GETDATE()
END

GO

-- ec-selectedproducttypes
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-selectedproducttypes-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECSelectedProductTypes(
		id								int								PRIMARY KEY,
		[title]							nvarchar(256)					NOT NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-selectedproducttypes-v1', GETDATE(), GETDATE()
END

GO

-- ec-selectedproducts
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-selectedproducts-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECSelectedProducts(
		id								int identity(1,1)				PRIMARY KEY,
		title							nvarchar(256)					NOT NULL,
		selectedProductTypeId			int								NOT NULL
			CONSTRAINT FK_SelectedProducts_SelectedProductTypeId
				FOREIGN KEY REFERENCES ECSelectedProductTypes(id),
		slug							nvarchar(256)					NOT NULL,
		attachmentId					bigint							NULL
			CONSTRAINT FK_SelectedProducts_AttachmentId
				FOREIGN KEY REFERENCES Attachments(id),

		[priority]						int								NULL,
		[description]					nvarchar(max)					NULL,
		metaTitle						nvarchar(256)					NULL,
		metaDescription					nvarchar(512)					NULL,
		metaKeywords					nvarchar(512)					NULL,
		isDeleted						bit								NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);



	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-selectedproducts-v1', GETDATE(), GETDATE()
END

GO

-- ec-selectedproductitemss
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-selectedproductitems-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECSelectedProductItems(
		selectedProductId				int								NOT NULL
			CONSTRAINT FK_SelectedProductItems_selectedProductId
				FOREIGN KEY REFERENCES ECSelectedProducts(id),
		productId						bigint							NOT NULL
			CONSTRAINT FK_SelectedProductItems_ProductId
				FOREIGN KEY REFERENCES ECProducts(id),
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
		CONSTRAINT PK_ECSelectedProductItems_SElectedProductId_ProductId
			PRIMARY KEY CLUSTERED (selectedProductId, productId)
	);



	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-selectedproductitems-v1', GETDATE(), GETDATE()
END

GO

-- ec-entity-type-landings-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-entity-type-landings-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECEntityTypeLandings(
		id								bigint identity(1,1)			PRIMARY KEY,
		title							nvarchar(512)					NOT NULL,
		slug							nvarchar(1024)					NOT NULL,
		jsonContent						nvarchar(max)					NOT NULL,
		priority						int								NULL,
		[description]					nvarchar(max)					NULL,
		metaTitle						nvarchar(256)					NULL,
		metaDescription					nvarchar(512)					NULL,
		metaKeywords					nvarchar(512)					NULL,
		userId							bigint							NOT NULL
			CONSTRAINT FK_ECEntityTypeLandings_UserId
				FOREIGN KEY REFERENCES Users(id),
		entityTypeId					int								NOT NULL
			CONSTRAINT FK_ECEntityTypeLandings_EntityTypeId
				FOREIGN KEY REFERENCES EAVEntityTypes(id),
		isDeleted						bit								NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL
	);



	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-entity-type-landings-v1', GETDATE(), GETDATE()
END

GO


-- ec-linked-entity-type-brand-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-linked-entity-type-brand-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECLinkedEntityTypeBrands(
		id								bigint identity(1,1)			PRIMARY KEY,
		title							nvarchar(512)					NOT NULL,
		entityTypeId					int								NOT NULL
			CONSTRAINT FK_ECLinkedEntityTypeBrands_EntityTypeId
				FOREIGN KEY REFERENCES EAVEntityTypes(id),
		brandId							int								NOT NULL
			CONSTRAINT FK_ECLinkedEntityTypeBrands_BrandId
				FOREIGN KEY REFERENCES ECBrands(id),
		metaTitle						nvarchar(512)					NULL,
		metaDescription					nvarchar(512)					NULL,
		metaKeywords					nvarchar(512)					NULL,
		[description]					nvarchar(max)					NULL,
		isDeleted						bit								NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);





	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-linked-entity-type-brand-v1', GETDATE(), GETDATE()
END

GO

-- ec-shopping-cart-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-shopping-cart-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECShoppingCarts(
		id								bigint identity(1,1)			PRIMARY KEY,
		sessionId						nvarchar(256)					NOT NULL,
		expire							datetime						NULL,
		isPurchase						bit								NULL,
		isDeleted						bit								NULL,
		vendorId						int								NULL
			CONSTRAINT FK_ECShoppingCarts_VendorId
				FOREIGN KEY REFERENCES ECVendors(id),
		shippingWayId					int 							NOT NULL
			CONSTRAINT FK_ECShoppingCarts_ShippingWayId
				FOREIGN KEY REFERENCES ECShippingWays(id),
		
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);





	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-shopping-cart-v1', GETDATE(), GETDATE()
END

GO

-- ec-shopping-cart-product-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-shopping-cart-product-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECShoppingCartProducts(
		id								bigint identity(1,1)			PRIMARY KEY,
		shoppingCartId					bigint							NOT NULL
			CONSTRAINT FK_ECShoppingCartProducts_ShoppingCartId
				FOREIGN KEY REFERENCES ECShoppingCarts(id),
		productId						bigint							NOT NULL
			CONSTRAINT FK_ECShoppingCartProducts_ProductId
				FOREIGN KEY REFERENCES ECProducts(id),
		inventoryId						bigint							NOT NULL
			CONSTRAINT FK_ECShoppingCartProducts_InventoryId
				FOREIGN KEY REFERENCES ECInventories(id),	
		qty								int								NOT NULL,
		isDeleted						bit								NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);





	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-shopping-cart-product-v1', GETDATE(), GETDATE()
END

GO


-- ec-logistics
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logistics-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECLogistics(
		id								bigint identity(1,1)			PRIMARY KEY,
		title							nvarchar(256)					NOT NULL,
		isDeleted						bit								NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-logistics-v1', GETDATE(), GETDATE()
END

GO

-- ec-logisticshipmentways-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logisticshipmentways-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECLogisticShipmentWays(
		id								bigint identity(1,1)			PRIMARY KEY,
		logisticId						bigint							NOT NULL
			CONSTRAINT FK_ECLogisticsShipmentWays_LogisticId
				FOREIGN KEY REFERENCES ECLogistics(id),
		orderShipmentWayId				int								NOT NULL
			CONSTRAINT FK_ECLogisticsShipmentWays_OrderShipmentWayId
				FOREIGN KEY REFERENCES ECOrderShipmentWays(id),
		provinceId						int								NULL
			CONSTRAINT FK_ECLogisticsShipmentWays_ProvinceId
				FOREIGN KEY REFERENCES ECProvinces(id),
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL
		
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-logisticshipmentways-v1', GETDATE(), GETDATE()
END

GO



-- ec-logisticshipmentways-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logisticshipmentways-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECLogisticShipmentWays
		ADD isDeleted bit null
		

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-logisticshipmentways-v2', GETDATE(), GETDATE()
END

GO


-- ec-logisticshipmentways-v3
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logisticshipmentways-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE ECLogisticShipmentWays
	ALTER COLUMN logisticId BIGINT NULL;
		

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-logisticshipmentways-v3', GETDATE(), GETDATE()
END

GO

-- ec-logisticsusers-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logisticusers-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECLogisticUsers(
		id								bigint identity(1,1)			PRIMARY KEY,
		logisticId						bigint							NOT NULL
			CONSTRAINT FK_ECLogisticUsers_LogisticId
				FOREIGN KEY REFERENCES ECLogistics(id),
		userId							bigint							NOT NULL
			CONSTRAINT FK_ECLogisticUsers_UserId
				FOREIGN KEY REFERENCES Users(id),
		isDefault						bit								NULL,
		isDeleted						bit								NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL
		
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-logisticusers-v1', GETDATE(), GETDATE()
END

GO


-- ec-logisticsendingperiods-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logisticsendingperiods-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	CREATE TABLE ECLogisticSendingPeriods(
		id								bigint identity(1,1)			PRIMARY KEY,
		logisticShipmentWayId			bigint							NOT NULL
			CONSTRAINT FK_ECLogisticSendingPeriods_LogisticShipmentWayId
				FOREIGN KEY REFERENCES ECLogisticShipmentWays(id),
		scheduleSendingTypeId				int								NOT NULL,
		startDate						datetime						NULL,
		endDate							datetime						NULL,
		isDeleted						bit								NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL
		
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-logisticsendingperiods-v1', GETDATE(), GETDATE()
END

GO



-- ec-logisticweeklyperiods-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logisticweeklyperiods-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	CREATE TABLE ECLogisticWeeklyPeriods(
		id								bigint identity(1,1)			PRIMARY KEY,
		logisticSendingPeriodId			bigint							NOT NULL
			CONSTRAINT FK_ECLogisticWeeklyPeriods_Logistic_SendingPeriodId
				FOREIGN KEY REFERENCES ECLogisticSendingPeriods(id),
		weekNumber						int								NOT NULL,
		isDeleted						bit								NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-logisticweeklyperiods-v1', GETDATE(), GETDATE()
END

GO


-- ec-logisticweeklyperiodtimes-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logisticweeklyperiodtimes-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	CREATE TABLE ECLogisticWeeklyPeriodTimes(
		id								bigint identity(1,1)			PRIMARY KEY,
		logisticWeeklyPeriodId			bigint							NOT NULL
			CONSTRAINT FK_ECLogisticWeeklyPeriodTimes_LogisticWeeklyPeriodId
				FOREIGN KEY REFERENCES ECLogisticWeeklyPeriods(id),
		startTime						time							NOT NULL,
		endTime							time							NOT NULL,
		isDeleted						bit								NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-logisticweeklyperiodtimes-v1', GETDATE(), GETDATE()
END

GO

-- ec-logisticweeklyperiodtimes-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logisticweeklyperiodtimes-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	ALTER TABLE ECLogisticWeeklyPeriodTimes
		ADD capacity int not null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-logisticweeklyperiodtimes-v2', GETDATE(), GETDATE()
END

GO


-- ec-vendor-logistic-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-vendor-logistic-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	CREATE TABLE ECVendorLogistics(
		id								bigint identity(1,1)			PRIMARY KEY,
		vendorId						int								NOT NULL
			CONSTRAINT FK_ECVendorLogistics_VendorId
				FOREIGN KEY REFERENCES ECVendors(id),
		logisticId						bigint							NOT NULL
			CONSTRAINT FK_ECVendorLogistics_LogisticId
				FOREIGN KEY REFERENCES ECLogistics(id),
		isDefault						bit 							NULL,
		isDeleted						bit								NULL,
		[createdAt]						datetimeoffset					NOT NULL,
		[updatedAt]						datetimeoffset					NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-vendor-logistic-v1', GETDATE(), GETDATE()
END

GO


-- ec-logistic-orders
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logistic-orders-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECLogisticOrders(
		id							bigint	identity(1,1)		PRIMARY KEY,
		totalProductPrice			bigint					NULL,
		totalDiscountFee			bigint					NULL,
		totalShipmentPrice			bigint					NULL,
		realShipmentPrice			bigint					NULL,
		totalPrice					bigint					NULL,
		orderStatusId				int						NOT NULL
			CONSTRAINT FK_ECLogisticOrders_OrderStatusId
				FOREIGN KEY REFERENCES ECOrderStatus(id),
		sessionId					nvarchar(256)			NULL,
		userId						bigint					NOT NULL
			CONSTRAINT FK_ECLogisticOrders_UserId
				FOREIGN KEY REFERENCES Users(id),
		addressId					bigint					NULL
			CONSTRAINT FK_ECLogisticOrders_AddressId
				FOREIGN KEY REFERENCES ECAddresses(id),
		postReceipt					nvarchar(256)			NULL,
		transactionId				nvarchar(256)			NULL,
		paymentId					bigint					NULL,
		paymentCommissionAmount	bigint					NULL,
		gregorianAtPersian			datetime				NULL,
		noteDescription				nvarchar(1024)			NULL,
		isDeleted					bit						NULL,
		[createdAt]					datetimeoffset			NOT NULL,
		[updatedAt]					datetimeoffset			NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-logistic-orders-v1', GETDATE(), GETDATE()
END

GO

-- ec-logistic-order-groupeds
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logistic-order-groupeds-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECLogisticOrderGroupeds(
		id									bigint	identity(1,1)		PRIMARY KEY,
		logisticOrderId						bigint					NOT NULL
			CONSTRAINT FK_ECLogisticOrderGroupeds_LogisticOrderId
				FOREIGN KEY REFERENCES ECLogisticOrders(id),
		logisticId							bigint					NOT NULL
			CONSTRAINT FK_ECLogisticOrderGroupeds_LogisticId
				FOREIGN KEY REFERENCES ECLogistics(id),
		logisticShipmentWayId				bigint					NOT NULL
			CONSTRAINT FK_ECLogisticOrderGroupeds_LogisticShipmentWayId
				FOREIGN KEY REFERENCES ECLogisticShipmentWays(id),
		logisticSendingPeriodId				bigint					NOT NULL
			CONSTRAINT FK_ECLogisticOrderGroupeds_LogisticSendingPeriodId
				FOREIGN KEY REFERENCES ECLogisticSendingPeriods(id),
		logisticWeeklyPeriodId				bigint					NULL
			CONSTRAINT FK_ECLogisticOrderGroupeds_LogisticWeeklyPeriodId
				FOREIGN KEY REFERENCES ECLogisticWeeklyPeriods(id),
		logisticWeeklyPeriodTimeId			bigint					NULL
			CONSTRAINT FK_ECLogisticOrderGroupeds_LogisticWeeklyPeriodTimeId
				FOREIGN KEY REFERENCES ECLogisticWeeklyPeriodTimes(id),
		orderStatusId						int						NOT NULL
			CONSTRAINT FK_ECLogisticOrderGroupeds_OrderStatusId
				FOREIGN KEY REFERENCES ECOrderStatus(id),
		totalProductPrice					bigint					NULL,
		totalDiscountFee					bigint					NULL,
		shipmentPrice						bigint					NULL,
		realShipmentPrice					bigint					NULL,
		totalPrice							bigint					NULL,
		[createdAt]						datetimeoffset			NOT NULL,
		[updatedAt]						datetimeoffset			NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-logistic-order-groupeds-v1', GETDATE(), GETDATE()
END

GO


-- ec-logistic-order-groupeds-sendingGregorianDate-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logistic-order-groupeds-sendingGregorianDate-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
    )
    BEGIN

        ALTER TABLE ECLogisticOrderGroupeds
            ADD sendingGregorianDate datetime NULL;

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'ec-logistic-order-groupeds-sendingGregorianDate-v1', GETDATE(), GETDATE()
    END

GO


-- ec-logistic-order-groupeds-v3
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logistic-order-groupeds-v3'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
    )
    BEGIN

        ALTER TABLE ECLogisticOrderGroupeds
            ADD isDeleted bit NULL;

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'ec-logistic-order-groupeds-v3', GETDATE(), GETDATE()
    END

GO

-- ec-logistic-order-groupeds-index-sending-capacity-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logistic-order-groupeds-index-sending-capacity-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
    )
    BEGIN

        IF NOT EXISTS (
            SELECT 1 FROM sys.indexes
            WHERE name = 'IX_ECLogisticOrderGroupeds_Time_SendingDate'
              AND object_id = OBJECT_ID('ECLogisticOrderGroupeds')
        )
            BEGIN
                CREATE INDEX IX_ECLogisticOrderGroupeds_Time_SendingDate
                    ON ECLogisticOrderGroupeds (logisticWeeklyPeriodTimeId, sendingGregorianDate);
            END

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'ec-logistic-order-groupeds-index-sending-capacity-v1', GETDATE(), GETDATE()
    END

GO



-- ec-logistic-order-groupeds-shipping-tracking-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logistic-order-groupeds-shipping-tracking-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
    )
    BEGIN

        ALTER TABLE ECLogisticOrderGroupeds
            ADD courierUserId bigint NULL
                CONSTRAINT FK_ECLogisticOrderGroupeds_CourierUserId
                    FOREIGN KEY REFERENCES Users(id),
                postReceipt nvarchar(256) NULL,
                deliveryDate datetime NULL,
                sendToCustomerDate datetime NULL,
                sendToCustomerBy bigint NULL;

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'ec-logistic-order-groupeds-shipping-tracking-v1', GETDATE(), GETDATE()
    END

GO


-- ec-logistic-order-grouped-details
-- ec-logistic-order-groupeds-orderShipmentWayId-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logistic-order-groupeds-orderShipmentWayId-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
    )
    BEGIN

        ALTER TABLE ECLogisticOrderGroupeds
            ADD orderShipmentWayId int NULL
                CONSTRAINT FK_ECLogisticOrderGroupeds_OrderShipmentWayId
                    FOREIGN KEY REFERENCES ECOrderShipmentWays(id);

      

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'ec-logistic-order-groupeds-orderShipmentWayId-v1', GETDATE(), GETDATE()
    END

GO


-- ec-logistic-order-grouped-details
-- ec-logistic-order-groupeds-orderShipmentWayId-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logistic-order-groupeds-orderShipmentWayId-v2'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
    )
    BEGIN

          -- backfill from ECLogisticShipmentWays
        UPDATE LG
           SET orderShipmentWayId = LSW.orderShipmentWayId
          FROM ECLogisticOrderGroupeds LG
          JOIN ECLogisticShipmentWays LSW ON LSW.id = LG.logisticShipmentWayId
         WHERE LG.orderShipmentWayId IS NULL;

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'ec-logistic-order-groupeds-orderShipmentWayId-v2', GETDATE(), GETDATE()
    END

GO



-- ec-logistic-order-grouped-details
-- ec-logistic-order-groupeds-logisticSendingPeriodId-nullable-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logistic-order-groupeds-logisticSendingPeriodId-nullable-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
    )
    BEGIN

        ALTER TABLE ECLogisticOrderGroupeds
            ALTER COLUMN logisticSendingPeriodId bigint NULL;

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'ec-logistic-order-groupeds-logisticSendingPeriodId-nullable-v1', GETDATE(), GETDATE()
    END

GO

-- ec-logistic-order-grouped-details
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-logistic-order-grouped-details-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECLogisticOrderGroupedDetails(
		id									bigint	identity(1,1)		PRIMARY KEY,
		groupedId							bigint					NOT NULL
			CONSTRAINT FK_ECLogisticOrderGroupedDetails_GroupedId
				FOREIGN KEY REFERENCES ECLogisticOrderGroupeds(id),
		orderDetailStatusId					int						NOT NULL
			CONSTRAINT FK_ECLogisticOrderGroupedDetails_OrderDetailStatusId
				FOREIGN KEY REFERENCES ECOrderDetailStatus(id),
		vendorId							int						NOT NULL
			CONSTRAINT FK_ECLogisticOrderGroupedDetails_VendorId
				FOREIGN KEY REFERENCES ECVendors(id),
		productId							bigint					NOT NULL
			CONSTRAINT FK_ECLogisticOrderGroupedDetails_ProductId
				FOREIGN KEY REFERENCES ECProducts(id),
		inventoryId							bigint					NOT NULL
			CONSTRAINT FK_ECLogisticOrderGroupedDetails_InventoryId
				FOREIGN KEY REFERENCES ECInventories(id),
		inventoryPriceId					bigint					NOT NULL
			CONSTRAINT FK_ECLogisticOrderGroupedDetails_InventoryPriceId
				FOREIGN KEY REFERENCES ECInventoryPrices(id),
		stockId								bigint					NULL,
		qty									int						NULL,
		productPrice						bigint					NULL,
		discountFee							bigint					NULL,
		discountFeePerItem					bigint					NULL,
		discountId							bigint					NULL
			CONSTRAINT FK_ECLogisticOrderGroupedDetails_DiscountId
				FOREIGN KEY REFERENCES ECDiscounts(id),
		totalPrice							bigint					NULL,
		userId								bigint					NULL
			CONSTRAINT FK_ECLogisticOrderGroupedDetails_UserId
				FOREIGN KEY REFERENCES Users(id),
		vendorCommissionId					bigint					NULL
			CONSTRAINT FK_ECLogisticOrderGroupedDetails_VendorCommissionId
				FOREIGN KEY REFERENCES ECVendorCommissions(id),
		commissionAmount					bigint					NULL,
		gregorianAtPersian					datetime				NULL,
		isDeleted							bit						NULL,
		[createdAt]						datetimeoffset			NOT NULL,
		[updatedAt]						datetimeoffset			NOT NULL,
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-logistic-order-grouped-details-v1', GETDATE(), GETDATE()
END

GO

-- ecommerce-payments-logisticOrderId-v1
IF NOT EXISTS (
    SELECT 1 FROM Migrations WHERE version = 'ecommerce-payments-logisticOrderId-v1'
  )
  AND EXISTS (
    SELECT 1 FROM Settings 
    WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
  )
BEGIN

  ALTER TABLE ECPayments
    ADD logisticOrderId bigint NULL
      CONSTRAINT FK_ECPayments_LogisticOrderId
        FOREIGN KEY REFERENCES ECLogisticOrders(id);

  INSERT INTO Migrations(version, createdAt, updatedAt)
  SELECT 'ecommerce-payments-logisticOrderId-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-payments-version-v1'
            )
    AND EXISTS (
        SELECT 1 FROM Settings 
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
    )
BEGIN

  
        ALTER TABLE ECPayments 
            ADD paymentVersion int NULL
    

    INSERT INTO Migrations(version, createdAt, updatedAt)
    SELECT 'ecommerce-payments-version-v1', GETDATE(), GETDATE()
END

GO

-- ecommerce-inventory-history-logisticOrderId-v1
IF NOT EXISTS (
    SELECT 1 FROM Migrations WHERE version = 'ecommerce-inventory-history-logisticOrderId-v1'
  )
  AND EXISTS (
    SELECT 1 FROM Settings 
    WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
  )
BEGIN

  ALTER TABLE ECInventoryHistories
    ADD logisticOrderId bigint NULL
      CONSTRAINT FK_ECInventoryHistories_LogisticOrderId
        FOREIGN KEY REFERENCES ECLogisticOrders(id);

  INSERT INTO Migrations(version, createdAt, updatedAt)
  SELECT 'ecommerce-inventory-history-logisticOrderId-v1', GETDATE(), GETDATE()
END

GO


-- ecommerce-vendors-isActive-v1
IF NOT EXISTS (
    SELECT 1 FROM Migrations WHERE version = 'ecommerce-vendors-isActive-v1'
  )
  AND EXISTS (
    SELECT 1 FROM Settings
    WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
  )
BEGIN

  ALTER TABLE ECVendors
    ADD isActive bit NULL;

  INSERT INTO Migrations(version, createdAt, updatedAt)
  SELECT 'ecommerce-vendors-isActive-v1', GETDATE(), GETDATE()
END

GO

-- ec-products-v11.1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-products-v11.1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

    ALTER TABLE ECProducts
            ADD CONSTRAINT DF_ECProducts_viewCount DEFAULT 0 FOR viewCount;


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-products-v11.1', GETDATE(), GETDATE()

END
GO

-- ec-products-v11
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-products-v11' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	BEGIN TRAN;
    DECLARE @Sql NVARCHAR(MAX);

    DECLARE @DF_Name sysname;

    SELECT @DF_Name = dc.name
    FROM sys.default_constraints dc
    JOIN sys.columns c
        ON c.object_id = dc.parent_object_id
    AND c.column_id = dc.parent_column_id
    WHERE dc.parent_object_id = OBJECT_ID('dbo.ECProducts')
    AND c.name = 'viewCount';

    IF @DF_Name IS NOT NULL
    BEGIN
        SET @Sql = N'ALTER TABLE dbo.ECProducts DROP CONSTRAINT ' + QUOTENAME(@DF_Name) + ';';
        PRINT @Sql;
        EXEC (@Sql);
    END;

    IF OBJECT_ID('tempdb..#IndexesOn_viewCount') IS NOT NULL
        DROP TABLE #IndexesOn_viewCount;

    CREATE TABLE #IndexesOn_viewCount
    (
        IndexName        sysname,
        IsUnique         bit,
        IsClustered      bit,
        IndexedColumns   NVARCHAR(MAX),
        IncludedColumns  NVARCHAR(MAX),
        FilterDefinition NVARCHAR(MAX)
    );

    INSERT INTO #IndexesOn_viewCount (IndexName, IsUnique, IsClustered, IndexedColumns, IncludedColumns, FilterDefinition)
    SELECT DISTINCT
        i.name AS IndexName,
        i.is_unique,
        CASE WHEN i.type = 1 THEN 1 ELSE 0 END AS IsClustered,
        -- key columns
        STUFF((
            SELECT ',' + QUOTENAME(c2.name)
                + CASE WHEN ic2.is_descending_key = 1 THEN ' DESC' ELSE ' ASC' END
            FROM sys.index_columns ic2
            JOIN sys.columns c2
            ON c2.object_id = ic2.object_id
            AND c2.column_id = ic2.column_id
            WHERE ic2.object_id = i.object_id
            AND ic2.index_id = i.index_id
            AND ic2.is_included_column = 0
            ORDER BY ic2.key_ordinal
            FOR XML PATH(''), TYPE
        ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS IndexedColumns,
        -- included columns
        STUFF((
            SELECT ',' + QUOTENAME(c3.name)
            FROM sys.index_columns ic3
            JOIN sys.columns c3
            ON c3.object_id = ic3.object_id
            AND c3.column_id = ic3.column_id
            WHERE ic3.object_id = i.object_id
            AND ic3.index_id = i.index_id
            AND ic3.is_included_column = 1
            ORDER BY c3.column_id
            FOR XML PATH(''), TYPE
        ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS IncludedColumns,
        i.filter_definition
    FROM sys.indexes i
    JOIN sys.index_columns ic
        ON i.object_id = ic.object_id
    AND i.index_id  = ic.index_id
    JOIN sys.columns c
        ON c.object_id = ic.object_id
    AND c.column_id = ic.column_id
    WHERE i.object_id = OBJECT_ID('dbo.ECProducts')
    AND c.name = 'viewCount'
    AND i.is_primary_key = 0           
    AND i.is_unique_constraint = 0     
    AND i.type IN (1,2);               

    DECLARE @DropSql NVARCHAR(MAX) = N'';

    SELECT @DropSql = @DropSql +
        N'DROP INDEX ' + QUOTENAME(ix.IndexName) +
        N' ON ' + QUOTENAME(OBJECT_SCHEMA_NAME(OBJECT_ID('dbo.ECProducts'))) +
        N'.' + QUOTENAME(OBJECT_NAME(OBJECT_ID('dbo.ECProducts'))) + N';' + CHAR(10)
    FROM #IndexesOn_viewCount ix;

    IF @DropSql <> N''
    BEGIN
        PRINT @DropSql;
        EXEC (@DropSql);
    END;

    

    ALTER TABLE dbo.ECProducts
        ALTER COLUMN viewCount BIGINT NULL;

    DECLARE
        @IndexName        sysname,
        @IsUnique         bit,
        @IsClustered      bit,
        @IndexedColumns   NVARCHAR(MAX),
        @IncludedColumns  NVARCHAR(MAX),
        @FilterDefinition NVARCHAR(MAX);

    DECLARE idx_cursor CURSOR LOCAL FAST_FORWARD FOR
    SELECT IndexName, IsUnique, IsClustered, IndexedColumns, IncludedColumns, FilterDefinition
    FROM #IndexesOn_viewCount;

    OPEN idx_cursor;

    FETCH NEXT FROM idx_cursor
    INTO @IndexName, @IsUnique, @IsClustered, @IndexedColumns, @IncludedColumns, @FilterDefinition;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @Sql = N'CREATE ' +
                CASE WHEN @IsUnique = 1 THEN N'UNIQUE ' ELSE N'' END +
                CASE WHEN @IsClustered = 1 THEN N'CLUSTERED ' ELSE N'NONCLUSTERED ' END +
                N'INDEX ' + QUOTENAME(@IndexName) +
                N' ON dbo.ECProducts(' + @IndexedColumns + N')';

        IF @IncludedColumns IS NOT NULL AND @IncludedColumns <> N''
            SET @Sql = @Sql + N' INCLUDE (' + @IncludedColumns + N')';

        IF @FilterDefinition IS NOT NULL
            SET @Sql = @Sql + N' WHERE ' + @FilterDefinition;

        PRINT @Sql;
        EXEC (@Sql);

        FETCH NEXT FROM idx_cursor
        INTO @IndexName, @IsUnique, @IsClustered, @IndexedColumns, @IncludedColumns, @FilterDefinition;
    END;

    CLOSE idx_cursor;
    DEALLOCATE idx_cursor;

    COMMIT TRAN;


	
        

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-products-v11', GETDATE(), GETDATE()
END
GO


-- ec-product-views-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-product-views-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE ECProductViews (
		id							bigint identity(1,1)		NOT NULL,
		productId					bigint						NOT NULL
			CONSTRAINT FK_ECProductViews_ProductId
				FOREIGN KEY REFERENCES ECProducts(id),
		sessionId					nvarchar(256)				NULL,
		userId						bigint						NULL
			CONSTRAINT FK_ECProductViews_UserId
				FOREIGN KEY REFERENCES Users(id),
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
		PRIMARY KEY CLUSTERED (id, productId)
	);

	CREATE NONCLUSTERED INDEX NIX_ECProductViews_SessionId ON ECProductViews(sessionId)
	INCLUDE (productId, userId);

	CREATE NONCLUSTERED INDEX NIX_ECProductViews_UserId ON ECProductViews(userId)
	INCLUDE (productId, sessionId);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-product-views-v1', GETDATE(), GETDATE()
END
GO


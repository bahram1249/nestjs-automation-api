

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-buffetType-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	CREATE TABLE DiscountCoffeBuffetTypes (
		id							int						PRIMARY KEY,
		title						nvarchar(256)			NOT NULL,
		[createdAt]					datetimeoffset			NOT NULL,
		[updatedAt]					datetimeoffset			NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-buffetType-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-buffet-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	CREATE TABLE DiscountCoffeBuffets (
		id							bigint	identity(1,1)	PRIMARY KEY,
		coverAttachmentId			bigint					NULL
			CONSTRAINT FK_DiscountCoffeBuffet_AttachmentId
				FOREIGN KEY REFERENCES Attachments(id),
		title						nvarchar(256)			NOT NULL,
		urlAddress					nvarchar(1024)			NULL,
		buffetTypeId				int						NULL
			CONSTRAINT FK_DiscountCoffeBuffet_buffetTypeId
				FOREIGN KEY REFERENCES DiscountCoffeBuffetTypes(id),
		percentDiscount				int						NULL,
		buffetDescription			ntext					NULL,
		buffetAddress				nvarchar(512)			NULL,
		buffetPhone					nvarchar(512)			NULL,
		wazeLink					nvarchar(1024)			NULL,
		baladLink					nvarchar(1024)			NULL,
		neshanLink					nvarchar(1024)			NULL,
		googleMapLink				nvarchar(1024)			NULL,
		latitude					nvarchar(256)			NULL,
		longitude					nvarchar(256)			NULL,
		viewCount					bigint					NULL,
		userId						bigint					NOT NULL
			CONSTRAINT FK_DiscountCoffeBuffet_UserId
				FOREIGN KEY REFERENCES Users(id),
		ownerId						bigint					NOT NULL
			CONSTRAINT FK_DiscountCoffeBuffet_OwnerId
				FOREIGN KEY REFERENCES Users(id),
		[createdAt]					datetimeoffset			NOT NULL,
		[updatedAt]					datetimeoffset			NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-buffet-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-buffet-galleries-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	CREATE TABLE DiscountCoffeBuffetGalleries (
		buffetId					bigint					NOT NULL,
		attachmentId				bigint					NOT NULL
			CONSTRAINT FK_DiscountCoffeBuffetGalleries_AttachmentId
				FOREIGN KEY REFERENCES Attachments(id),
		[createdAt]					datetimeoffset			NOT NULL,
		[updatedAt]					datetimeoffset			NOT NULL,
		PRIMARY KEY CLUSTERED(buffetId, attachmentId)
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-buffet-galleries-v1', GETDATE(), GETDATE()
END

GO




IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-buffetCost-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	CREATE TABLE DiscountCoffeBuffetCosts (
		id							int						PRIMARY KEY,
		title						nvarchar(256)			NOT NULL,
		[createdAt]					datetimeoffset			NOT NULL,
		[updatedAt]					datetimeoffset			NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-buffetCost-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-buffet-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	ALTER TABLE DiscountCoffeBuffets
	ADD buffetCostId int NULL
		CONSTRAINT FK_DiscountCoffeBuffets_buffetCostId
			FOREIGN KEY REFERENCES DiscountCoffeBuffetCosts(id)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-buffet-v2', GETDATE(), GETDATE()
END

GO




IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-city-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	CREATE TABLE DiscountCoffeCities (
		id							int						PRIMARY KEY,
		title						nvarchar(256)			NOT NULL,
		[createdAt]					datetimeoffset			NOT NULL,
		[updatedAt]					datetimeoffset			NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-city-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-buffet-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	ALTER TABLE DiscountCoffeBuffets
	ADD cityId int NULL
		CONSTRAINT FK_DiscountCoffeBuffets_cityId
			FOREIGN KEY REFERENCES DiscountCoffeCities(id)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-buffet-v3', GETDATE(), GETDATE()
END

GO




IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-options-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	CREATE TABLE DiscountCoffeOptions (
		id							int						PRIMARY KEY,
		title						nvarchar(256)			NOT NULL,
		iconClass					nvarchar(256)			NOT NULL,
		[createdAt]					datetimeoffset			NOT NULL,
		[updatedAt]					datetimeoffset			NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-options-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-buffet-v4' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	ALTER TABLE DiscountCoffeBuffets
	ADD isDeleted bit null,
		deletedBy bigint null
			CONSTRAINT FK_DiscountCoffeBuffets_deletedBy
				FOREIGN KEY REFERENCES Users(id)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-buffet-v4', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-buffet-v5' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	ALTER TABLE DiscountCoffeBuffets
	ADD pin bit NULL

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-buffet-v5', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-buffetOptions-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	CREATE TABLE DiscountCoffeBuffetOptions (
		id							bigint identity(1,1)	PRIMARY KEY,
		buffetId					bigint					NOT NULL
			CONSTRAINT FK_DiscountCoffeBuffetOptions_buffetId
				FOREIGN KEY REFERENCES DiscountCoffeBuffets(id),
		optionId					int						NOT NULL
			CONSTRAINT FK_DiscountCoffeOptions_optionId
				FOREIGN KEY REFERENCES DiscountCoffeOptions(id),
		[createdAt]					datetimeoffset			NOT NULL,
		[updatedAt]					datetimeoffset			NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-buffetOptions-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-MenuCategory-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	CREATE TABLE DiscountCoffeMenuCategories (
		id							int identity(1,1)		PRIMARY KEY,
		title						nvarchar(256)			NULL,
		coverAttachmentId			bigint					NOT NULL
			CONSTRAINT  FK_DiscountCoffeMenuCategories_coverAttachmentId
				FOREIGN KEY REFERENCES Attachments(id),
		[createdAt]					datetimeoffset			NOT NULL,
		[updatedAt]					datetimeoffset			NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-MenuCategory-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-menu-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	CREATE TABLE DiscountCoffeMenus (
		id							bigint identity(1,1)		PRIMARY KEY,
		title						nvarchar(256)				NOT NULL,
		attachmentId				bigint						NULL
			CONSTRAINT FK_DiscountCoffe_Menus_AttachmentId
				FOREIGN KEY REFERENCES Attachments(id),
		menuCategoryId				int							NOT NULL
			CONSTRAINT FK_DiscountCoffeMenus_menuCategoryId
				FOREIGN KEY REFERENCES DiscountCoffeMenuCategories(id),
		buffetId					bigint						NOT NULL
			CONSTRAINT FK_DiscountCoffeMenus_BuffetId
				FOREIGN KEY REFERENCES DiscountCoffeBuffets(id),
		price						bigint						NOT NULL,
		userId						bigint						NOT NULL
			CONSTRAINT FK_DiscountCoffeMenus_UserId
				FOREIGN KEY REFERENCES Users(id),
		isDeleted					bit							NULL,
		deletedBy					bigint						NULL
			CONSTRAINT FK_DiscountCoffeMenus_DeletedBy
				FOREIGN KEY REFERENCES Users(id),
		[deletedAt]					datetimeoffset				NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-menu-v1', GETDATE(), GETDATE()
END

GO



IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-reservestatus-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	CREATE TABLE DiscountCoffeReserveStatuses (
		id							int							PRIMARY KEY,
		title						nvarchar(256)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-reservestatus-v1', GETDATE(), GETDATE()
END

GO





IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-reservetypes-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	CREATE TABLE DiscountCoffeReserveTypes (
		id							int							PRIMARY KEY,
		title						nvarchar(256)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-reservetypes-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-reserves-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	CREATE TABLE DiscountCoffeReserves (
		id							bigint identity(1,1)		PRIMARY KEY,
		userId						bigint						NULL
			CONSTRAINT FK_DiscountCoffeReserves_UserId
				FOREIGN KEY REFERENCES Users(id),
		reserveStatusId				int							NOT NULL
			CONSTRAINT FK_DiscountCoffeReserves_ReserveStatusId
				FOREIGN KEY REFERENCES DiscountCoffeReserveStatuses(id),
		reserveTypeId				int							NOT NULL
			CONSTRAINT FK_DisocuntCoffeReserves_ReserveTypeId
				FOREIGN KEY REFERENCES DiscountCoffeReserveTypes(id),
		attachmentId				bigint						NULL
			CONSTRAINT FK_DiscountCoffeReserve_AttachmentId
				FOREIGN KEY REFERENCES Attachments(id),
		personCount					int							NOT NULL,
		uniqueCode					nvarchar(1024)				NULL,
		buffetId					bigint						NOT NULL
			CONSTRAINT FK_DiscountCoffeReserves_BuffetId
				FOREIGN KEY REFERENCES DiscountCoffeBuffets(id),
		price						bigint						NULL,
		reserveDate					datetime					NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-reserves-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-reserves-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	ALTER TABLE DiscountCoffeReserves 
	ADD isQrScan bit null,
		qrScanDate datetime null,
		qrScanBy bigint null
			CONSTRAINT FK_DiscountCoffeReserveQrScanBy
				FOREIGN KEY REFERENCES Users(id)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-reserves-v2', GETDATE(), GETDATE()
END

GO



IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-reserveDetail-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	CREATE TABLE DiscountCoffeReserveDetails (
		id							bigint identity(1,1)		PRIMARY KEY,
		reserveId					bigint						NOT NULL
			CONSTRAINT FK_DiscountCoffeReserveDetails_ReserveId
				FOREIGN KEY REFERENCES DiscountCoffeReserves(id),
		menuId						bigint						NOT NULL
			CONSTRAINT FK_DisocuntCoffeReserveDetails_MenuId
				FOREIGN KEY REFERENCES DiscountCoffeMenus(id),
		price						bigint						NOT NULL,
		totalPrice					bigint						NOT NULL,
		countItem					int							NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-reserveDetail-v1', GETDATE(), GETDATE()
END

GO




IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-VW_BuffetReservers-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN
	EXEC('
	CREATE VIEW VW_BuffetReservers
	AS
	SELECT Buffets.id
			, Buffets.title
			, buffets.ownerId
			, T.YearNumber
			, T.MonthNumber
			, T.PersianMonthName
			, T.MinDate
			, T.MaxDate
			, COUNT(CASE WHEN reserveStatusId = 2 THEN Reservers.id END) as totalCnt
			, COUNT(CASE WHEN reserveStatusId = 2 AND reserveTypeId = 1 THEN Reservers.id END) as onlineCnt
			, COUNT(CASE WHEN reserveStatusId = 2 AND reserveTypeId = 2 THEN Reservers.id END) as offlineCnt
			, ISNULL(SUM(CASE WHEN reserveStatusId = 2 AND reserveTypeId = 1 THEN Reservers.price END), 0) as onlineSumPrice
	FROM DiscountCoffeBuffets Buffets
	CROSS JOIN (
		SELECT YearNumber
				,MonthNumber
				,PersianMonthName
				,MIN(GregorianDate) MinDate
				,MAX(GregorianDate) AS MaxDate
		FROM PersianDates
		WHERE YearNumber = (SELECT  top 1 YearNumber
			FROM PersianDates
			WHERE GregorianDate = CONVERT(date, getdate(), 103)
		)
		GROUP BY YearNumber,MonthNumber, PersianMonthName
	) T
	LEFT JOIN DiscountCoffeReserves Reservers
	ON Buffets.id = Reservers.buffetId 
		AND Reservers.reserveDate BETWEEN T.MinDate AND T.MaxDate
	GROUP BY  Buffets.id
			, Buffets.title
			, buffets.ownerId
			, T.YearNumber
			, T.MonthNumber
			, T.PersianMonthName
			, T.MinDate
			, T.MaxDate')


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-VW_BuffetReservers-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-VW_BuffetReservers-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN
	EXEC('
	  
 ALTER VIEW [dbo].[VW_BuffetReservers]  
 AS  
 SELECT Buffets.id  
   , Buffets.title  
   , buffets.ownerId  
   , T.YearNumber  
   , T.MonthNumber  
   , T.PersianMonthName  
   , T.MinDate  
   , T.MaxDate  
   , COUNT(DISTINCT CASE WHEN reserveStatusId = 2 THEN Reservers.id END) as totalCnt  
   , COUNT(DISTINCT CASE WHEN reserveStatusId = 2 AND reserveTypeId = 1 THEN Reservers.id END) as onlineCnt
   , COUNT(DISTINCT CASE WHEN reserveStatusId = 2 AND reserveTypeId = 1 AND isQrScan = 1 THEN Reservers.id END) as onlineScanCnt
   , COUNT(DISTINCT CASE WHEN reserveStatusId = 2 AND reserveTypeId = 2 THEN Reservers.id END) as offlineCnt
   , COUNT(DISTINCT CASE WHEN reserveStatusId = 2 AND reserveTypeId = 2 AND isQrScan = 1 THEN Reservers.id END) as offlineScanCnt  
   , ISNULL(SUM(CASE WHEN reserveStatusId = 2 AND reserveTypeId = 1 THEN Reservers.price END), 0) as onlineSumPrice
   , ISNULL(SUM(CASE WHEN reserveStatusId = 2 AND reserveTypeId = 1 AND isQrScan = 1 THEN Reservers.price END), 0) as onlineSumPriceScaned 
   , ISNULL(SUM(CASE WHEN reserveStatusId = 2 AND reserveTypeId = 2 THEN Reservers.price END), 0) as offlineSumPrice
   , ISNULL(SUM(CASE WHEN reserveStatusId = 2 AND reserveTypeId = 2 AND isQrScan = 1 THEN Reservers.price END), 0) as offlineSumPriceScaned
 FROM DiscountCoffeBuffets Buffets  
 CROSS JOIN (  
  SELECT YearNumber  
    ,MonthNumber  
    ,PersianMonthName  
    ,MIN(GregorianDate) MinDate  
    ,MAX(GregorianDate) AS MaxDate  
  FROM PersianDates  
  WHERE YearNumber = (SELECT  top 1 YearNumber  
   FROM PersianDates  
   WHERE GregorianDate = CONVERT(date, getdate(), 103)  
  )  
  GROUP BY YearNumber,MonthNumber, PersianMonthName  
 ) T  
 LEFT JOIN DiscountCoffeReserves Reservers  
 ON Buffets.id = Reservers.buffetId   
  AND Reservers.reserveDate BETWEEN T.MinDate AND T.MaxDate  
 GROUP BY  Buffets.id  
   , Buffets.title  
   , buffets.ownerId  
   , T.YearNumber  
   , T.MonthNumber  
   , T.PersianMonthName  
   , T.MinDate  
   , T.MaxDate  ')


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-VW_BuffetReservers-v2', GETDATE(), GETDATE()
END

GO

-- ignore reserves
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-IgnoreReserve-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN

	CREATE TABLE DiscountCoffeIgnoreReserves (
		id							bigint identity(1,1)		PRIMARY KEY,
		buffetId					bigint							NOT NULL
			CONSTRAINT FK_DiscountCoffeIgnoreReserves_BuffetId
				FOREIGN KEY REFERENCES DiscountCoffeBuffets(id),
		ignoreDate					date						NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-IgnoreReserve-v1', GETDATE(), GETDATE()
END

GO
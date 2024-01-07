IF OBJECT_ID('Settings', 'U') IS  NULL 
BEGIN
	CREATE TABLE Settings
	(
		id							bigint identity(1,1)					PRIMARY KEY,
		[key]						nvarchar(250)							NOT NULL,
		[value]						nvarchar(250)							NOT NULL,
		[type]						nvarchar(250)							NOT NULL,
		[createdAt]					datetimeoffset							NOT NULL,
		[updatedAt]					datetimeoffset							NOT NULL
	)


END

GO

IF OBJECT_ID('Migrations', 'U') IS  NULL 
BEGIN
	
	CREATE TABLE Migrations
	(
		id							bigint identity(1,1)					NOT NULL,
		[version]					nvarchar(200)							PRIMARY KEY,
		[description]				nvarchar(500)							NULL,
		[createdAt]					datetimeoffset							NOT NULL,
		[updatedAt]					datetimeoffset							NOT NULL
	)
END

GO

IF OBJECT_ID('WinstonLogs', 'U') IS  NULL 
BEGIN
	CREATE Table WinstonLogs
	(
		id							bigint identity(1,1)					PRIMARY KEY,
		[level]						nvarchar(250)							NULL,
		message						nvarchar(1024)							NULL,
		meta						nvarchar(max)							NULL,
		createdAt					datetimeoffset							NOT NULL,
		updatedAt					datetimeoffset							NOT NULL,
	);
END

GO

-- Core Tables

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Users-v1' 
					
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN

	CREATE TABLE Users
	(
		id							bigint identity(1,1)				PRIMARY KEY,
		firstname					nvarchar(256)						NULL,
		lastname					nvarchar(256)						NULL,
		email						nvarchar(256)						NULL,
		username					nvarchar(256)						NULL,
		[password]					nvarchar(1024)						NULL,
		phoneNumber					nvarchar(20)						NULL,
		mustChangePassword			bit									NULL,
		lastPasswordChangeDate		datetime							NULL,
		static_id					int									NULL,
		profilePhotoAttachmentId	bigint								NULL,
		[createdAt]					datetimeoffset						NOT NULL,
		[updatedAt]					datetimeoffset						NOT NULL

	)

	CREATE NONCLUSTERED INDEX [NIX_Users_ProfilePhotoId] ON Users(profilePhotoAttachmentId)
	INCLUDE (id, firstname,lastname,username, phoneNumber)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Users-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-v1' 
					
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN


	CREATE TABLE AttachmentTypes
	(
		id						int									PRIMARY KEY,
		typeName				nvarchar(256)						NOT NULL,
		[order]					int									NULL,
		[settings]				nvarchar(1024)						NULL,
		[createdAt]				datetimeoffset						NOT NULL,
		[updatedAt]				datetimeoffset						NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Attachments-v1' 
				
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN


	CREATE TABLE Attachments
	(
		id						bigint  identity(1,1)				PRIMARY KEY,
		originalFileName		nvarchar(512)						NULL,
		fileName				nvarchar(512)						NULL,
		ext						nvarchar(32)						NULL,
		mimetype				nvarchar(64)						NULL,
		[path]					nvarchar(1024)						NULL,
		[thumbnailPath]			nvarchar(1024)						NULL,
		attachmentTypeId		int									NULL
			CONSTRAINT FK_Attachments_AttachmentTypeId
				FOREIGN KEY REFERENCES AttachmentTypes(id),
		userId					bigint								NULL
			CONSTRAINT FK_Attachments_UserId
				FOREIGN KEY REFERENCES Users(id),
		persianDate				nvarchar(32)						NULL,
		persianMonth			nvarchar(16)						NULL,
		isDeleted				bit									NULL,
		deletedDate				datetime							NULL,
		deletedBy				bigint								NULL
			CONSTRAINT FK_Attachments_deletedBy
				FOREIGN KEY REFERENCES Users(id),

		[createdAt]				datetimeoffset						NOT NULL,
		[updatedAt]				datetimeoffset						NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Attachments-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-PermissionGroups-v1' 
			
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN


	CREATE TABLE PermissionGroups
	(
		id						int identity(1,1)					PRIMARY KEY,
		permissionGroupName		nvarchar(256)						NULL,
		[visibility]			bit									NULL,
		[order]					int									NULL,
		[createdAt]				datetimeoffset						NOT NULL,
		[updatedAt]				datetimeoffset						NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-PermissionGroups-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-v1' 
					
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN

	CREATE TABLE Permissions
	(
		id						int identity(1,1)					PRIMARY KEY,
		permissionSymbol		nvarchar(512)						NULL,
		permissionName			nvarchar(256)						NULL,
		permissionUrl			nvarchar(1024)						NULL,
		permissionMethod		nvarchar(10)						NULL,
		permissionGroupId		int									NULL
			CONSTRAINT FK_Permissions_PermissionGroupId
				FOREIGN KEY REFERENCES PermissionGroups(id),
		visibility				bit									NULL,
		[createdAt]					datetimeoffset					NOT NULL,
		[updatedAt]					datetimeoffset					NOT NULL

	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Menus-v1' 
				
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN

	CREATE TABLE Menus
	(
		id						int	identity(1,1)					PRIMARY KEY,
		title					nvarchar(256)						NULL,
		url						nvarchar(1024)						NULL,
		icon					nvarchar(256)						NULL,
		className				nvarchar(256)						NULL,
		[order]					int									NULL,
		parentMenuId			int									NULL
			CONSTRAINT FK_Menus_Menus_id
				FOREIGN KEY REFERENCES Menus(id),
		visibility				bit									NULL,
		[createdAt]				datetimeoffset					NOT NULL,
		[updatedAt]				datetimeoffset					NOT NULL

	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Menus-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-PermissionMenus-v1' 
					
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN

	CREATE TABLE PermissionMenus
	(
		id						int	identity(1,1)					PRIMARY KEY,
		menuId					int									NOT NULL
			CONSTRAINT FK_PermissionMenus_MenuId
				FOREIGN KEY REFERENCES Menus(id),
		permissionId			int									NOT NULL
			CONSTRAINT FK_PermissionMenus_PermissionId
				FOREIGN KEY REFERENCES Permissions(id),
		[createdAt]				datetimeoffset					NOT NULL,
		[updatedAt]				datetimeoffset					NOT NULL

	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-PermissionMenus-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Roles-v1' 
					
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN

	CREATE TABLE Roles
	(
		id						int	identity(1,1)					PRIMARY KEY,
		roleName				nvarchar(256)						NOT NULL,
		static_id				int									NULL,
		visibility				bit									NULL,
		[createdAt]				datetimeoffset						NOT NULL,
		[updatedAt]				datetimeoffset						NOT NULL

	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Roles-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-RolePermissions-v1' 
					
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN

	CREATE TABLE RolePermissions
	(
		id						int	identity(1,1)					PRIMARY KEY,
		roleId					int									NOT NULL
			CONSTRAINT FK_RolePermissions_RoleId
				FOREIGN KEY REFERENCES Roles(id),
		permissionId			int									NOT NULL
			CONSTRAINT FK_RolePermissions_PermissionId
				FOREIGN KEY REFERENCES Permissions(id),
		[createdAt]				datetimeoffset					NOT NULL,
		[updatedAt]				datetimeoffset					NOT NULL

	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-RolePermissions-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-UserRoles-v1' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN

	CREATE TABLE UserRoles
	(
		id						bigint identity(1,1)			PRIMARY KEY,
		userId					bigint							NOT NULL
			CONSTRAINT FK_UserRoles_UserId
				FOREIGN KEY REFERENCES Users(id),
		roleId					int								NOT NULL
			CONSTRAINT FK_UserRoles_RoleId
				FOREIGN KEY REFERENCES Roles(id),
		[createdAt]				datetimeoffset					NOT NULL,
		[updatedAt]				datetimeoffset					NOT NULL

	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-UserRoles-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-PersianDates-v1' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN
	CREATE TABLE PersianDates (

		GregorianDate						date					PRIMARY KEY,
		YearMonthDay						varchar(10)				NOT NULL,
		YearMonth							varchar(7)				NOT NULL,
		WeekDayName							nvarchar(10)			NOT NULL,
		WeekDayNumber						tinyint					NOT NULL,
		DayInMonth							tinyint					NOT NULL,
		DayInMonthAtLeastTwo				varchar(2)				NOT NULL,
		MonthNumber							tinyint					NOT NULL,
		MonthNumberAtLeastTwo				varchar(2)				NOT NULL,
		PersianMonthName					nvarchar(15)			NOT NULL,
		YearNumber							smallint				NOT NULL,
		DayInYearNumber						smallint				NOT NULL,
		DayNameInMonth						nvarchar(40)			NOT NULL,
		DayNameInYear						nvarchar(50)			NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-PersianDates-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-PersianDates-v2' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN
	
	EXEC('
	CREATE FUNCTION [dbo].[SDAT] (@intDate DATETIME , @format as nvarchar(50)) RETURNS NVARCHAR(50)

	BEGIN
	DECLARE @YY Smallint=year(@intdate),@MM Tinyint=10,@DD Smallint=11,@DDCNT Tinyint,@YYDD Smallint=0,
			@SHMM NVARCHAR(8),@SHDD NVARCHAR(8)
	DECLARE @SHDATE NVARCHAR(max)



	IF @YY < 1000 SET @YY += 2000

	IF (@Format IS NULL) OR NOT LEN(@Format)>0 SET @Format = ''ChandShanbe Rooz MaahHarfi Saal''

	SET @YY -= 622

	IF @YY % 4 = 3 and @yy > 1371 SET @dd = 12

	SET @DD += DATEPART(DY,@intDate) - 1

	WHILE 1 = 1
	BEGIN

	 SET @DDCNT =
		CASE
			WHEN @MM < 7 THEN 31
			WHEN @YY % 4 < 3 and @MM=12 and @YY > 1370 THEN 29
			WHEN @YY % 4 <> 2 and @MM=12 and @YY < 1375 THEN 29
			ELSE 30
		END
		IF @DD > @DDCNT
		BEGIN
			SET @DD -= @DDCNT
			SET @MM += 1
			SET @YYDD += @DDCNT
		END
		IF @MM > 12
		BEGIN
			SET @MM = 1
			SET @YY += 1
			SET @YYDD = 0
		END
		IF @MM < 7 AND @DD < 32 BREAK
		IF @MM BETWEEN 7 AND 11 AND @DD < 31 BREAK
		IF @MM = 12 AND @YY % 4 < 3 AND @YY > 1370 AND @DD < 30 BREAK
		IF @MM = 12 AND @YY % 4 <> 2 AND @YY < 1375 AND @DD < 30 BREAK
		IF @MM = 12 AND @YY % 4 = 2 AND @YY < 1371 AND @DD < 31 BREAK
		IF @MM = 12 AND @YY % 4 = 3 AND @YY > 1371 AND @DD < 31 BREAK

	END

	 SET @YYDD += @DD

	SET @SHMM =
		CASE
			WHEN @MM=1 THEN N''فروردین''
			WHEN @MM=2 THEN N''اردیبهشت''
			WHEN @MM=3 THEN N''خرداد''
			WHEN @MM=4 THEN N''تیر''
			WHEN @MM=5 THEN N''مرداد''
			WHEN @MM=6 THEN N''شهریور''
			WHEN @MM=7 THEN N''مهر''
			WHEN @MM=8 THEN N''آبان''
			WHEN @MM=9 THEN N''آذر''
			WHEN @MM=10 THEN N''دی''
			WHEN @MM=11 THEN N''بهمن''
			WHEN @MM=12 THEN N''اسفند''
		END
   

	set @SHDD=
		CASE
			WHEN DATEPART(dw,@intdate)=7 THEN N''شنبه''
			WHEN DATEPART(dw,@intdate)=1 THEN N''یکشنبه''
			WHEN DATEPART(dw,@intdate)=2 THEN N''دوشنبه''
			WHEN DATEPART(dw,@intdate)=3 THEN N''سه شنبه''
			WHEN DATEPART(dw,@intdate)=4 THEN N''چهارشنبه''
			WHEN DATEPART(dw,@intdate)=5 THEN N''پنجشنبه''
			WHEN DATEPART(dw,@intdate)=6 THEN N''جمعه''
		END
	SET @DDCNT=
		CASE
			WHEN @SHDD=N''شنبه'' THEN 1
			WHEN @SHDD=N''یکشنبه'' THEN 2
			WHEN @SHDD=N''دوشنبه'' THEN 3
			WHEN @SHDD=N''سه شنبه'' THEN 4
			WHEN @SHDD=N''چهارشنبه'' THEN 5
			WHEN @SHDD=N''پنجشنبه'' THEN 6
			WHEN @SHDD=N''جمعه'' THEN 7
		END

	IF @MM=10 AND @DD>10 SET @YYDD += 276
	IF @MM>10 SET @YYDD += 276

	SET @SHDATE =
	 REPLACE(
	 REPLACE(
	 REPLACE(
	 REPLACE(
	 REPLACE(
	 REPLACE(
	 REPLACE(
	 REPLACE(
	 REPLACE(
	 REPLACE(
	 REPLACE(@Format,''MaahHarfi'',@SHMM),''SaalRooz'',LTRIM(STR(@YYDD,3))),''ChandShanbeAdadi'',@DDCNT),''ChandShanbe'',
			 @SHDD),''Rooz2'',REPLACE(STR(@DD,2), '' '', ''0'')),''Maah2'',REPLACE(STR(@MM, 2), '' '', ''0'')),''Saal2'',
			 SUBSTRING(STR(@YY,4),3,2)),''Saal4'',STR(@YY,4)),''Saal'',LTRIM(STR(@YY,4))),''Maah'',
			 LTRIM(STR(@MM,2))),''Rooz'',LTRIM(STR(@DD,2)))
	
	RETURN @SHDATE
	END')

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-PersianDates-v2', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-PersianDates-v3' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN
	
	EXEC('CREATE PROCEDURE PopulatePersianDate @startDate date, @endDate date
	AS
	BEGIN
	
	IF(@endDate < @startDate)
		RETURN

	DECLARE @date date;
	SET @date = @startDate

	WHILE @date <= @endDate
	BEGIN


	INSERT INTO PersianDates 
	(
		GregorianDate
		,WeekDayName
		,WeekDayNumber
		,DayInMonth
		,DayInMonthAtLeastTwo
		,MonthNumber
		,MonthNumberAtLeastTwo
		,PersianMonthName
		,YearNumber
		,DayInYearNumber
		,YearMonthDay
		,YearMonth
		,DayNameInMonth
		,DayNameInYear

	)
	SELECT 	 @date
			,dbo.SDAT(@date, ''ChandShanbe'')
			,Convert(tinyint, dbo.SDAT(@date, ''ChandShanbeAdadi''))
			,Convert(tinyint, dbo.SDAT(@date, ''Rooz''))
			,Convert(varchar(2), dbo.SDAT(@date, ''Rooz2''))
			,Convert(tinyint, dbo.SDAT(@date, ''Maah''))
			,Convert(varchar(2), dbo.SDAT(@date, ''Maah2''))
			,Convert(nvarchar(15), dbo.SDAT(@date, ''MaahHarfi''))
			,Convert(smallint, dbo.SDAT(@date, ''Saal4''))
			,Convert(smallint, dbo.SDAT(@date, ''SaalRooz''))
			,dbo.SDAT(@date,''Saal4/Maah2/Rooz2'')
			,Convert(varchar(7), dbo.SDAT(@date, ''Saal4/Maah2''))
			, dbo.SDAT(@date, ''ChandShanbe Rooz MaahHarfi'')
			, dbo.SDAT(@date, ''ChandShanbe Rooz MaahHarfi Saal4'')


		SET @date = DATEADD(DAY, 1, @date)
		END
	END')

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-PersianDates-v3', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-PersianDates-v4' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN
	
	exec PopulatePersianDate '2023-03-20', '2043-03-25'

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-PersianDates-v4', GETDATE(), GETDATE()
END

GO


-- takhfif coffe


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


-- data takhfif
-- buffetType
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-buffetType-Data-v1' 
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

	INSERT INTO DiscountCoffeBuffetTypes (id, title, createdAt, updatedAt)
	VALUES (1, N'کافه', getdate(), getdate())
			,(2, N'رستوران', getdate(), getdate())
		

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-buffetType-Data-v1', GETDATE(), GETDATE()
END

GO

-- buffetcost
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-buffetCost-Data-v1' 
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

	INSERT INTO DiscountCoffeBuffetCosts (id, title, createdAt, updatedAt)
	VALUES (1, N'ارزان', getdate(), getdate())
			,(2, N'اقتصادی', getdate(), getdate())
			,(3, N'لاکچری', getdate(), getdate())

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-buffetCost-Data-v1', GETDATE(), GETDATE()
END

GO

--buffetcity
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-buffetCity-Data-v1' 
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

	INSERT INTO DiscountCoffeCities(id, title, createdAt, updatedAt)
	VALUES 
		(1,N'منطقه 1 - اراج', getdate(), getdate())
		,(2,N'منطقه 1 - ازگل', getdate(), getdate())
		,(3,N'منطقه 1 - امامزاده قاسم', getdate(), getdate())
		,(4,N'منطقه 1 - اوین', getdate(), getdate())
		,(5,N'منطقه 1 - باغ فردوس', getdate(), getdate())
		,(6,N'منطقه 1 - تجریش', getdate(), getdate())
		,(7,N'منطقه 1 - جماران', getdate(), getdate())
		,(8,N'منطقه 1 - چیذر', getdate(), getdate())
		,(9,N'منطقه 1 - حصار بوعلی', getdate(), getdate())
		,(10,N'منطقه 1 - حکمت و دزاشیب', getdate(), getdate())
		,(11,N'منطقه 1 - دارآباد', getdate(), getdate())
		,(12,N'منطقه 1 - دربند', getdate(), getdate())
		,(13,N'منطقه 1 - درکه', getdate(), getdate())
		,(14,N'منطقه 1 - دزاشیب و جوزستان', getdate(), getdate())
		,(15,N'منطقه 1 - رستم آباد', getdate(), getdate())
		,(16,N'منطقه 1 - زعفرانیه', getdate(), getdate())
		,(17,N'منطقه 1 - سوهانک', getdate(), getdate())
		,(18,N'منطقه 1 - شهرک گلها', getdate(), getdate())
		,(19,N'منطقه 1 - شهرک محلاتی', getdate(), getdate())
		,(20,N'منطقه 1 - شهرک نفت', getdate(), getdate())
		,(21,N'منطقه 1 - قیطریه', getdate(), getdate())
		,(22,N'منطقه 1 - کاشانک', getdate(), getdate())
		,(23,N'منطقه 1 - گلاب دره', getdate(), getdate())
		,(24,N'منطقه 1 - محمودیه', getdate(), getdate())
		,(25,N'منطقه 1 - نیاوران', getdate(), getdate())
		,(26,N'منطقه 1 - ولنجک', getdate(), getdate())
		,(27,N'منطقه 2 - آلستوم', getdate(), getdate())
		,(28,N'منطقه 2 - اسلام آباد', getdate(), getdate())
		,(29,N'منطقه 2 - ایوانک', getdate(), getdate())
		,(30,N'منطقه 2 - پاتریس', getdate(), getdate())
		,(31,N'منطقه 2 - پردیسان', getdate(), getdate())
		,(32,N'منطقه 2 - پرواز', getdate(), getdate())
		,(33,N'منطقه 2 - پونک', getdate(), getdate())
		,(34,N'منطقه 2 - توحید', getdate(), getdate())
		,(35,N'منطقه 2 - تهران ویلا', getdate(), getdate())
		,(36,N'منطقه 2 - چوب تراش', getdate(), getdate())
		,(37,N'منطقه 2 - خرم رودی', getdate(), getdate())
		,(38,N'منطقه 2 - درختی', getdate(), getdate())
		,(39,N'منطقه 2 - دریا', getdate(), getdate())
		,(40,N'منطقه 2 - زنجان', getdate(), getdate())
		,(41,N'منطقه 2 - سپهر', getdate(), getdate())
		,(42,N'منطقه 2 - سرو', getdate(), getdate())
		,(43,N'منطقه 2 - سعادت آباد', getdate(), getdate())
		,(44,N'منطقه 2 - شادمهر', getdate(), getdate())
		,(45,N'منطقه 2 - شهرک آزمایش', getdate(), getdate())
		,(46,N'منطقه 2 - شهرک بوعلی', getdate(), getdate())
		,(47,N'منطقه 2 - شهرک غرب', getdate(), getdate())
		,(48,N'منطقه 2 - شهرک مخابرات', getdate(), getdate())
		,(49,N'منطقه 2 - شهرک هما', getdate(), getdate())
		,(50,N'منطقه 2 - صادقیه', getdate(), getdate())
		,(51,N'منطقه 2 - طرشت', getdate(), getdate())
		,(52,N'منطقه 2 - فرحزاد', getdate(), getdate())
		,(53,N'منطقه 2 - کوهسار', getdate(), getdate())
		,(54,N'منطقه 2 - کوی نصر', getdate(), getdate())
		,(55,N'منطقه 2 - مدیریت', getdate(), getdate())
		,(56,N'منطقه 2 - همایون شهر', getdate(), getdate())
		,(57,N'منطقه 3 - آرارات', getdate(), getdate())
		,(58,N'منطقه 3 - ارسباران', getdate(), getdate())
		,(59,N'منطقه 3 - امانیه', getdate(), getdate())
		,(60,N'منطقه 3 - حسن آباد-زرگنده', getdate(), getdate())
		,(61,N'منطقه 3 - داودیه', getdate(), getdate())
		,(62,N'منطقه 3 - درب دوم', getdate(), getdate())
		,(63,N'منطقه 3 - دروس', getdate(), getdate())
		,(64,N'منطقه 3 - رستم آباد - اختیاریه', getdate(), getdate())
		,(65,N'منطقه 3 - قبا', getdate(), getdate())
		,(66,N'منطقه 3 - قلهک', getdate(), getdate())
		,(67,N'منطقه 3 - کاووسیه', getdate(), getdate())
		,(68,N'منطقه 3 - ونک', getdate(), getdate())
		,(69,N'منطقه 4 - اوقاف', getdate(), getdate())
		,(70,N'منطقه 4 - تهران پارس شرقی', getdate(), getdate())
		,(71,N'منطقه 4 - تهران پارس غربی', getdate(), getdate())
		,(72,N'منطقه 4 - جوادیه', getdate(), getdate())
		,(73,N'منطقه 4 - حکیمیه', getdate(), getdate())
		,(74,N'منطقه 4 - خاک سفید', getdate(), getdate())
		,(75,N'منطقه 4 - شمس آباد و مجیدیه', getdate(), getdate())
		,(76,N'منطقه 4 - شمیرا نو', getdate(), getdate())
		,(77,N'منطقه 4 - شهرک ولیعصر و شیان و لویزان', getdate(), getdate())
		,(78,N'منطقه 4 - ضرابخانه و پاسداران', getdate(), getdate())
		,(79,N'منطقه 4 - علم و صنعت', getdate(), getdate())
		,(80,N'منطقه 4 - قاسم آباد و ده نارمک', getdate(), getdate())
		,(81,N'منطقه 4 - قنات کوثر', getdate(), getdate())
		,(82,N'منطقه 4 - کاظم آباد', getdate(), getdate())
		,(83,N'منطقه 4 - کالاد', getdate(), getdate())
		,(84,N'منطقه 4 - کوهسار', getdate(), getdate())
		,(85,N'منطقه 4 - مبارک آباد و حسین آباد', getdate(), getdate())
		,(86,N'منطقه 4 - مجید آباد', getdate(), getdate())
		,(87,N'منطقه 4 - مهران', getdate(), getdate())
		,(88,N'منطقه 4 - نارمک', getdate(), getdate())
		,(89,N'منطقه 5 - المهدی', getdate(), getdate())
		,(90,N'منطقه 5 - اندیشه', getdate(), getdate())
		,(91,N'منطقه 5 - باغ فیض', getdate(), getdate())
		,(92,N'منطقه 5 - بهاران', getdate(), getdate())
		,(93,N'منطقه 5 - پرواز', getdate(), getdate())
		,(94,N'منطقه 5 - پونک جنوبی', getdate(), getdate())
		,(95,N'منطقه 5 - پونک شمالی', getdate(), getdate())
		,(96,N'منطقه 5 - جنت آباد جنوبی', getdate(), getdate())
		,(97,N'منطقه 5 - جنت آباد شمالی', getdate(), getdate())
		,(98,N'منطقه 5 - جنت آباد مرکزی', getdate(), getdate())
		,(99,N'منطقه 5 - حصارک', getdate(), getdate())
		,(100,N'منطقه 5 - سازمان آب', getdate(), getdate())
		,(101,N'منطقه 5 - سازمان برنامه جنوبی', getdate(), getdate())
		,(102,N'منطقه 5 - سازمان برنامه شمالی', getdate(), getdate())
		,(103,N'منطقه 5 - شاهین', getdate(), getdate())
		,(104,N'منطقه 5 - شهر زیبا', getdate(), getdate())
		,(105,N'منطقه 5 - شهران جنوبی', getdate(), getdate())
		,(106,N'منطقه 5 - شهران شمالی', getdate(), getdate())
		,(107,N'منطقه 5 - شهرک آپادانا', getdate(), getdate())
		,(108,N'منطقه 5 - شهرک اکباتان', getdate(), getdate())
		,(109,N'منطقه 5 - شهرک کوهسار', getdate(), getdate())
		,(110,N'منطقه 5 - کن', getdate(), getdate())
		,(111,N'منطقه 5 - کوی ارم', getdate(), getdate())
		,(112,N'منطقه 5 - کوی بیمه', getdate(), getdate())
		,(113,N'منطقه 5 - محله ابوذر', getdate(), getdate())
		,(114,N'منطقه 5 - محله فردوس', getdate(), getdate())
		,(115,N'منطقه 5 - مراد آباد', getdate(), getdate())
		,(116,N'منطقه 5 - مهران', getdate(), getdate())
		,(117,N'منطقه 5 - نفت', getdate(), getdate())
		,(118,N'منطقه 6 - آرژانتین - ساعی', getdate(), getdate())
		,(119,N'منطقه 6 - ایرانشهر', getdate(), getdate())
		,(120,N'منطقه 6 - بهجت آباد', getdate(), getdate())
		,(121,N'منطقه 6 - پارک لاله', getdate(), getdate())
		,(122,N'منطقه 6 - جنت - رفتگر', getdate(), getdate())
		,(123,N'منطقه 6 - دانشگاه تهران', getdate(), getdate())
		,(124,N'منطقه 6 - شریعتی', getdate(), getdate())
		,(125,N'منطقه 6 - شیراز', getdate(), getdate())
		,(126,N'منطقه 6 - عباس آباد', getdate(), getdate())
		,(127,N'منطقه 6 - فاطمی', getdate(), getdate())
		,(128,N'منطقه 6 - قانم مقام- سنائی', getdate(), getdate())
		,(129,N'منطقه 6 - قزل قلعه', getdate(), getdate())
		,(130,N'منطقه 6 - کشاورز غربی', getdate(), getdate())
		,(131,N'منطقه 6 - گاندی', getdate(), getdate())
		,(132,N'منطقه 6 - میدان جهاد', getdate(), getdate())
		,(133,N'منطقه 6 - میدان ولیعصر', getdate(), getdate())
		,(134,N'منطقه 6 - نصرت', getdate(), getdate())
		,(135,N'منطقه 6 - یوسف آباد- امیرآباد', getdate(), getdate())
		,(136,N'منطقه 7 - ارامنه جنوبی', getdate(), getdate())
		,(137,N'منطقه 7 - ارامنه شمالی', getdate(), getdate())
		,(138,N'منطقه 7 - امجدیه- خاقانی', getdate(), getdate())
		,(139,N'منطقه 7 - باغ صبا - سهروردی', getdate(), getdate())
		,(140,N'منطقه 7 - بهار', getdate(), getdate())
		,(141,N'منطقه 7 - حشمتیه', getdate(), getdate())
		,(142,N'منطقه 7 - خواجه نصیر -حقوقی', getdate(), getdate())
		,(143,N'منطقه 7 - خواجه نظام شرقی', getdate(), getdate())
		,(144,N'منطقه 7 - خواجه نظام غربی', getdate(), getdate())
		,(145,N'منطقه 7 - دبستان - مجیدیه', getdate(), getdate())
		,(146,N'منطقه 7 - دهقان', getdate(), getdate())
		,(147,N'منطقه 7 - شارق شرقی', getdate(), getdate())
		,(148,N'منطقه 7 - شارق غربی', getdate(), getdate())
		,(149,N'منطقه 7 - عباس آباد-اندیشه-شهید قندی', getdate(), getdate())
		,(150,N'منطقه 7 - قصر', getdate(), getdate())
		,(151,N'منطقه 7 - کاج', getdate(), getdate())
		,(152,N'منطقه 7 - گرگان', getdate(), getdate())
		,(153,N'منطقه 7 - نظام آباد', getdate(), getdate())
		,(154,N'منطقه 7 - نیلوفر - شهید قندی', getdate(), getdate())
		,(155,N'منطقه 8 - تسلیحات', getdate(), getdate())
		,(156,N'منطقه 8 - تهران پارس', getdate(), getdate())
		,(157,N'منطقه 8 - دردشت', getdate(), getdate())
		,(158,N'منطقه 8 - زرکش', getdate(), getdate())
		,(159,N'منطقه 8 - فدک', getdate(), getdate())
		,(160,N'منطقه 8 - کرمان', getdate(), getdate())
		,(161,N'منطقه 8 - لشکر شرقی', getdate(), getdate())
		,(162,N'منطقه 8 - لشکر غربی', getdate(), getdate())
		,(163,N'منطقه 8 - مجدیه', getdate(), getdate())
		,(164,N'منطقه 8 - مدائن', getdate(), getdate())
		,(165,N'منطقه 8 - نارمک جنوبی', getdate(), getdate())
		,(166,N'منطقه 8 - وحیدیه', getdate(), getdate())
		,(167,N'منطقه 8 - هفت حوض', getdate(), getdate())
		,(168,N'منطقه 9 - استاد معین', getdate(), getdate())
		,(169,N'منطقه 9 - امامزاده عبدالله', getdate(), getdate())
		,(170,N'منطقه 9 - دکترهوشیار', getdate(), getdate())
		,(171,N'منطقه 9 - سرآسیاب مهرآباد', getdate(), getdate())
		,(172,N'منطقه 9 - شمشیری', getdate(), getdate())
		,(173,N'منطقه 9 - شهید دستغیب', getdate(), getdate())
		,(174,N'منطقه 9 - فتح', getdate(), getdate())
		,(175,N'منطقه 9 - فرودگاه', getdate(), getdate())
		,(176,N'منطقه 9 - مهرآباد جنوبی', getdate(), getdate())
		,(177,N'منطقه 10 - بریانک', getdate(), getdate())
		,(178,N'منطقه 10 - زنجان جنوبی', getdate(), getdate())
		,(179,N'منطقه 10 - سرسبیل جنوبی', getdate(), getdate())
		,(180,N'منطقه 10 - سرسبیل شمالی', getdate(), getdate())
		,(181,N'منطقه 10 - سلیمانی- تیموری', getdate(), getdate())
		,(182,N'منطقه 10 - شبیری-جی', getdate(), getdate())
		,(183,N'منطقه 10 - کارون جنوبی', getdate(), getdate())
		,(184,N'منطقه 10 - کارون شمالی', getdate(), getdate())
		,(185,N'منطقه 10 - هاشمی', getdate(), getdate())
		,(186,N'منطقه 10 - هفت چنار', getdate(), getdate())
		,(187,N'منطقه 11 - آذربایجان', getdate(), getdate())
		,(188,N'منطقه 11 - آگاهی', getdate(), getdate())
		,(189,N'منطقه 11 - اسکندری', getdate(), getdate())
		,(190,N'منطقه 11 - امیریه', getdate(), getdate())
		,(191,N'منطقه 11 - انبار نفت', getdate(), getdate())
		,(192,N'منطقه 11 - باغ شاه-میدان حر', getdate(), getdate())
		,(193,N'منطقه 11 - جمالزاده-حشمت الدوله', getdate(), getdate())
		,(194,N'منطقه 11 - جمهوری', getdate(), getdate())
		,(195,N'منطقه 11 - خرم شهر', getdate(), getdate())
		,(196,N'منطقه 11 - راه آهن', getdate(), getdate())
		,(197,N'منطقه 11 - شیخ هادی', getdate(), getdate())
		,(198,N'منطقه 11 - عباسی', getdate(), getdate())
		,(199,N'منطقه 11 - فروزش-امیر بهادر', getdate(), getdate())
		,(200,N'منطقه 11 - فلسطین', getdate(), getdate())
		,(201,N'منطقه 11 - قلمستان-برادران جوادیان', getdate(), getdate())
		,(202,N'منطقه 11 - مخصوص', getdate(), getdate())
		,(203,N'منطقه 11 - منیریه', getdate(), getdate())
		,(204,N'منطقه 11 - هلال احمر', getdate(), getdate())
		,(205,N'منطقه 12 - آبشار', getdate(), getdate())
		,(206,N'منطقه 12 - ارگ - پامنار', getdate(), getdate())
		,(207,N'منطقه 12 - امامزاده یحیی', getdate(), getdate())
		,(208,N'منطقه 12 - ایران', getdate(), getdate())
		,(209,N'منطقه 12 - بازار', getdate(), getdate())
		,(210,N'منطقه 12 - بهارستان', getdate(), getdate())
		,(211,N'منطقه 12 - تختي', getdate(), getdate())
		,(212,N'منطقه 12 - دروازه شمیران', getdate(), getdate())
		,(213,N'منطقه 12 - سنگلج', getdate(), getdate())
		,(214,N'منطقه 12 - شهید هرندی', getdate(), getdate())
		,(215,N'منطقه 12 - فردوسی', getdate(), getdate())
		,(216,N'منطقه 12 - قیام', getdate(), getdate())
		,(217,N'منطقه 12 - کوثر', getdate(), getdate())
		,(218,N'منطقه 13 - آشتیانی', getdate(), getdate())
		,(219,N'منطقه 13 - امامت', getdate(), getdate())
		,(220,N'منطقه 13 - حافظ', getdate(), getdate())
		,(221,N'منطقه 13 - حافظیه', getdate(), getdate())
		,(222,N'منطقه 13 - دهقان', getdate(), getdate())
		,(223,N'منطقه 13 - زاهد گیلانی', getdate(), getdate())
		,(224,N'منطقه 13 - زینبیه', getdate(), getdate())
		,(225,N'منطقه 13 - سرخه حصار', getdate(), getdate())
		,(226,N'منطقه 13 - شورا', getdate(), getdate())
		,(227,N'منطقه 13 - شهید اسدی', getdate(), getdate())
		,(228,N'منطقه 13 - صفا', getdate(), getdate())
		,(229,N'منطقه 13 - قاسم آباد', getdate(), getdate())
		,(230,N'منطقه 13 - نیروی هوایی', getdate(), getdate())
		,(231,N'منطقه 14 - آهنگ', getdate(), getdate())
		,(232,N'منطقه 14 - آهنگران', getdate(), getdate())
		,(233,N'منطقه 14 - ابوذر', getdate(), getdate())
		,(234,N'منطقه 14 - بروجردی', getdate(), getdate())
		,(235,N'منطقه 14 - پرستار', getdate(), getdate())
		,(236,N'منطقه 14 - تاکسیرانی', getdate(), getdate())
		,(237,N'منطقه 14 - جابری', getdate(), getdate())
		,(238,N'منطقه 14 - جوادیه', getdate(), getdate())
		,(239,N'منطقه 14 - چهارصددستگاه', getdate(), getdate())
		,(240,N'منطقه 14 - خاوران', getdate(), getdate())
		,(241,N'منطقه 14 - دژکام', getdate(), getdate())
		,(242,N'منطقه 14 - دولاب', getdate(), getdate())
		,(243,N'منطقه 14 - سیزده آبان', getdate(), getdate())
		,(244,N'منطقه 14 - شاهین', getdate(), getdate())
		,(245,N'منطقه 14 - شکوفه', getdate(), getdate())
		,(246,N'منطقه 14 - شکیب', getdate(), getdate())
		,(247,N'منطقه 14 - شهرابی', getdate(), getdate())
		,(248,N'منطقه 14 - شیوا', getdate(), getdate())
		,(249,N'منطقه 14 - صددستگاه', getdate(), getdate())
		,(250,N'منطقه 14 - فرزانه', getdate(), getdate())
		,(251,N'منطقه 14 - قصر فیروزه', getdate(), getdate())
		,(252,N'منطقه 14 - مینای جنوبی', getdate(), getdate())
		,(253,N'منطقه 14 - مینای شمالی', getdate(), getdate())
		,(254,N'منطقه 14 - نبی اکرم', getdate(), getdate())
		,(255,N'منطقه 14 - نیکنام', getdate(), getdate())
		,(256,N'منطقه 15 - ابوذر', getdate(), getdate())
		,(257,N'منطقه 15 - اتابک', getdate(), getdate())
		,(258,N'منطقه 15 - اسلام آباد - ولفجر', getdate(), getdate())
		,(259,N'منطقه 15 - افسریه بالا', getdate(), getdate())
		,(260,N'منطقه 15 - افسریه پایین', getdate(), getdate())
		,(261,N'منطقه 15 - دهقان', getdate(), getdate())
		,(262,N'منطقه 15 - شوش', getdate(), getdate())
		,(263,N'منطقه 15 - شهرک رضویه', getdate(), getdate())
		,(264,N'منطقه 15 - طیب', getdate(), getdate())
		,(265,N'منطقه 15 - کیان شهر بالا', getdate(), getdate())
		,(266,N'منطقه 15 - کیان شهر پایین', getdate(), getdate())
		,(267,N'منطقه 15 - مسعودیه', getdate(), getdate())
		,(268,N'منطقه 15 - مشیریه', getdate(), getdate())
		,(269,N'منطقه 15 - مطهری', getdate(), getdate())
		,(270,N'منطقه 15 - مظاهری', getdate(), getdate())
		,(271,N'منطقه 15 - مینایی', getdate(), getdate())
		,(272,N'منطقه 15 - ولیعصر', getdate(), getdate())
		,(273,N'منطقه 15 - هاشم آباد', getdate(), getdate())
		,(274,N'منطقه 16 - باغ آذری', getdate(), getdate())
		,(275,N'منطقه 16 - تختي', getdate(), getdate())
		,(276,N'منطقه 16 - جوادیه', getdate(), getdate())
		,(277,N'منطقه 16 - خزانه', getdate(), getdate())
		,(278,N'منطقه 16 - شهرک بعثت', getdate(), getdate())
		,(279,N'منطقه 16 - علی آباد جنوبی', getdate(), getdate())
		,(280,N'منطقه 16 - علی آباد شمالی', getdate(), getdate())
		,(281,N'منطقه 16 - نازی آباد', getdate(), getdate())
		,(282,N'منطقه 16 - یاخچی آباد(رضوان)', getdate(), getdate())
		,(283,N'منطقه 17 - آذری', getdate(), getdate())
		,(284,N'منطقه 17 - امام زاده حسن', getdate(), getdate())
		,(285,N'منطقه 17 - باغ خزانه', getdate(), getdate())
		,(286,N'منطقه 17 - بلورسازی', getdate(), getdate())
		,(287,N'منطقه 17 - جلیلی', getdate(), getdate())
		,(288,N'منطقه 17 - زمزم', getdate(), getdate())
		,(289,N'منطقه 17 - زهتابی', getdate(), getdate())
		,(290,N'منطقه 17 - فلاح', getdate(), getdate())
		,(291,N'منطقه 17 - گلچین', getdate(), getdate())
		,(292,N'منطقه 17 - مقدم', getdate(), getdate())
		,(293,N'منطقه 17 - وصفنارد', getdate(), getdate())
		,(294,N'منطقه 17 - یافت آباد', getdate(), getdate())
		,(295,N'منطقه 18 - بهداشت', getdate(), getdate())
		,(296,N'منطقه 18 - تولید دارو', getdate(), getdate())
		,(297,N'منطقه 18 - حسینی -فردوس', getdate(), getdate())
		,(298,N'منطقه 18 - خلیج فارس جنوبی', getdate(), getdate())
		,(299,N'منطقه 18 - خلیج فارس شمالی', getdate(), getdate())
		,(300,N'منطقه 18 - شاد آباد', getdate(), getdate())
		,(301,N'منطقه 18 - شمس آباد', getdate(), getdate())
		,(302,N'منطقه 18 - شهرک امام خمینی', getdate(), getdate())
		,(303,N'منطقه 18 - شهید رجائی', getdate(), getdate())
		,(304,N'منطقه 18 - صاحب الزمان', getdate(), getdate())
		,(305,N'منطقه 18 - صادقيه', getdate(), getdate())
		,(306,N'منطقه 18 - ولیعصر جنوبی', getdate(), getdate())
		,(307,N'منطقه 18 - ولیعصر شمالی', getdate(), getdate())
		,(308,N'منطقه 18 - هفده شهریور', getdate(), getdate())
		,(309,N'منطقه 18 - یافت آباد جنوبی', getdate(), getdate())
		,(310,N'منطقه 18 - یافت آباد شمالی', getdate(), getdate())
		,(311,N'منطقه 19 - اسفندیاری وبستان', getdate(), getdate())
		,(312,N'منطقه 19 - اسماعیل آباد', getdate(), getdate())
		,(313,N'منطقه 19 - بهمنیار', getdate(), getdate())
		,(314,N'منطقه 19 - خانی آباد نو جنوبی', getdate(), getdate())
		,(315,N'منطقه 19 - خانی آباد نو شمالی', getdate(), getdate())
		,(316,N'منطقه 19 - دولت خواه', getdate(), getdate())
		,(317,N'منطقه 19 - شریعتی جنوبی', getdate(), getdate())
		,(318,N'منطقه 19 - شریعتی شمالی', getdate(), getdate())
		,(319,N'منطقه 19 - شکوفه جنوبی', getdate(), getdate())
		,(320,N'منطقه 19 - شکوفه شمالی', getdate(), getdate())
		,(321,N'منطقه 19 - شهرک احمد خمینی', getdate(), getdate())
		,(322,N'منطقه 19 - شهرک رسالت', getdate(), getdate())
		,(323,N'منطقه 19 - شهید کاظمی', getdate(), getdate())
		,(324,N'منطقه 19 - عبدل آباد', getdate(), getdate())
		,(325,N'منطقه 19 - علی آباد', getdate(), getdate())
		,(326,N'منطقه 19 - قلعه مرغی', getdate(), getdate())
		,(327,N'منطقه 19 - نعمت آباد', getdate(), getdate())
		,(328,N'منطقه 20 - استخر', getdate(), getdate())
		,(329,N'منطقه 20 - اقدسیه', getdate(), getdate())
		,(330,N'منطقه 20 - باروت کوبی', getdate(), getdate())
		,(331,N'منطقه 20 - تقی آبد', getdate(), getdate())
		,(332,N'منطقه 20 - جوانمرد قصاب', getdate(), getdate())
		,(333,N'منطقه 20 - حمزه آباد', getdate(), getdate())
		,(334,N'منطقه 20 - دولت آباد', getdate(), getdate())
		,(335,N'منطقه 20 - دیلمان', getdate(), getdate())
		,(336,N'منطقه 20 - سرتخت', getdate(), getdate())
		,(337,N'منطقه 20 - سیزده آبان', getdate(), getdate())
		,(338,N'منطقه 20 - شهادت', getdate(), getdate())
		,(339,N'منطقه 20 - شهید بهشتی', getdate(), getdate())
		,(340,N'منطقه 20 - شهید غیوری-ابن بابویه', getdate(), getdate())
		,(341,N'منطقه 20 - صفاییه', getdate(), getdate())
		,(342,N'منطقه 20 - ظهیر آباد و ابن بابویه', getdate(), getdate())
		,(343,N'منطقه 20 - علایین', getdate(), getdate())
		,(344,N'منطقه 20 - عیاس آباد', getdate(), getdate())
		,(345,N'منطقه 20 - فیروز آبادی', getdate(), getdate())
		,(346,N'منطقه 20 - منصوریه منگل', getdate(), getdate())
		,(347,N'منطقه 20 - ولی آباد', getdate(), getdate())
		,(348,N'منطقه 20 - هاشم آباد', getdate(), getdate())
		,(349,N'منطقه 21 - باشگاه نفت', getdate(), getdate())
		,(350,N'منطقه 21 - تهرانسر شرقی', getdate(), getdate())
		,(351,N'منطقه 21 - تهرانسر شمالی', getdate(), getdate())
		,(352,N'منطقه 21 - تهرانسر غربی', getdate(), getdate())
		,(353,N'منطقه 21 - تهرانسر مرکزی', getdate(), getdate())
		,(354,N'منطقه 21 - چیتگر جنوبی', getdate(), getdate())
		,(355,N'منطقه 21 - چیتگر شمالی', getdate(), getdate())
		,(356,N'منطقه 21 - شهرک آزادی', getdate(), getdate())
		,(357,N'منطقه 21 - شهرک استقلال', getdate(), getdate())
		,(358,N'منطقه 21 - شهرک پاسداران', getdate(), getdate())
		,(359,N'منطقه 21 - شهرک دانشگاه تهران', getdate(), getdate())
		,(360,N'منطقه 21 - شهرک دریا', getdate(), getdate())
		,(361,N'منطقه 21 - شهرک شهرداری', getdate(), getdate())
		,(362,N'منطقه 21 - شهرک غزالی', getdate(), getdate())
		,(363,N'منطقه 21 - شهرک فرهنگیان', getdate(), getdate())
		,(364,N'منطقه 21 - ورداورد', getdate(), getdate())
		,(365,N'منطقه 21 - ویلا شهر', getdate(), getdate())
		,(366,N'منطقه 22 - آبشار تهران', getdate(), getdate())
		,(367,N'منطقه 22 - پژوهش شمالي', getdate(), getdate())
		,(368,N'منطقه 22 - چيتگر - آزاد شهر', getdate(), getdate())
		,(369,N'منطقه 22 - دهکده المپيک', getdate(), getdate())
		,(370,N'منطقه 22 - زيبادشت', getdate(), getdate())
		,(371,N'منطقه 22 - شهرک شهيد خرازي', getdate(), getdate())
		,(372,N'منطقه 22 - شهرک صدرا', getdate(), getdate())
		,(373,N'منطقه 22 - گلستان شرقي', getdate(), getdate())
		,(374,N'منطقه 22 - گلستان غربي', getdate(), getdate())
	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-buffetCity-Data-v1', GETDATE(), GETDATE()
END

GO


-- reserve status
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-reservestatus-Data-v1' 
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

	INSERT INTO DiscountCoffeReserveStatuses(id, title, createdAt, updatedAt)
	VALUES (1, N'نهایی نشده', getdate(), getdate())
			,(2, N'نهایی شده', getdate(), getdate())

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-reservestatus-Data-v1', GETDATE(), GETDATE()
END

GO

-- reserve types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-reservetypes-Data-v1' 
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

	INSERT INTO DiscountCoffeReserveTypes(id, title, createdAt, updatedAt)
	VALUES (1, N'منو آنلاین', getdate(), getdate())
			,(2, N'منو از طریق کافه', getdate(), getdate())

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-reservetypes-Data-v1', GETDATE(), GETDATE()
END

GO



GO
-- tiarara

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'PCMPeriodTypes-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
BEGIN

	CREATE TABLE PCMPeriodTypes (
		id							int						PRIMARY KEY,
		periodTypeName				nvarchar(256)			NOT NULL,
		[createdAt]					datetimeoffset			NOT NULL,
		[updatedAt]					datetimeoffset			NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'PCMPeriodTypes-v1', GETDATE(), GETDATE()
END

GO

-- periods
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'PCMPeriods-v1' )
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
BEGIN

	CREATE TABLE PCMPeriods (
		id							bigint identity(1,1)	NOT NULL,
		periodTypeId				int						NOT NULL
			CONSTRAINT FK_PCMPeriods_PeriodTypeId
				FOREIGN KEY REFERENCES PCMPeriodTypes(id),
		startDate					date					NOT NULL,
		endDate						date					NOT NULL,
		endDateOffset				date					NOT NULL,
		[createdAt]					datetimeoffset			NOT NULL,
		[updatedAt]					datetimeoffset			NOT NULL,
		PRIMARY KEY(periodTypeId, startDate, endDate)
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'PCMPeriods-v1', GETDATE(), GETDATE()
END

GO

-- ages
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'PCMAges-v1' )
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
BEGIN


	CREATE TABLE PCMAges
	(
		id						int	identity(1,1)					PRIMARY KEY,
		ageName					nvarchar(256)						NOT NULL,
		[minAge]				int									NULL,
		[maxAge]				int									NULL,
		[createdAt]				datetimeoffset						NOT NULL,
		[updatedAt]				datetimeoffset						NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'PCMAges-v1', GETDATE(), GETDATE()
END

GO

-- publishes
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'PCMPublishes-v1' )
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
BEGIN


	CREATE TABLE PCMPublishes
	(
		id						int									PRIMARY KEY,
		publishName				nvarchar(256)						NOT NULL,
		[createdAt]				datetimeoffset						NOT NULL,
		[updatedAt]				datetimeoffset						NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'PCMPublishes-v1', GETDATE(), GETDATE()
END

GO

-- article types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'PCMArticleTypes-v1' )
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
BEGIN


	CREATE TABLE PCMArticleTypes
	(
		id						int									PRIMARY KEY,
		typeName				nvarchar(256)						NOT NULL,
		[createdAt]				datetimeoffset						NOT NULL,
		[updatedAt]				datetimeoffset						NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'PCMArticleTypes-v1', GETDATE(), GETDATE()
END

GO

-- article
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'PCMArticles-v1' )
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
BEGIN


	CREATE TABLE PCMArticles
	(
		id						bigint identity(1,1)					PRIMARY KEY,
		title					nvarchar(512)							NULL,
		userId					bigint									NOT NULL
			CONSTRAINT FK_TiyaraArticles_UserId
				FOREIGN KEY REFERENCES Users(id),
		ageId					int										NOT NULL
			CONSTRAINT FK_PCMArticles_AgeId
				FOREIGN KEY REFERENCES PCMAges(id),
		publishId				int										NOT NULL
			CONSTRAINT FK_PCMArticles_PublishId
				FOREIGN KEY REFERENCES PCMPublishes(id),
		publishDate				datetime								NULL,
		publishUserId			bigint									NULL
			CONSTRAINT FK_PCMArticles_PublishUserId
				FOREIGN KEY REFERENCES Users(id),
		articleTypeId			int										NOT NULL
			CONSTRAINT FK_PCMArticles_ArticleTypeId
				FOREIGN KEY REFERENCES PCMArticleTypes(id),
		[isDeleted]				bit										NULL,
		[deletedBy]				bigint									NULL
			CONSTRAINT FK_PCMArticles_DeletedBy
				FOREIGN KEY REFERENCES Users(id),
		[createdAt]				datetimeoffset						NOT NULL,
		[updatedAt]				datetimeoffset						NOT NULL
	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'PCMArticles-v1', GETDATE(), GETDATE()
END

GO



-- Datas

-- super admin
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Users-Data-v1' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN
	
	INSERT INTO Users
	(
		
		firstname
		,lastname
		,email
		,username
		,[password]
		,phoneNumber
		,mustChangePassword
		,lastPasswordChangeDate
		,static_id
		,createdAt
		,updatedAt
	) 
	SELECT N'bahram', N'rajabi', null, 'super-admin', '$2b$10$dfyoOL/K4XRHmhR.8qgNXuBUeMY7Hivd4XoUsqg418SkhFXfWib6q', '09213972466', 0, getdate(), 1, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Users-Data-v1', GETDATE(), GETDATE()
END

GO


-- super admin
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Roles-Data-v1' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN
	
	INSERT INTO Roles
	(
		roleName
		,static_id
		,createdAt
		,updatedAt
	) 
	SELECT N'super-admin', 1, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Roles-Data-v1', GETDATE(), GETDATE()
END

GO


-- super admin
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Roles-Data-v2' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('DiscountCoffe'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('DiscountCoffe'))
		)
BEGIN
	
	INSERT INTO Roles
	(
		roleName
		,static_id
		,createdAt
		,updatedAt
	) 
	SELECT N'coffe-user', 2, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Roles-Data-v2', GETDATE(), GETDATE()
END

GO

-- super admin
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-UserRoles-Data-v1' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN
	
	declare @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)
	declare @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)

	INSERT INTO UserRoles
	(
		
		userId,
		roleId,
		createdAt,
		updatedAt
	) 
	VALUES
	(
		@userId
		,@roleId
		,getdate()
		,getdate()

	)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-UserRoles-Data-v1', GETDATE(), GETDATE()
END

GO

-- profile attachment types

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v1' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 1, N'profile', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v1', GETDATE(), GETDATE()
END

GO


-- takhfif coffe
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v2' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 2, N'takhfifBuffetCover', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v2', GETDATE(), GETDATE()
END

GO

-- takhfif coffe
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v3' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 3, N'takhfifMenuCategoryCover', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v3', GETDATE(), GETDATE()
END

GO

-- takhfif coffe
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v4' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 4, N'takhfifMenuCover', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v4', GETDATE(), GETDATE()
END

GO


-- takhfif coffe
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v5' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 5, N'takhfifQrCode', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v5', GETDATE(), GETDATE()
END

GO




-- auth/admin/users
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v1' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AdminUsers'
	DECLARE @groupName nvarchar(256) = N'core.admin.users'
	DECLARE @findParentMenu bit = 0;
	DECLARE @parentMenuName nvarchar(256) = N'مدیریت'
	DECLARE @menuName nvarchar(256) = N'کاربران'
	DECLARE @menuUrl nvarchar(512) = N'/core/admin/users'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';
	DECLARE @permissionSymbolDelete nvarchar(512) = @groupName + '.delete';


	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETALL_' + @entityName, @permissionSymbolGetAll, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'CREATE_' + @entityName, @permissionSymbolCreate, @groupId, GETDATE(), GETDATE()
															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'UPDATE_' + @entityName, @permissionSymbolUpdate, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'DELETE_' + @entityName, @permissionSymbolDelete, @groupId, GETDATE(), GETDATE()

	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	INSERT INTO Permissions(permissionName ,permissionSymbol, permissionGroupId,createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'SHOWMENU_' + @entityName, @permissionSymbolShowMenu, @groupId,GETDATE(), GETDATE()

	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DECLARE @permissionId int = null
	SELECT @permissionId = permissionId FROM @PermissionTemp




	DECLARE @parentMenuId int = null
	


	IF @findParentMenu = 0
	BEGIN
		-- INSERT ParentMenu
		DECLARE @ParentMenuTemp TABLE (
			menuId int
		);

		INSERT INTO Menus(title, url, className, visibility, createdAt, updatedAt)
		OUTPUT inserted.id INTO @ParentMenuTemp(menuId)
		SELECT @parentMenuName, null, null, null, GETDATE(), GETDATE()

		SELECT @parentMenuId = menuId FROM @ParentMenuTemp

	END
	ELSE
	BEGIN
		SELECT @parentMenuId = id
		FROM Menus
		WHERE title = @parentMenuName
	END

	IF @parentMenuId IS NOT NULL
		AND NOT EXISTS (SELECT 1 FROM PermissionMenus WHERE permissionId = @permissionId AND menuId = @parentMenuId)
	BEGIN
		INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
		SELECT @permissionId, @parentMenuId, getdate(), getdate()
		
	END

	DECLARE @MenuTemp TABLE (
			menuId int
		);
	DECLARE @menuId int = null

	INSERT INTO Menus(title, url, parentMenuId, className, visibility, createdAt, updatedAt)
	OUTPUT inserted.id INTO @MenuTemp(menuId)
	SELECT @menuName, @menuUrl, @parentMenuId,null, null, GETDATE(), GETDATE()

	SELECT @menuId = menuId FROM @MenuTemp

	INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
	SELECT @permissionId, @menuId, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v1', GETDATE(), GETDATE()
END

GO

-- auth/admin/roles
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v2' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AdminRoles'
	DECLARE @groupName nvarchar(256) = N'core.admin.roles'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'مدیریت'
	DECLARE @menuName nvarchar(256) = N'مدیریت نقش ها'
	DECLARE @menuUrl nvarchar(512) = N'/core/admin/roles'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';
	DECLARE @permissionSymbolDelete nvarchar(512) = @groupName + '.delete';


	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETALL_' + @entityName, @permissionSymbolGetAll, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'CREATE_' + @entityName, @permissionSymbolCreate, @groupId, GETDATE(), GETDATE()
															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'UPDATE_' + @entityName, @permissionSymbolUpdate, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'DELETE_' + @entityName, @permissionSymbolDelete, @groupId, GETDATE(), GETDATE()

	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	-- Menus

	INSERT INTO Permissions(permissionName ,permissionSymbol, permissionGroupId,createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'SHOWMENU_' + @entityName, @permissionSymbolShowMenu, @groupId,GETDATE(), GETDATE()

	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DECLARE @permissionId int = null
	SELECT @permissionId = permissionId FROM @PermissionTemp




	DECLARE @parentMenuId int = null
	


	IF @findParentMenu = 0
	BEGIN
		-- INSERT ParentMenu
		DECLARE @ParentMenuTemp TABLE (
			menuId int
		);

		INSERT INTO Menus(title, url, className, visibility, createdAt, updatedAt)
		OUTPUT inserted.id INTO @ParentMenuTemp(menuId)
		SELECT @parentMenuName, null, null, null, GETDATE(), GETDATE()

		SELECT @parentMenuId = menuId FROM @ParentMenuTemp

	END
	ELSE
	BEGIN
		SELECT @parentMenuId = id
		FROM Menus
		WHERE title = @parentMenuName
	END

	IF @parentMenuId IS NOT NULL
		AND NOT EXISTS (SELECT 1 FROM PermissionMenus WHERE permissionId = @permissionId AND menuId = @parentMenuId)
	BEGIN
		INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
		SELECT @permissionId, @parentMenuId, getdate(), getdate()
		
	END

	DECLARE @MenuTemp TABLE (
			menuId int
		);
	DECLARE @menuId int = null

	INSERT INTO Menus(title, url, parentMenuId, className, visibility, createdAt, updatedAt)
	OUTPUT inserted.id INTO @MenuTemp(menuId)
	SELECT @menuName, @menuUrl, @parentMenuId,null, null, GETDATE(), GETDATE()

	SELECT @menuId = menuId FROM @MenuTemp

	INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
	SELECT @permissionId, @menuId, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v2', GETDATE(), GETDATE()
END

GO

-- auth/admin/roles
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v3' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AdminPermissions'
	DECLARE @groupName nvarchar(256) = N'core.admin.permissions'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'مدیریت'
	DECLARE @menuName nvarchar(256) = N'نمایش دسترسی ها'
	DECLARE @menuUrl nvarchar(512) = N'/core/admin/permissions'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';



	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETALL_' + @entityName, @permissionSymbolGetAll, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
	
	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	-- Menus

	INSERT INTO Permissions(permissionName ,permissionSymbol, permissionGroupId,createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'SHOWMENU_' + @entityName, @permissionSymbolShowMenu, @groupId,GETDATE(), GETDATE()

	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DECLARE @permissionId int = null
	SELECT @permissionId = permissionId FROM @PermissionTemp




	DECLARE @parentMenuId int = null
	


	IF @findParentMenu = 0
	BEGIN
		-- INSERT ParentMenu
		DECLARE @ParentMenuTemp TABLE (
			menuId int
		);

		INSERT INTO Menus(title, url, className, visibility, createdAt, updatedAt)
		OUTPUT inserted.id INTO @ParentMenuTemp(menuId)
		SELECT @parentMenuName, null, null, null, GETDATE(), GETDATE()

		SELECT @parentMenuId = menuId FROM @ParentMenuTemp

	END
	ELSE
	BEGIN
		SELECT @parentMenuId = id
		FROM Menus
		WHERE title = @parentMenuName
	END

	IF @parentMenuId IS NOT NULL
		AND NOT EXISTS (SELECT 1 FROM PermissionMenus WHERE permissionId = @permissionId AND menuId = @parentMenuId)
	BEGIN
		INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
		SELECT @permissionId, @parentMenuId, getdate(), getdate()
		
	END

	DECLARE @MenuTemp TABLE (
			menuId int
		);
	DECLARE @menuId int = null

	INSERT INTO Menus(title, url, parentMenuId, className, visibility, createdAt, updatedAt)
	OUTPUT inserted.id INTO @MenuTemp(menuId)
	SELECT @menuName, @menuUrl, @parentMenuId,null, null, GETDATE(), GETDATE()

	SELECT @menuId = menuId FROM @MenuTemp

	INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
	SELECT @permissionId, @menuId, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v3', GETDATE(), GETDATE()
END

GO

-- auth/admin/menus
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v4' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AdminMenus'
	DECLARE @groupName nvarchar(256) = N'core.admin.menus'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'مدیریت'
	DECLARE @menuName nvarchar(256) = N'منو ها'
	DECLARE @menuUrl nvarchar(512) = N'/core/admin/menus'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';


	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETALL_' + @entityName, @permissionSymbolGetAll, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'CREATE_' + @entityName, @permissionSymbolCreate, @groupId, GETDATE(), GETDATE()
															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'UPDATE_' + @entityName, @permissionSymbolUpdate, @groupId, GETDATE(), GETDATE()
															
	
	
	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	-- Menus

	INSERT INTO Permissions(permissionName ,permissionSymbol, permissionGroupId,createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'SHOWMENU_' + @entityName, @permissionSymbolShowMenu, @groupId,GETDATE(), GETDATE()

	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DECLARE @permissionId int = null
	SELECT @permissionId = permissionId FROM @PermissionTemp




	DECLARE @parentMenuId int = null
	


	IF @findParentMenu = 0
	BEGIN
		-- INSERT ParentMenu
		DECLARE @ParentMenuTemp TABLE (
			menuId int
		);

		INSERT INTO Menus(title, url, className, visibility, createdAt, updatedAt)
		OUTPUT inserted.id INTO @ParentMenuTemp(menuId)
		SELECT @parentMenuName, null, null, null, GETDATE(), GETDATE()

		SELECT @parentMenuId = menuId FROM @ParentMenuTemp

	END
	ELSE
	BEGIN
		SELECT @parentMenuId = id
		FROM Menus
		WHERE title = @parentMenuName
	END

	IF @parentMenuId IS NOT NULL
		AND NOT EXISTS (SELECT 1 FROM PermissionMenus WHERE permissionId = @permissionId AND menuId = @parentMenuId)
	BEGIN
		INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
		SELECT @permissionId, @parentMenuId, getdate(), getdate()
		
	END

	DECLARE @MenuTemp TABLE (
			menuId int
		);
	DECLARE @menuId int = null

	INSERT INTO Menus(title, url, parentMenuId, className, visibility, createdAt, updatedAt)
	OUTPUT inserted.id INTO @MenuTemp(menuId)
	SELECT @menuName, @menuUrl, @parentMenuId,null, null, GETDATE(), GETDATE()

	SELECT @menuId = menuId FROM @MenuTemp

	INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
	SELECT @permissionId, @menuId, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v4', GETDATE(), GETDATE()
END

GO

-- auth/admin/permissionGroups
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v5' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
	
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AdminPermissionGroups'
	DECLARE @groupName nvarchar(256) = N'core.admin.permissiongroups'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'مدیریت'
	DECLARE @menuName nvarchar(256) = N'گروه دسترسی'
	DECLARE @menuUrl nvarchar(512) = N'/core/admin/permissionGroups'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';


	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETALL_' + @entityName, @permissionSymbolGetAll, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
															 
															
	
	
	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	-- Menus

	INSERT INTO Permissions(permissionName ,permissionSymbol, permissionGroupId,createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'SHOWMENU_' + @entityName, @permissionSymbolShowMenu, @groupId,GETDATE(), GETDATE()

	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DECLARE @permissionId int = null
	SELECT @permissionId = permissionId FROM @PermissionTemp




	DECLARE @parentMenuId int = null
	


	IF @findParentMenu = 0
	BEGIN
		-- INSERT ParentMenu
		DECLARE @ParentMenuTemp TABLE (
			menuId int
		);

		INSERT INTO Menus(title, url, className, visibility, createdAt, updatedAt)
		OUTPUT inserted.id INTO @ParentMenuTemp(menuId)
		SELECT @parentMenuName, null, null, null, GETDATE(), GETDATE()

		SELECT @parentMenuId = menuId FROM @ParentMenuTemp

	END
	ELSE
	BEGIN
		SELECT @parentMenuId = id
		FROM Menus
		WHERE title = @parentMenuName
	END

	IF @parentMenuId IS NOT NULL
		AND NOT EXISTS (SELECT 1 FROM PermissionMenus WHERE permissionId = @permissionId AND menuId = @parentMenuId)
	BEGIN
		INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
		SELECT @permissionId, @parentMenuId, getdate(), getdate()
		
	END

	DECLARE @MenuTemp TABLE (
			menuId int
		);
	DECLARE @menuId int = null

	INSERT INTO Menus(title, url, parentMenuId, className, visibility, createdAt, updatedAt)
	OUTPUT inserted.id INTO @MenuTemp(menuId)
	SELECT @menuName, @menuUrl, @parentMenuId,null, null, GETDATE(), GETDATE()

	SELECT @menuId = menuId FROM @MenuTemp

	INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
	SELECT @permissionId, @menuId, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v5', GETDATE(), GETDATE()
END

GO


-- pcm/periodtypes
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v6' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
	
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'PeriodTypeGroups'
	DECLARE @groupName nvarchar(256) = N'pcm.periodtypes'
	
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	

	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETALL_' + @entityName, @permissionSymbolGetAll, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
															 
															
	
	
	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v6', GETDATE(), GETDATE()
END

GO

-- pcm/ages
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v7' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
	
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AgeGroups'
	DECLARE @groupName nvarchar(256) = N'pcm.ages'
	
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	

	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETALL_' + @entityName, @permissionSymbolGetAll, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
															 
															
	
	
	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v7', GETDATE(), GETDATE()
END

GO

-- pcm/publishes
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v8' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
	
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'PublishesGroups'
	DECLARE @groupName nvarchar(256) = N'pcm.publishes'
	
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	

	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETALL_' + @entityName, @permissionSymbolGetAll, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
															 
															
	
	
	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v8', GETDATE(), GETDATE()
END

GO


-- discount coffe
-- buffets
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v9' 
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
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AdminBuffets'
	DECLARE @groupName nvarchar(256) = N'discountcoffe.admin.buffets'
	DECLARE @findParentMenu bit = 0;
	DECLARE @parentMenuName nvarchar(256) = N'کافه و رستوران'
	DECLARE @menuName nvarchar(256) = N'لیست کافه و رستوران'
	DECLARE @menuUrl nvarchar(512) = N'/discountcoffe/admin/buffets'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';
	DECLARE @permissionSymbolDelete nvarchar(512) = @groupName + '.delete';
	DECLARE @permissionSymbolMenu nvarchar(512) = @groupName + '.menu';


	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETALL_' + @entityName, @permissionSymbolGetAll, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'CREATE_' + @entityName, @permissionSymbolCreate, @groupId, GETDATE(), GETDATE()
															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'UPDATE_' + @entityName, @permissionSymbolUpdate, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'DELETE_' + @entityName, @permissionSymbolDelete, @groupId, GETDATE(), GETDATE()

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'Menu_' + @entityName, @permissionSymbolMenu, @groupId, GETDATE(), GETDATE()

	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	INSERT INTO Permissions(permissionName ,permissionSymbol, permissionGroupId,createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'SHOWMENU_' + @entityName, @permissionSymbolShowMenu, @groupId,GETDATE(), GETDATE()

	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DECLARE @permissionId int = null
	SELECT @permissionId = permissionId FROM @PermissionTemp




	DECLARE @parentMenuId int = null
	


	IF @findParentMenu = 0
	BEGIN
		-- INSERT ParentMenu
		DECLARE @ParentMenuTemp TABLE (
			menuId int
		);

		INSERT INTO Menus(title, url, className, visibility, createdAt, updatedAt)
		OUTPUT inserted.id INTO @ParentMenuTemp(menuId)
		SELECT @parentMenuName, null, null, null, GETDATE(), GETDATE()

		SELECT @parentMenuId = menuId FROM @ParentMenuTemp

	END
	ELSE
	BEGIN
		SELECT @parentMenuId = id
		FROM Menus
		WHERE title = @parentMenuName
	END

	IF @parentMenuId IS NOT NULL
		AND NOT EXISTS (SELECT 1 FROM PermissionMenus WHERE permissionId = @permissionId AND menuId = @parentMenuId)
	BEGIN
		INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
		SELECT @permissionId, @parentMenuId, getdate(), getdate()
		
	END

	DECLARE @MenuTemp TABLE (
			menuId int
		);
	DECLARE @menuId int = null

	INSERT INTO Menus(title, url, parentMenuId, className, visibility, createdAt, updatedAt)
	OUTPUT inserted.id INTO @MenuTemp(menuId)
	SELECT @menuName, @menuUrl, @parentMenuId,null, null, GETDATE(), GETDATE()

	SELECT @menuId = menuId FROM @MenuTemp

	INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
	SELECT @permissionId, @menuId, getdate(), getdate()

	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v9', GETDATE(), GETDATE()
END

GO


-- discount coffe
-- menu categories
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v10' 
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
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AdminMenuCategories'
	DECLARE @groupName nvarchar(256) = N'discountcoffe.admin.menucategories'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'کافه و رستوران'
	DECLARE @menuName nvarchar(256) = N'لیست دسته بندی های منو'
	DECLARE @menuUrl nvarchar(512) = N'/discountcoffe/admin/menucategories'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';
	DECLARE @permissionSymbolDelete nvarchar(512) = @groupName + '.delete';



	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETALL_' + @entityName, @permissionSymbolGetAll, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'CREATE_' + @entityName, @permissionSymbolCreate, @groupId, GETDATE(), GETDATE()
															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'UPDATE_' + @entityName, @permissionSymbolUpdate, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'DELETE_' + @entityName, @permissionSymbolDelete, @groupId, GETDATE(), GETDATE()

	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	INSERT INTO Permissions(permissionName ,permissionSymbol, permissionGroupId,createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'SHOWMENU_' + @entityName, @permissionSymbolShowMenu, @groupId,GETDATE(), GETDATE()

	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DECLARE @permissionId int = null
	SELECT @permissionId = permissionId FROM @PermissionTemp




	DECLARE @parentMenuId int = null
	


	IF @findParentMenu = 0
	BEGIN
		-- INSERT ParentMenu
		DECLARE @ParentMenuTemp TABLE (
			menuId int
		);

		INSERT INTO Menus(title, url, className, visibility, createdAt, updatedAt)
		OUTPUT inserted.id INTO @ParentMenuTemp(menuId)
		SELECT @parentMenuName, null, null, null, GETDATE(), GETDATE()

		SELECT @parentMenuId = menuId FROM @ParentMenuTemp

	END
	ELSE
	BEGIN
		SELECT @parentMenuId = id
		FROM Menus
		WHERE title = @parentMenuName
	END

	IF @parentMenuId IS NOT NULL
		AND NOT EXISTS (SELECT 1 FROM PermissionMenus WHERE permissionId = @permissionId AND menuId = @parentMenuId)
	BEGIN
		INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
		SELECT @permissionId, @parentMenuId, getdate(), getdate()
		
	END

	DECLARE @MenuTemp TABLE (
			menuId int
		);
	DECLARE @menuId int = null

	INSERT INTO Menus(title, url, parentMenuId, className, visibility, createdAt, updatedAt)
	OUTPUT inserted.id INTO @MenuTemp(menuId)
	SELECT @menuName, @menuUrl, @parentMenuId,null, null, GETDATE(), GETDATE()

	SELECT @menuId = menuId FROM @MenuTemp

	INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
	SELECT @permissionId, @menuId, getdate(), getdate()

	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v10', GETDATE(), GETDATE()
END

GO

-- discount coffe
-- menus
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v11' 
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
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AdminDiscountMenus'
	DECLARE @groupName nvarchar(256) = N'discountcoffe.admin.menus'


	
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';
	DECLARE @permissionSymbolDelete nvarchar(512) = @groupName + '.delete';



	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETALL_' + @entityName, @permissionSymbolGetAll, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'CREATE_' + @entityName, @permissionSymbolCreate, @groupId, GETDATE(), GETDATE()
															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'UPDATE_' + @entityName, @permissionSymbolUpdate, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'DELETE_' + @entityName, @permissionSymbolDelete, @groupId, GETDATE(), GETDATE()

	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DECLARE @permissionId int = null
	SELECT @permissionId = permissionId FROM @PermissionTemp


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v11', GETDATE(), GETDATE()
END

GO


-- discount coffe
-- admin reserves
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v12' 
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
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AdminReserves'
	DECLARE @groupName nvarchar(256) = N'discountcoffe.admin.totalreserves'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'کافه و رستوران'
	DECLARE @menuName nvarchar(256) = N'لیست تمامی سفارش ها'
	DECLARE @menuUrl nvarchar(512) = N'/discountcoffe/admin/totalreserves'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';



	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETALL_' + @entityName, @permissionSymbolGetAll, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
															 															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'UPDATE_' + @entityName, @permissionSymbolUpdate, @groupId, GETDATE(), GETDATE()
															


	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	INSERT INTO Permissions(permissionName ,permissionSymbol, permissionGroupId,createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'SHOWMENU_' + @entityName, @permissionSymbolShowMenu, @groupId,GETDATE(), GETDATE()

	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DECLARE @permissionId int = null
	SELECT @permissionId = permissionId FROM @PermissionTemp




	DECLARE @parentMenuId int = null
	


	IF @findParentMenu = 0
	BEGIN
		-- INSERT ParentMenu
		DECLARE @ParentMenuTemp TABLE (
			menuId int
		);

		INSERT INTO Menus(title, url, className, visibility, createdAt, updatedAt)
		OUTPUT inserted.id INTO @ParentMenuTemp(menuId)
		SELECT @parentMenuName, null, null, null, GETDATE(), GETDATE()

		SELECT @parentMenuId = menuId FROM @ParentMenuTemp

	END
	ELSE
	BEGIN
		SELECT @parentMenuId = id
		FROM Menus
		WHERE title = @parentMenuName
	END

	IF @parentMenuId IS NOT NULL
		AND NOT EXISTS (SELECT 1 FROM PermissionMenus WHERE permissionId = @permissionId AND menuId = @parentMenuId)
	BEGIN
		INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
		SELECT @permissionId, @parentMenuId, getdate(), getdate()
		
	END

	DECLARE @MenuTemp TABLE (
			menuId int
		);
	DECLARE @menuId int = null

	INSERT INTO Menus(title, url, parentMenuId, className, visibility, createdAt, updatedAt)
	OUTPUT inserted.id INTO @MenuTemp(menuId)
	SELECT @menuName, @menuUrl, @parentMenuId,null, null, GETDATE(), GETDATE()

	SELECT @menuId = menuId FROM @MenuTemp

	INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
	SELECT @permissionId, @menuId, getdate(), getdate()

	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v12', GETDATE(), GETDATE()
END

GO


-- discount coffe
-- coffe reserves
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v13' 
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
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'CoffeReserves'
	DECLARE @groupName nvarchar(256) = N'discountcoffe.admin.reservers'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'کافه و رستوران'
	DECLARE @menuName nvarchar(256) = N'لیست تمامی سفارش ها'
	DECLARE @menuUrl nvarchar(512) = N'/discountcoffe/admin/reservers'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';



	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETALL_' + @entityName, @permissionSymbolGetAll, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
															 															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'UPDATE_' + @entityName, @permissionSymbolUpdate, @groupId, GETDATE(), GETDATE()
															


	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	INSERT INTO Permissions(permissionName ,permissionSymbol, permissionGroupId,createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'SHOWMENU_' + @entityName, @permissionSymbolShowMenu, @groupId,GETDATE(), GETDATE()

	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DECLARE @permissionId int = null
	SELECT @permissionId = permissionId FROM @PermissionTemp




	DECLARE @parentMenuId int = null
	


	IF @findParentMenu = 0
	BEGIN
		-- INSERT ParentMenu
		DECLARE @ParentMenuTemp TABLE (
			menuId int
		);

		INSERT INTO Menus(title, url, className, visibility, createdAt, updatedAt)
		OUTPUT inserted.id INTO @ParentMenuTemp(menuId)
		SELECT @parentMenuName, null, null, null, GETDATE(), GETDATE()

		SELECT @parentMenuId = menuId FROM @ParentMenuTemp

	END
	ELSE
	BEGIN
		SELECT @parentMenuId = id
		FROM Menus
		WHERE title = @parentMenuName
	END

	IF @parentMenuId IS NOT NULL
		AND NOT EXISTS (SELECT 1 FROM PermissionMenus WHERE permissionId = @permissionId AND menuId = @parentMenuId)
	BEGIN
		INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
		SELECT @permissionId, @parentMenuId, getdate(), getdate()
		
	END

	DECLARE @MenuTemp TABLE (
			menuId int
		);
	DECLARE @menuId int = null

	INSERT INTO Menus(title, url, parentMenuId, className, visibility, createdAt, updatedAt)
	OUTPUT inserted.id INTO @MenuTemp(menuId)
	SELECT @menuName, @menuUrl, @parentMenuId,null, null, GETDATE(), GETDATE()

	SELECT @menuId = menuId FROM @MenuTemp

	INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
	SELECT @permissionId, @menuId, getdate(), getdate()

	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v13', GETDATE(), GETDATE()
END

GO


-- discount coffe
-- admin reports
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v14' 
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
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AdminReports'
	DECLARE @groupName nvarchar(256) = N'discountcoffe.admin.adminreports'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'کافه و رستوران'
	DECLARE @menuName nvarchar(256) = N'گزارش های ادمین'
	DECLARE @menuUrl nvarchar(512) = N'/discountcoffe/admin/adminreports'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';



	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETALL_' + @entityName, @permissionSymbolGetAll, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
															 															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'UPDATE_' + @entityName, @permissionSymbolUpdate, @groupId, GETDATE(), GETDATE()
															


	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	INSERT INTO Permissions(permissionName ,permissionSymbol, permissionGroupId,createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'SHOWMENU_' + @entityName, @permissionSymbolShowMenu, @groupId,GETDATE(), GETDATE()

	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DECLARE @permissionId int = null
	SELECT @permissionId = permissionId FROM @PermissionTemp




	DECLARE @parentMenuId int = null
	


	IF @findParentMenu = 0
	BEGIN
		-- INSERT ParentMenu
		DECLARE @ParentMenuTemp TABLE (
			menuId int
		);

		INSERT INTO Menus(title, url, className, visibility, createdAt, updatedAt)
		OUTPUT inserted.id INTO @ParentMenuTemp(menuId)
		SELECT @parentMenuName, null, null, null, GETDATE(), GETDATE()

		SELECT @parentMenuId = menuId FROM @ParentMenuTemp

	END
	ELSE
	BEGIN
		SELECT @parentMenuId = id
		FROM Menus
		WHERE title = @parentMenuName
	END

	IF @parentMenuId IS NOT NULL
		AND NOT EXISTS (SELECT 1 FROM PermissionMenus WHERE permissionId = @permissionId AND menuId = @parentMenuId)
	BEGIN
		INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
		SELECT @permissionId, @parentMenuId, getdate(), getdate()
		
	END

	DECLARE @MenuTemp TABLE (
			menuId int
		);
	DECLARE @menuId int = null

	INSERT INTO Menus(title, url, parentMenuId, className, visibility, createdAt, updatedAt)
	OUTPUT inserted.id INTO @MenuTemp(menuId)
	SELECT @menuName, @menuUrl, @parentMenuId,null, null, GETDATE(), GETDATE()

	SELECT @menuId = menuId FROM @MenuTemp

	INSERT INTO PermissionMenus(permissionId, menuId, createdAt, updatedAt)
	SELECT @permissionId, @menuId, getdate(), getdate()

	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v14', GETDATE(), GETDATE()
END

GO




-- period types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'PCMPeriodTypes-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
BEGIN

	INSERT INTO PCMPeriodTypes
	(
		id
		,periodTypeName
		,createdAt
		,updatedAt
	)
	VALUES(1, N'نمایش در یک تاریخ مشخص', getdate(), getdate())
		,(2, N'نمایش به صورت روزانه', getdate(), getdate())
		,(3, N'نمایش به صورت هفتگی', getdate(), getdate())
		,(4, N'نمایش به صورت ماهانه', getdate(), getdate())
		,(5, N'نمایش به صورت سالانه', getdate(), getdate())

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'PCMPeriodTypes-Data-v1', GETDATE(), GETDATE()
END

GO

-- daily
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'PCMPeriods-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
BEGIN

	INSERT INTO PCMPeriods(periodTypeId, startDate, endDate, endDateOffset,createdAt, updatedAt)
	SELECT
	    2 as periodTypeId
		,PD1.GregorianDate as startDate
		,PD1.GregorianDate as endDate
		,DATEADD(DAY, 1, PD1.GregorianDate) as endDateOffset
		,getdate()
		,getdate()
	FROM PersianDates PD1
	WHERE PD1.YearNumber >= 1402 
		AND PD1.GregorianDate >= '2023-03-25'
		AND PD1.GregorianDate <= '2028-03-25'
	ORDER BY PD1.GregorianDate ASC

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'PCMPeriods-Data-v1', GETDATE(), GETDATE()
END

GO

-- weekly
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'PCMPeriods-Data-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
BEGIN

	INSERT INTO PCMPeriods(periodTypeId, startDate, endDate, endDateOffset, createdAt, updatedAt)
	SELECT
	    3 as periodTypeId
		,PD1.GregorianDate as startDate
		,PD2.GregorianDate as endDate
		,DATEADD(DAY, 1, PD2.GregorianDate) as endDateOffset
		,getdate()
		,getdate()
	FROM PersianDates PD1
	LEFT JOIN  PersianDates PD2
	ON PD1.GregorianDate = DATEADD(day, -6, PD2.GregorianDate)
	WHERE PD1.YearNumber >= 1402 
		AND PD1.WeekDayNumber = 1
		AND PD1.GregorianDate >= '2023-03-25'
		AND PD1.GregorianDate <= '2028-03-25'
	ORDER BY PD1.GregorianDate ASC

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'PCMPeriods-Data-v2', GETDATE(), GETDATE()
END

GO

-- monthly
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'PCMPeriods-Data-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
BEGIN

	INSERT INTO PCMPeriods(periodTypeId, startDate, endDate, endDateOffset, createdAt, updatedAt)
	SELECT
	    4 as periodTypeId
		,MIN(PD1.GregorianDate) as startDate
		,MAX(PD1.GregorianDate) as endDate
		,DATEADD(DAY, 1, MAX(PD1.GregorianDate)) as endDateOffset
		,getdate()
		,getdate()
	FROM PersianDates PD1
	WHERE PD1.YearNumber >= 1402 
		AND PD1.GregorianDate >= '2023-03-21'
		AND PD1.GregorianDate <= '2028-04-19'
	GROUP BY PD1.YearNumber, PD1.YearMonth
	ORDER BY PD1.YearNumber, PD1.YearMonth ASC

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'PCMPeriods-Data-v3', GETDATE(), GETDATE()
END

GO

-- yearly
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'PCMPeriods-Data-v4' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
BEGIN

	INSERT INTO PCMPeriods(periodTypeId, startDate, endDate, endDateOffset, createdAt, updatedAt)
	SELECT
	    5 as periodTypeId
		,MIN(PD1.GregorianDate) as startDate
		,MAX(PD1.GregorianDate) as endDate
		,DATEADD(DAY, 1, MAX(PD1.GregorianDate)) as endDateOffset
		,getdate()
		,getdate()
	FROM PersianDates PD1
	WHERE PD1.YearNumber >= 1402 
		AND PD1.YearNumber <= 1407
	GROUP BY PD1.YearNumber

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'PCMPeriods-Data-v4', GETDATE(), GETDATE()
END

GO

-- ages
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'PCMAges-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
BEGIN

	INSERT INTO PCMAges
	(
		ageName,
		minAge,
		maxAge,
		createdAt,
		updatedAt
	)
	VALUES (N'یک سال تا دو سال', 1, 2, getdate(), getdate())
			,(N'دو سال تا سه سال', 2, 3, getdate(), getdate()) 
			,(N'سه سال تا چهار سال', 3, 4, getdate(), getdate()) 
			,(N'چهار سال تا پنج سال', 4, 5, getdate(), getdate()) 
			,(N'پنج سال تا شش سال', 5, 6, getdate(), getdate()) 
			,(N'شش سال تا هفت سال', 6, 7, getdate(), getdate()) 
			,(N'هفت سال تا هشت سال', 7, 8, getdate(), getdate()) 
			,(N'هشت سال تا نه سال', 8, 9, getdate(), getdate()) 
			,(N'نه سال تا ده سال', 9, 10, getdate(), getdate()) 
			,(N'ده سال تا یازده سال', 10, 11, getdate(), getdate()) 
			,(N'یازده سال تا دوازده سال', 11, 12, getdate(), getdate()) 
			,(N'دوازده سال تا سیزده سال', 12, 13, getdate(), getdate()) 
			,(N'سیزده سال تا چهارده سال', 13, 14, getdate(), getdate()) 
			,(N'چهارده سال تا پانزده سال', 14, 15, getdate(), getdate()) 
			,(N'پانزده سال تا شانزده سال', 15, 16, getdate(), getdate())
			,(N'شانزده سال تا هفده سال', 16, 17, getdate(), getdate()) 

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'PCMAges-Data-v1', GETDATE(), GETDATE()
END

GO

-- publishes

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'PCMPublishes-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
		)
BEGIN

	INSERT INTO PCMPublishes
	(
		id,
		publishName,
		createdAt,
		updatedAt
	)
	VALUES(1, N'پیش نویس', getdate(), getdate())
		,(2, N'منتشر شده', getdate(), getdate())

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'PCMPublishes-Data-v1', GETDATE(), GETDATE()
END

GO

-- article types
--IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'PCMArticleTypes-Data-v1' )
--	AND EXISTS (
--		SELECT 1 FROM Settings 
--		WHERE ([key] = 'SITE_NAME' AND [value] IN ('PeriodContentManagement'))
--		)
--	AND EXISTS (
--		SELECT 1 FROM Settings 
--		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('TiyaraRah'))
--		)
--BEGIN


--	INSERT INTO PCMArticleTypes
--	(
--		id,
--		typeName,
--		createdAt,
--		updatedAt
--	)
--	VALUES (1, N'', getdate(), getdate())

--	INSERT INTO Migrations(version, createdAt, updatedAt)
--	SELECT 'PCMArticleTypes-Data-v1', GETDATE(), GETDATE()
--END

--GO

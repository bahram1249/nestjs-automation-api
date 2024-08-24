﻿IF OBJECT_ID('Settings', 'U') IS  NULL 
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


IF OBJECT_ID('dbo.fnCalcDistanceKM', 'FN') IS  NULL
BEGIN


ExeC('CREATE FUNCTION dbo.fnCalcDistanceKM(@lat1 FLOAT = null, @lat2 FLOAT=null, @lon1 FLOAT=null, @lon2 FLOAT=null)  
RETURNS FLOAT   
AS  
BEGIN  
	IF(@lat1 IS NULL OR @lat2 IS NULL OR @lon1 IS NULL OR @lon2 IS NULL) RETURN 0;  
	RETURN ACOS(SIN(PI()*@lat1/180.0)*SIN(PI()*@lat2/180.0)+COS(PI()*@lat1/180.0)*COS(PI()*@lat2/180.0)*COS(PI()*@lon2/180.0-PI()*@lon1/180.0))*6371  
END')

END
 
GO

-- Core Tables

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Settings-v2' 
					
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN

	ALTER TABLE Settings
	ALTER COLUMN [value] nvarchar(max) NULL;

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Settings-v2', GETDATE(), GETDATE()
END

GO



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



IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Users-v2' 
					
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN

	ALTER TABLE Users 
		ADD birthDate					date						 NULL;
	

	
	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Users-v2', GETDATE(), GETDATE()
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



IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Attachments-v2' 
				
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN


	ALTER TABLE Attachments
		ADD bucketName nvarchar(256) null,
			etag nvarchar(256) null,
			versionId nvarchar(256) null;

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Attachments-v2', GETDATE(), GETDATE()
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



IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-entitymodel-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)

BEGIN

	CREATE TABLE EAVEntityModels (
		id							int							PRIMARY KEY,
		name						nvarchar(256)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-entitymodel-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-entitytype-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE EAVEntityTypes (
		id							int	identity(1,1)			PRIMARY KEY,
		name						nvarchar(256)				NOT NULL,
		slug						nvarchar(512)				NOT NULL,
		entityModelId				int							NOT NULL
			CONSTRAINT FK_EAVEntityTypes_EntityModelId
				FOREIGN KEY REFERENCES EAVEntityModels(id),
		parentEntityTypeId			int							NULL
			CONSTRAINT FK_EAVEntityTypes_ParentEntityTypeId
				FOREIGN KEY REFERENCES EAVEntityTypes(id),
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-entitytype-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-entitytype-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE EAVEntityTypes 
		ADD attachmentId bigint null
			CONSTRAINT EAVEntityTypes_AttachmentId
				FOREIGN KEY REFERENCES Attachments(id)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-entitytype-v2', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-entitytype-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE EAVEntityTypes 
		ADD metaTitle nvarchar(512) null,
			metaKeywords nvarchar(512) null,
			metaDescription nvarchar(512) null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-entitytype-v3', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-entitytype-v4' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE EAVEntityTypes 
		ADD [description]	nvarchar(max) NULL 

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-entitytype-v4', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-entitytype-v5' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE EAVEntityTypes 
		ADD [priority]	int NULL 

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-entitytype-v5', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-attributetype-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE EAVAttributeTypes (
		id							int							PRIMARY KEY,
		name						nvarchar(256)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-attributetype-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-attributetype-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE EAVAttributeTypes
	ADD valueBased bit null

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-attributetype-v2', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-attributes-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE EAVAttributes (
		id							bigint identity(1,1)		PRIMARY KEY,
		name						nvarchar(256)				NOT NULL,
		attributeTypeId				int							NOT NULL
			CONSTRAINT FK_EAVAttributes_AttributeTypeId
				FOREIGN KEY REFERENCES EAVAttributeTypes(id),
		minLength					int							NULL,
		[maxLength]					int							NULL,
		[required]					bit							NULL,
		[isDeleted]					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-attributes-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-attributevalues-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE EAVAttributeValues (
		id							bigint identity(1,1)		PRIMARY KEY,
		attributeId					bigint						NOT NULL
			CONSTRAINT FK_EAVAttributeValues_AttributeId
				FOREIGN KEY REFERENCES EAVAttributes(id),
		[value]						nvarchar(256)				NULL,
		[isDeleted]					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL
	);

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-attributevalues-v1', GETDATE(), GETDATE()
END

GO



IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-entityattributes-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE EAVEntityAttributes (
		entityTypeId				int							NOT NULL,
		attributeId					bigint						NOT NULL
			CONSTRAINT FK_EAVEntityAttributes_AttributeId
				FOREIGN KEY REFERENCES EAVAttributes(id),
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
		PRIMARY KEY CLUSTERED(entityTypeId, attributeId)
	);




	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-entityattributes-v1', GETDATE(), GETDATE()
END

GO

-- eav entities
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-entities-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE EAVEntities (
		entityId					bigint identity(1,1)		PRIMARY KEY,
		entityTypeId				int							NOT NULL
			CONSTRAINT FK_EAVEntities_EntityTypeId
				FOREIGN KEY REFERENCES EAVEntityTypes(id),
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-entities-v1', GETDATE(), GETDATE()
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


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-EAVEntityAttributeValues-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE EAVEntityAttributeValues (
		entityId					bigint						NOT NULL
			CONSTRAINT FK_EAVEntityAttributeValues_entityId
				FOREIGN KEY REFERENCES EAVEntities(entityId),
		attributeId					bigint						NOT NULL
			CONSTRAINT FK_EAVEntityAttributeValues_attributeId
				FOREIGN KEY REFERENCES EAVAttributes(id),
		val							nvarchar(1024)				NULL,
		attributeValueId			bigint						NULL
			CONSTRAINT FK_EAVEntityAttributeValues_attributeValueId
				FOREIGN KEY REFERENCES EAVAttributeValues(id),
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
		PRIMARY KEY CLUSTERED(entityId, attributeId)
	);



	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-EAVEntityAttributeValues-v1', GETDATE(), GETDATE()
END

GO


-- eav product photos
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-product-photos-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE EAVEntityPhotos (
		entityId					bigint						NOT NULL,
		attachmentId				bigint						NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
		PRIMARY KEY CLUSTERED(entityId, attachmentId),
	);



	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-product-photos-v1', GETDATE(), GETDATE()
END

GO


-- eav products videos
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-product-videos-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE EAVEntityVideos (
		entityId					bigint						NOT NULL,
		attachmentId				bigint						NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
		PRIMARY KEY CLUSTERED(entityId, attachmentId),
	);



	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-product-videos-v1', GETDATE(), GETDATE()
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

/*

Data


*/



-- ec-order-status-Data-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-order-status-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECOrderStatus(id, name ,createdAt, updatedAt)
	VALUES (1, N'منتظر پرداخت', GETDATE(), GETDATE())
			,(2, N'پرداخت شده', GETDATE(), GETDATE())
			,(3, N'سفارش پردازش شده', GETDATE(), GETDATE())
			,(4, N'ارسال به پست', GETDATE(), GETDATE())
			,(5, N'ارسال به پیک', GETDATE(), GETDATE())
			,(6, N'سفارش تحویل مشتری گردیده', GETDATE(), GETDATE())
			

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-order-status-Data-v1', GETDATE(), GETDATE()
END

GO


-- ec-order-detail-status-Data-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-order-detail-status-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECOrderDetailStatus(id, name ,createdAt, updatedAt)
	VALUES (1, N'منتظر پردازش', GETDATE(), GETDATE())
			,(2, N'پردازش شده', GETDATE(), GETDATE())
			
			

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-order-detail-status-Data-v1', GETDATE(), GETDATE()
END

GO


-- ec-payment-status-Data-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-payment-status-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECPaymentStatus(id, name ,createdAt, updatedAt)
	VALUES (1, N'منتظر پرداخت', GETDATE(), GETDATE())
			,(2, N'پرداخت ناموفق', GETDATE(), GETDATE())
			,(3, N'پرداخت موفق', GETDATE(), GETDATE())
			,(4, N'وجه بازگشتی', GETDATE(), GETDATE())
			
			

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-payment-status-Data-v1', GETDATE(), GETDATE()
END

GO



-- ec-payment-status-Data-v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-payment-status-Data-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECPaymentStatus(id, name ,createdAt, updatedAt)
	VALUES (5, N'کسر از موجودی کیف پول', GETDATE(), GETDATE())
		,(6, N'بازگشت موجودی به کیف پول', GETDATE(), GETDATE())
			
	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-payment-status-Data-v2', GETDATE(), GETDATE()
END

GO


-- ec-payment-types-Data-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-payment-types-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECPaymentTypes(id, name ,createdAt, updatedAt)
	VALUES (1, N'به منظور پرداخت سفارش', GETDATE(), GETDATE())
			,(2, N'به منظور افزایش موجودی کیف پول', GETDATE(), GETDATE())
			
			
			

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-payment-types-Data-v1', GETDATE(), GETDATE()
END

GO

-- ec-order-shipment-ways-Data-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-order-shipment-ways-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECOrderShipmentWays(id, name ,createdAt, updatedAt)
	VALUES (1, N'ارسال از طریق پست', GETDATE(), GETDATE())
			,(2, N'ارسال از طریق پیک', GETDATE(), GETDATE())
			
			

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-order-shipment-ways-Data-v1', GETDATE(), GETDATE()
END

GO


-- ec-slug-version-types-Data-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-slug-version-types-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECSlugVersionTypes(id, title ,createdAt, updatedAt)
	VALUES (1, N'محصول', GETDATE(), GETDATE())
			,(2, N'دسته بندی', GETDATE(), GETDATE())
			,(3, N'برند', GETDATE(), GETDATE())
			,(4, N'گارانتی', GETDATE(), GETDATE())
			

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-slug-version-types-Data-v1', GETDATE(), GETDATE()
END

GO

-- ec-postage-fee-Data-v1
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-postage-fee-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECPostageFees(fromWeight, toWeight, allProvincePrice,createdAt, updatedAt)
	VALUES (0, 500, 20056,GETDATE(), GETDATE())
			,(500, 1000, 26160,GETDATE(), GETDATE())
			,(1000, 2000, 32264,GETDATE(), GETDATE())
			,(2000, 3000, 37714,GETDATE(), GETDATE())
			,(3000, 4000, 43164,GETDATE(), GETDATE())
			,(4000, 5000, 48614,GETDATE(), GETDATE())
			,(5000, 6000, 54064,GETDATE(), GETDATE())
			,(6000, 7000, 59514,GETDATE(), GETDATE())
			,(7000, 8000, 64964,GETDATE(), GETDATE())
			,(8000, 9000, 70414,GETDATE(), GETDATE())
			,(9000, 10000, 75864,GETDATE(), GETDATE())
			,(10000, 11000, 81314,GETDATE(), GETDATE())
			,(11000, 12000, 86764,GETDATE(), GETDATE())
			,(12000, 13000, 92214,GETDATE(), GETDATE())
			,(13000, 14000, 97664,GETDATE(), GETDATE())
			,(14000, 15000, 103114,GETDATE(), GETDATE())
			,(15000, 16000, 108564,GETDATE(), GETDATE())
			,(16000, 17000, 114014,GETDATE(), GETDATE())
			,(17000, 18000, 119464,GETDATE(), GETDATE())
			,(18000, 19000, 124914,GETDATE(), GETDATE())
			,(19000, 20000, 130364,GETDATE(), GETDATE())
			,(20000, 21000, 135814,GETDATE(), GETDATE())
			,(21000, 22000, 141264,GETDATE(), GETDATE())
			,(22000, 23000, 146714,GETDATE(), GETDATE())
			,(23000, 24000, 152164,GETDATE(), GETDATE())
			,(24000, 25000, 157614,GETDATE(), GETDATE())
			,(25000, 26000, 163064,GETDATE(), GETDATE())
			,(26000, 27000, 168514,GETDATE(), GETDATE())
			,(27000, 28000, 173964,GETDATE(), GETDATE())
			,(28000, 29000, 179414,GETDATE(), GETDATE())
			,(29000, 30000, 184864,GETDATE(), GETDATE())

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-postage-fee-Data-v1', GETDATE(), GETDATE()
END

GO

-- ec discount-types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discount-types-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECDiscountTypes(id, name, isCouponBased,createdAt, updatedAt)
	VALUES (1, N'عمومی', 0,GETDATE(), GETDATE())
			,(2, N'شگفت انگیز', 0,GETDATE(), GETDATE())
			,(3, N'به صورت کد تخفیف', 1,GETDATE(), GETDATE())
			,(4, N'مناسبتی(نیازمند طراحی صفحه)', 0,GETDATE(), GETDATE())
		

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discount-types-Data-v1', GETDATE(), GETDATE()
END

GO

-- ec discount-types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discount-types-Data-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECDiscountTypes(id, name, isCouponBased, isFactorBased ,createdAt, updatedAt)
	VALUES (5, N'بر اساس فاکتور', 0, 1,GETDATE(), GETDATE())
		

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discount-types-Data-v2', GETDATE(), GETDATE()
END

GO


-- ec discount-action-rules
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discount-action-rules-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECDiscountActionRules(id, name,createdAt, updatedAt)
	VALUES (1, N'بهم پیوسته(And)', GETDATE(), GETDATE())
			,(2, N'یک شرط یا بیشتر کافی است(Or)', GETDATE(), GETDATE())
		

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discount-action-rules-Data-v1', GETDATE(), GETDATE()
END

GO



-- ec discount-action-types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discount-action-types-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECDiscountActionTypes(id, name,createdAt, updatedAt)
	VALUES (1, N'درصدی(Percentage)', GETDATE(), GETDATE())
			,(2, N'مقدار ثابت(FixedAmount)', GETDATE(), GETDATE())
		

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discount-action-types-Data-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-vendor-commissiontypes-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECVendorCommissionTypes(id, name,createdAt, updatedAt)
	VALUES (1, N'درصدی(Percentage)', GETDATE(), GETDATE())
			,(2, N'مقدار ثابت(FixedAmount)', GETDATE(), GETDATE())
		

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-vendor-commissiontypes-Data-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-paymentgateway-commissiontypes-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECPaymentGatewayCommissionTypes(id, name,createdAt, updatedAt)
	VALUES (1, N'درصدی(Percentage)', GETDATE(), GETDATE())
			,(2, N'مقدار ثابت(FixedAmount)', GETDATE(), GETDATE())
		

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-paymentgateway-commissiontypes-Data-v1', GETDATE(), GETDATE()
END

GO



-- ec discount-condition-types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ec-discount-condition-types-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECDiscountConditionTypes(id, name,createdAt, updatedAt)
	VALUES (1, N'بر اساس محصول', GETDATE(), GETDATE())
			,(2, N'بر اساس دسته بندی', GETDATE(), GETDATE())
			,(3, N'بر اساس فروشنده', GETDATE(), GETDATE())
			,(4, N'بر اساس شناسه موجودی', GETDATE(), GETDATE())
		

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-discount-condition-types-Data-v1', GETDATE(), GETDATE()
END

GO


-- eav
-- attributetypes
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-attributetypes-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO EAVAttributeTypes(id, name, valueBased,createdAt, updatedAt)
	VALUES (1, N'متنی', 0, getdate(), getdate())
			,(2, N'عددی', 0, getdate(), getdate())
			,(3, N'انتخابی', 1, getdate(), getdate())
		

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-attributetypes-Data-v1', GETDATE(), GETDATE()
END

GO

-- eav
-- entitymodels
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-entitymodels-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO EAVEntityModels(id, name, createdAt, updatedAt)
	VALUES (1, N'فروشگاه', getdate(), getdate())
			
	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-entitymodels-Data-v1', GETDATE(), GETDATE()
END

GO

-- ecommerce
-- product-price-formulas
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-product-price-formulas-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECProductPriceFormulas(id, title, createdAt, updatedAt)
	VALUES (1, N'فرمول 0 تا 2 گرم', getdate(), getdate())
			,(2, N'فرمول 2 گرم به بالا', getdate(), getdate())
			
	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-product-price-formulas-Data-v1', GETDATE(), GETDATE()
END

GO


-- ecommerce
-- guaranteemonth
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-guaranteemonths-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECGuaranteeMonths(id, name, monthCount, createdAt, updatedAt)
	VALUES (1, N'یک ماهه', 1, GETDATE(), GETDATE())
			,(2, N'سه ماهه', 3, GETDATE(), GETDATE())
			,(3, N'شش ماهه', 6, GETDATE(), GETDATE())
			,(4, N'هشت ماهه', 8, GETDATE(), GETDATE())
			,(5, N'دوازده ماهه', 12, GETDATE(), GETDATE())
			,(6, N'هجده ماهه', 18, GETDATE(), GETDATE())
			,(7, N'بیست و چهار ماهه', 24, GETDATE(), GETDATE())
			

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-guaranteemonths-Data-v1', GETDATE(), GETDATE()
END

GO

-- ecommerce
-- provinces
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-provinces-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECProvinces(
	id
	,[name]
	,slug
	,isDeleted
	,[order]
	,createdAt
	,updatedAt)
	VALUES  (1,N'آذربايجان شرقي',N'AZE', null, 1, GETDATE(), GETDATE())
	,(2,N'آذربايجان غربي',N'AZW', null, 2, GETDATE(), GETDATE())
	,(3,N'اردبيل',N'ARD', null, 3, GETDATE(), GETDATE())
	,(4,N'اصفهان',N'ISF', null, 4, GETDATE(), GETDATE())
	,(5,N'البرز',N'ALB', null, 5, GETDATE(), GETDATE())
	,(6,N'ايلام',N'ILM', null, 6, GETDATE(), GETDATE())
	,(7,N'بوشهر',N'BOO', null, 7, GETDATE(), GETDATE())
	,(8,N'تهران',N'THR', null, 8, GETDATE(), GETDATE())
	,(9,N'چهارمحال و بختياري',N'BKH', null, 9, GETDATE(), GETDATE())
	,(10,N'خراسان جنوبي',N'KHS', null, 10, GETDATE(), GETDATE())
	,(11,N'خراسان رضوي',N'KHR', null, 11, GETDATE(), GETDATE())
	,(12,N'خراسان شمالي',N'KHN', null, 12, GETDATE(), GETDATE())
	,(13,N'خوزستان',N'KHZ', null, 13, GETDATE(), GETDATE())
	,(14,N'زنجان',N'ZAN', null, 14, GETDATE(), GETDATE())
	,(15,N'سمنان',N'SMN', null, 15, GETDATE(), GETDATE())
	,(16,N'سيستان و بلوچستان',N'BAL', null, 16, GETDATE(), GETDATE())
	,(17,N'فارس',N'FRS', null, 17, GETDATE(), GETDATE())
	,(18,N'قزوين',N'QAZ', null, 18, GETDATE(), GETDATE())
	,(19,N'قم',N'QOM', null, 19, GETDATE(), GETDATE())
	,(20,N'کردستان',N'KRD', null, 20, GETDATE(), GETDATE())
	,(21,N'کرمان',N'KER', null, 21, GETDATE(), GETDATE())
	,(22,N'کرمانشاه',N'KRM', null, 22, GETDATE(), GETDATE())
	,(23,N'کهگيلويه و بويراحمد',N'KKB', null, 23, GETDATE(), GETDATE())
	,(24,N'گلستان',N'GOL', null, 24, GETDATE(), GETDATE())
	,(25,N'گيلان (شمال)',N'GIL', null, 25, GETDATE(), GETDATE())
	,(26,N'لرستان',N'LOR', null, 26, GETDATE(), GETDATE())
	,(27,N'مازندران (شمال)',N'MAZ', null, 27, GETDATE(), GETDATE())
	,(28,N'مرکزي',N'MRK', null, 28, GETDATE(), GETDATE())
	,(29,N'هرمزگان',N'HRM', null, 29, GETDATE(), GETDATE())
	,(30,N'همدان',N'HMD', null, 30, GETDATE(), GETDATE())
	,(31,N'يزد',N'YZD', null, 31, GETDATE(), GETDATE())
			

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-provinces-Data-v1', GETDATE(), GETDATE()
END

GO

-- ecommerce
-- cities
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-cities-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECCities(
	id
	,[name]
	,provinceId
	,neighborhoodBase
	,createdAt
	,updatedAt)
	VALUES  (1,N'تبریز',1, 1, GETDATE(), GETDATE())
	,(2,N'تبریز - خسروشهر',1, 0, GETDATE(), GETDATE())
	,(3,N'اسکو',1, 0, GETDATE(), GETDATE())
	,(4,N'اسکو - ایلخچی',1, 0, GETDATE(), GETDATE())
	,(5,N'اسکو - سهند',1, 0, GETDATE(), GETDATE())
	,(6,N'اهر',1, 0, GETDATE(), GETDATE())
	,(7,N'اهر - هوراند',1, 0, GETDATE(), GETDATE())
	,(8,N'بستان آباد',1, 0, GETDATE(), GETDATE())
	,(9,N'بستان آباد - تیکمه داش',1, 0, GETDATE(), GETDATE())
	,(10,N'بناب',1, 0, GETDATE(), GETDATE())
	,(11,N'جلفا',1, 0, GETDATE(), GETDATE())
	,(12,N'جلفا - سیه رود',1, 0, GETDATE(), GETDATE())
	,(13,N'چاراویماق',1, 0, GETDATE(), GETDATE())
	,(14,N'چاراویماق - شادیان',1, 0, GETDATE(), GETDATE())
	,(15,N'سراب',1, 0, GETDATE(), GETDATE())
	,(16,N'سراب - مهربان',1, 0, GETDATE(), GETDATE())
	,(17,N'شبستر',1, 0, GETDATE(), GETDATE())
	,(18,N'شبستر - تسوج',1, 0, GETDATE(), GETDATE())
	,(19,N'شبستر - صوفیان',1, 0, GETDATE(), GETDATE())
	,(20,N'عجب‌شیر',1, 0, GETDATE(), GETDATE())
	,(21,N'عجب‌شیر - قلعه چای',1, 0, GETDATE(), GETDATE())
	,(22,N'کلیبر',1, 0, GETDATE(), GETDATE())
	,(23,N'کلیبر - آبش احمد',1, 0, GETDATE(), GETDATE())
	,(24,N'کلیبر - خدا آفرین',1, 0, GETDATE(), GETDATE())
	,(25,N'مراغه',1, 0, GETDATE(), GETDATE())
	,(26,N'مراغه - سراجو',1, 0, GETDATE(), GETDATE())
	,(27,N'مرند',1, 0, GETDATE(), GETDATE())
	,(28,N'مرند - یامچی',1, 0, GETDATE(), GETDATE())
	,(29,N'ملکان',1, 0, GETDATE(), GETDATE())
	,(30,N'ملکان - لیلان',1, 0, GETDATE(), GETDATE())
	,(31,N'ممقان',1, 0, GETDATE(), GETDATE())
	,(32,N'ممقان - حومه',1, 0, GETDATE(), GETDATE())
	,(33,N'ممقان - گوگان',1, 0, GETDATE(), GETDATE())
	,(34,N'میانه',1, 0, GETDATE(), GETDATE())
	,(35,N'میانه - ترکمانچای',1, 0, GETDATE(), GETDATE())
	,(36,N'میانه - کاغذکنان',1, 0, GETDATE(), GETDATE())
	,(37,N'میانه - کندوان',1, 0, GETDATE(), GETDATE())
	,(38,N'ورزقان',1, 0, GETDATE(), GETDATE())
	,(39,N'ورزقان - خاروانا',1, 0, GETDATE(), GETDATE())
	,(40,N'هریس',1, 0, GETDATE(), GETDATE())
	,(41,N'هریس - خواجه',1, 0, GETDATE(), GETDATE())
	,(42,N'هشترود',1, 0, GETDATE(), GETDATE())
	,(43,N'هشترود - نظر کهریزی',1, 0, GETDATE(), GETDATE())
	,(44,N'ارومیه',2, 0, GETDATE(), GETDATE())
	,(45,N'ارومیه - انزل',2, 0, GETDATE(), GETDATE())
	,(46,N'ارومیه - سیلوانه',2, 0, GETDATE(), GETDATE())
	,(47,N'ارومیه - صومای برادوست',2, 0, GETDATE(), GETDATE())
	,(48,N'ارومیه - نازلو',2, 0, GETDATE(), GETDATE())
	,(49,N'اشنویه',2, 0, GETDATE(), GETDATE())
	,(50,N'اشنویه - نالوس',2, 0, GETDATE(), GETDATE())
	,(51,N'بوکان',2, 0, GETDATE(), GETDATE())
	,(52,N'بوکان - سیمینه',2, 0, GETDATE(), GETDATE())
	,(53,N'پلدشت',2, 0, GETDATE(), GETDATE())
	,(54,N'پلدشت - ارس',2, 0, GETDATE(), GETDATE())
	,(55,N'پیرانشهر',2, 0, GETDATE(), GETDATE())
	,(56,N'پیرانشهر - لاجان',2, 0, GETDATE(), GETDATE())
	,(57,N'تکاب',2, 0, GETDATE(), GETDATE())
	,(58,N'تکاب - تخت سلیمان',2, 0, GETDATE(), GETDATE())
	,(59,N'چالدران',2, 0, GETDATE(), GETDATE())
	,(60,N'چالدران - دشتک',2, 0, GETDATE(), GETDATE())
	,(61,N'چایپاره',2, 0, GETDATE(), GETDATE())
	,(62,N'چایپاره - حاجیلار',2, 0, GETDATE(), GETDATE())
	,(63,N'خوی',2, 0, GETDATE(), GETDATE())
	,(64,N'خوی - ایواوغلی',2, 0, GETDATE(), GETDATE())
	,(65,N'خوی - صفائیه',2, 0, GETDATE(), GETDATE())
	,(66,N'خوی - قطور',2, 0, GETDATE(), GETDATE())
	,(67,N'سردشت',2, 0, GETDATE(), GETDATE())
	,(68,N'سردشت - وزینه',2, 0, GETDATE(), GETDATE())
	,(69,N'سلماس',2, 0, GETDATE(), GETDATE())
	,(70,N'سلماس - کوهسار',2, 0, GETDATE(), GETDATE())
	,(71,N'شاهین‌دژ',2, 0, GETDATE(), GETDATE())
	,(72,N'شاهین‌دژ - کشاورز',2, 0, GETDATE(), GETDATE())
	,(73,N'شوط',2, 0, GETDATE(), GETDATE())
	,(74,N'شوط - قره قویون',2, 0, GETDATE(), GETDATE())
	,(75,N'ماکو',2, 0, GETDATE(), GETDATE())
	,(76,N'ماکو - بازرگان',2, 0, GETDATE(), GETDATE())
	,(77,N'مهاباد',2, 0, GETDATE(), GETDATE())
	,(78,N'مهاباد - خلیفان',2, 0, GETDATE(), GETDATE())
	,(79,N'میاندوآب',2, 0, GETDATE(), GETDATE())
	,(80,N'میاندوآب - باروق',2, 0, GETDATE(), GETDATE())
	,(81,N'میاندوآب - مرحمت آباد',2, 0, GETDATE(), GETDATE())
	,(82,N'نقده',2, 0, GETDATE(), GETDATE())
	,(83,N'نقده - محمدیار',2, 0, GETDATE(), GETDATE())
	,(84,N'اردبیل',3, 0, GETDATE(), GETDATE())
	,(85,N'اردبیل - ثمرین',3, 0, GETDATE(), GETDATE())
	,(86,N'اردبیل - هیر',3, 0, GETDATE(), GETDATE())
	,(87,N'بیله سوار',3, 0, GETDATE(), GETDATE())
	,(88,N'بیله سوار - قشلاق دشت',3, 0, GETDATE(), GETDATE())
	,(89,N'پارس‌آباد',3, 0, GETDATE(), GETDATE())
	,(90,N'پارس‌آباد - اصلاندوز',3, 0, GETDATE(), GETDATE())
	,(91,N'پارس‌آباد - تازه کند',3, 0, GETDATE(), GETDATE())
	,(92,N'خلخال',3, 0, GETDATE(), GETDATE())
	,(93,N'خلخال - خورش رستم',3, 0, GETDATE(), GETDATE())
	,(94,N'خلخال - شاهرود',3, 0, GETDATE(), GETDATE())
	,(95,N'سرعین',3, 0, GETDATE(), GETDATE())
	,(96,N'سرعین - سبلان',3, 0, GETDATE(), GETDATE())
	,(97,N'کوثر',3, 0, GETDATE(), GETDATE())
	,(98,N'کوثر - فیروز',3, 0, GETDATE(), GETDATE())
	,(99,N'گرمی',3, 0, GETDATE(), GETDATE())
	,(100,N'گرمی - انگوت',3, 0, GETDATE(), GETDATE())
	,(101,N'گرمی - موران',3, 0, GETDATE(), GETDATE())
	,(102,N'مشگین‌شهر',3, 0, GETDATE(), GETDATE())
	,(103,N'مشگین‌شهر - ارشق',3, 0, GETDATE(), GETDATE())
	,(104,N'مشگین‌شهر - مرادلو',3, 0, GETDATE(), GETDATE())
	,(105,N'مشگین‌شهر - مشگین شرقی',3, 0, GETDATE(), GETDATE())
	,(106,N'نمین',3, 0, GETDATE(), GETDATE())
	,(107,N'نمین - عنبران',3, 0, GETDATE(), GETDATE())
	,(108,N'نمین - ویلکیج',3, 0, GETDATE(), GETDATE())
	,(109,N'نیر',3, 0, GETDATE(), GETDATE())
	,(110,N'نیر - کوراییم',3, 0, GETDATE(), GETDATE())
	,(111,N'اصفهان',4, 1, GETDATE(), GETDATE())
	,(112,N'اصفهان - بن رود',4, 0, GETDATE(), GETDATE())
	,(113,N'اصفهان - بهارستان',4, 0, GETDATE(), GETDATE())
	,(114,N'اصفهان - جرقویه سفلی',4, 0, GETDATE(), GETDATE())
	,(115,N'اصفهان - جرقویه علیا',4, 0, GETDATE(), GETDATE())
	,(116,N'اصفهان - جلگه',4, 0, GETDATE(), GETDATE())
	,(117,N'اصفهان - سپاهان شهر',4, 0, GETDATE(), GETDATE())
	,(118,N'اصفهان - قهجاورستان',4, 0, GETDATE(), GETDATE())
	,(119,N'اصفهان - کوهپایه',4, 0, GETDATE(), GETDATE())
	,(120,N'آران و بیدگل',4, 0, GETDATE(), GETDATE())
	,(121,N'آران و بیدگل - کویرات',4, 0, GETDATE(), GETDATE())
	,(122,N'اردستان',4, 0, GETDATE(), GETDATE())
	,(123,N'اردستان - زواره',4, 0, GETDATE(), GETDATE())
	,(124,N'برخوار',4, 0, GETDATE(), GETDATE())
	,(125,N'برخوار - حبیب آباد',4, 0, GETDATE(), GETDATE())
	,(126,N'تیران و کرون',4, 0, GETDATE(), GETDATE())
	,(127,N'تیران و کرون - کرون',4, 0, GETDATE(), GETDATE())
	,(128,N'چادگان',4, 0, GETDATE(), GETDATE())
	,(129,N'چادگان - چنارود',4, 0, GETDATE(), GETDATE())
	,(130,N'خمینی‌شهر',4, 0, GETDATE(), GETDATE())
	,(131,N'خوانسار',4, 0, GETDATE(), GETDATE())
	,(132,N'خور و بیابانک',4, 0, GETDATE(), GETDATE())
	,(133,N'دهاقان',4, 0, GETDATE(), GETDATE())
	,(134,N'سمیرم',4, 0, GETDATE(), GETDATE())
	,(135,N'سمیرم - پادنا',4, 0, GETDATE(), GETDATE())
	,(136,N'شاهین‌شهر',4, 0, GETDATE(), GETDATE())
	,(137,N'شاهین‌شهر - میمه',4, 0, GETDATE(), GETDATE())
	,(138,N'شهرضا',4, 0, GETDATE(), GETDATE())
	,(139,N'فریدن',4, 0, GETDATE(), GETDATE())
	,(140,N'فریدن - بوئین و میاندشت',4, 0, GETDATE(), GETDATE())
	,(141,N'فریدونشهر',4, 0, GETDATE(), GETDATE())
	,(142,N'فلاورجان',4, 0, GETDATE(), GETDATE())
	,(143,N'فلاورجان - پیربکران',4, 0, GETDATE(), GETDATE())
	,(144,N'کاشان',4, 0, GETDATE(), GETDATE())
	,(145,N'کاشان - برزک',4, 0, GETDATE(), GETDATE())
	,(146,N'کاشان - قمصر',4, 0, GETDATE(), GETDATE())
	,(147,N'کاشان - نیاسر',4, 0, GETDATE(), GETDATE())
	,(148,N'گلپایگان',4, 0, GETDATE(), GETDATE())
	,(149,N'لنجان',4, 0, GETDATE(), GETDATE())
	,(150,N'لنجان - باغ بهادران',4, 0, GETDATE(), GETDATE())
	,(151,N'لنجان - فولادشهر',4, 0, GETDATE(), GETDATE())
	,(152,N'مبارکه',4, 0, GETDATE(), GETDATE())
	,(153,N'مبارکه - گرکن جنوبی',4, 0, GETDATE(), GETDATE())
	,(154,N'نائین',4, 0, GETDATE(), GETDATE())
	,(155,N'نائین - انارک',4, 0, GETDATE(), GETDATE())
	,(156,N'نجف‌آباد',4, 0, GETDATE(), GETDATE())
	,(157,N'نجف‌آباد - مهردشت',4, 0, GETDATE(), GETDATE())
	,(158,N'نطنز',4, 0, GETDATE(), GETDATE())
	,(159,N'نطنز - امام زاده',4, 0, GETDATE(), GETDATE())
	,(160,N'کرج',5, 1, GETDATE(), GETDATE())
	,(161,N'کرج - آسارا',5, 0, GETDATE(), GETDATE())
	,(162,N'کرج - اشتهارد',5, 0, GETDATE(), GETDATE())
	,(163,N'کرج - ماهدشت',5, 0, GETDATE(), GETDATE())
	,(164,N'کرج - محمدشهر',5, 0, GETDATE(), GETDATE())
	,(165,N'طالقان',5, 0, GETDATE(), GETDATE())
	,(166,N'طالقان - بالا طالقان',5, 0, GETDATE(), GETDATE())
	,(167,N'نظرآباد',5, 0, GETDATE(), GETDATE())
	,(168,N'نظرآباد - تنکمان',5, 0, GETDATE(), GETDATE())
	,(169,N'هشتگرد',5, 0, GETDATE(), GETDATE())
	,(170,N'هشتگرد - چندار',5, 0, GETDATE(), GETDATE())
	,(171,N'هشتگرد - چهارباغ',5, 0, GETDATE(), GETDATE())
	,(172,N'ایلام',6, 0, GETDATE(), GETDATE())
	,(173,N'ایلام - چوار',6, 0, GETDATE(), GETDATE())
	,(174,N'آبدانان',6, 0, GETDATE(), GETDATE())
	,(175,N'آبدانان - سراب باغ',6, 0, GETDATE(), GETDATE())
	,(176,N'آبدانان - کلات',6, 0, GETDATE(), GETDATE())
	,(177,N'ایوان',6, 0, GETDATE(), GETDATE())
	,(178,N'ایوان - زرنه',6, 0, GETDATE(), GETDATE())
	,(179,N'دره شهر',6, 0, GETDATE(), GETDATE())
	,(180,N'دره شهر - بدره',6, 0, GETDATE(), GETDATE())
	,(181,N'دره شهر - ماژین',6, 0, GETDATE(), GETDATE())
	,(182,N'دهلران',6, 0, GETDATE(), GETDATE())
	,(183,N'دهلران - زرین آباد',6, 0, GETDATE(), GETDATE())
	,(184,N'دهلران - موسیان',6, 0, GETDATE(), GETDATE())
	,(185,N'شیروان  چرداول',6, 0, GETDATE(), GETDATE())
	,(186,N'شیروان  چرداول - شیروان',6, 0, GETDATE(), GETDATE())
	,(187,N'شیروان  چرداول - هلیلان',6, 0, GETDATE(), GETDATE())
	,(188,N'ملکشاهی',6, 0, GETDATE(), GETDATE())
	,(189,N'ملکشاهی - گچی',6, 0, GETDATE(), GETDATE())
	,(190,N'مهران',6, 0, GETDATE(), GETDATE())
	,(191,N'مهران - صالح آباد',6, 0, GETDATE(), GETDATE())
	,(192,N'بوشهر',7, 0, GETDATE(), GETDATE())
	,(193,N'بوشهر - خارک',7, 0, GETDATE(), GETDATE())
	,(194,N'تنگستان',7, 0, GETDATE(), GETDATE())
	,(195,N'تنگستان - دلوار',7, 0, GETDATE(), GETDATE())
	,(196,N'جم',7, 0, GETDATE(), GETDATE())
	,(197,N'جم - ریز',7, 0, GETDATE(), GETDATE())
	,(198,N'دشتستان',7, 0, GETDATE(), GETDATE())
	,(199,N'دشتستان - آبپخش',7, 0, GETDATE(), GETDATE())
	,(200,N'دشتستان - ارم',7, 0, GETDATE(), GETDATE())
	,(201,N'دشتستان - بوشکان',7, 0, GETDATE(), GETDATE())
	,(202,N'دشتستان - سعدآباد',7, 0, GETDATE(), GETDATE())
	,(203,N'دشتستان - شبانکاره',7, 0, GETDATE(), GETDATE())
	,(204,N'دشتی',7, 0, GETDATE(), GETDATE())
	,(205,N'دشتی - شنبه و طسوج',7, 0, GETDATE(), GETDATE())
	,(206,N'دشتی - کاکی',7, 0, GETDATE(), GETDATE())
	,(207,N'دیر',7, 0, GETDATE(), GETDATE())
	,(208,N'دیر - بردخون',7, 0, GETDATE(), GETDATE())
	,(209,N'دیلم',7, 0, GETDATE(), GETDATE())
	,(210,N'دیلم - امام حسن',7, 0, GETDATE(), GETDATE())
	,(211,N'کنگان',7, 0, GETDATE(), GETDATE())
	,(212,N'کنگان - عسلویه',7, 0, GETDATE(), GETDATE())
	,(213,N'گناوه',7, 0, GETDATE(), GETDATE())
	,(214,N'گناوه - ریگ',7, 0, GETDATE(), GETDATE())
	,(215,N'تهران',8, 1, GETDATE(), GETDATE())
	,(216,N'تهران - آفتاب',8, 0, GETDATE(), GETDATE())
	,(217,N'تهران - بومهن',8, 0, GETDATE(), GETDATE())
	,(218,N'تهران - پردیس',8, 0, GETDATE(), GETDATE())
	,(219,N'تهران - کن',8, 0, GETDATE(), GETDATE())
	,(220,N'اسلام‌شهر',8, 0, GETDATE(), GETDATE())
	,(221,N'اسلام‌شهر - چهاردانگه',8, 0, GETDATE(), GETDATE())
	,(222,N'پاکدشت',8, 0, GETDATE(), GETDATE())
	,(223,N'پاکدشت - شریف آباد',8, 0, GETDATE(), GETDATE())
	,(224,N'دماوند',8, 0, GETDATE(), GETDATE())
	,(225,N'دماوند - رودهن',8, 0, GETDATE(), GETDATE())
	,(226,N'رباط کریم',8, 0, GETDATE(), GETDATE())
	,(227,N'رباط کریم - بوستان',8, 0, GETDATE(), GETDATE())
	,(228,N'رباط کریم - پرند',8, 0, GETDATE(), GETDATE())
	,(229,N'رباط کریم - صالح‌آباد',8, 0, GETDATE(), GETDATE())
	,(230,N'رباط کریم - گلستان',8, 0, GETDATE(), GETDATE())
	,(231,N'رباط کریم - نصیرآباد',8, 0, GETDATE(), GETDATE())
	,(232,N'ری',8, 0, GETDATE(), GETDATE())
	,(233,N'ری - حسن‌آباد',8, 0, GETDATE(), GETDATE())
	,(234,N'ری - خاوران',8, 0, GETDATE(), GETDATE())
	,(235,N'ری - کهریزک',8, 0, GETDATE(), GETDATE())
	,(236,N'شهریار',8, 0, GETDATE(), GETDATE())
	,(237,N'شهریار - اندیشه',8, 0, GETDATE(), GETDATE())
	,(238,N'فيروزکوه',8, 0, GETDATE(), GETDATE())
	,(239,N'فيروزکوه - ارجمند',8, 0, GETDATE(), GETDATE())
	,(240,N'قدس',8, 0, GETDATE(), GETDATE())
	,(241,N'لواسان',8, 0, GETDATE(), GETDATE())
	,(242,N'لواسان - فشم',8, 0, GETDATE(), GETDATE())
	,(243,N'ملارد',8, 0, GETDATE(), GETDATE())
	,(244,N'ملارد - صفا دشت',8, 0, GETDATE(), GETDATE())
	,(245,N'ورامین',8, 0, GETDATE(), GETDATE())
	,(246,N'ورامین - پیشوا',8, 0, GETDATE(), GETDATE())
	,(247,N'ورامین - جوادآباد',8, 0, GETDATE(), GETDATE())
	,(248,N'ورامین - قرچک',8, 0, GETDATE(), GETDATE())
	,(249,N'شهرکرد',9, 0, GETDATE(), GETDATE())
	,(250,N'شهرکرد - بن',9, 0, GETDATE(), GETDATE())
	,(251,N'شهرکرد - سامان',9, 0, GETDATE(), GETDATE())
	,(252,N'شهرکرد - لاران',9, 0, GETDATE(), GETDATE())
	,(253,N'اردل',9, 0, GETDATE(), GETDATE())
	,(254,N'اردل - میانکوه',9, 0, GETDATE(), GETDATE())
	,(255,N'بروجن',9, 0, GETDATE(), GETDATE())
	,(256,N'بروجن - بلداجی',9, 0, GETDATE(), GETDATE())
	,(257,N'بروجن - گندمان',9, 0, GETDATE(), GETDATE())
	,(258,N'فارسان',9, 0, GETDATE(), GETDATE())
	,(259,N'کوهرنگ',9, 0, GETDATE(), GETDATE())
	,(260,N'کوهرنگ - بازفت',9, 0, GETDATE(), GETDATE())
	,(261,N'کوهرنگ - دو آب صمصامی',9, 0, GETDATE(), GETDATE())
	,(262,N'کیار',9, 0, GETDATE(), GETDATE())
	,(263,N'کیار - ناغان',9, 0, GETDATE(), GETDATE())
	,(264,N'لردگان',9, 0, GETDATE(), GETDATE())
	,(265,N'لردگان - خانمیرزا',9, 0, GETDATE(), GETDATE())
	,(266,N'لردگان - فلارد',9, 0, GETDATE(), GETDATE())
	,(267,N'لردگان - منج',9, 0, GETDATE(), GETDATE())
	,(268,N'بیرجند',10, 0, GETDATE(), GETDATE())
	,(269,N'بیرجند - خوسف',10, 0, GETDATE(), GETDATE())
	,(270,N'آیسک',10, 0, GETDATE(), GETDATE())
	,(271,N'آیسک - سه قلعه',10, 0, GETDATE(), GETDATE())
	,(272,N'بشرویه',10, 0, GETDATE(), GETDATE())
	,(273,N'بشرویه - ارسک',10, 0, GETDATE(), GETDATE())
	,(274,N'درمیان',10, 0, GETDATE(), GETDATE())
	,(275,N'درمیان - قهستان',10, 0, GETDATE(), GETDATE())
	,(276,N'درمیان - گزیک',10, 0, GETDATE(), GETDATE())
	,(277,N'سربیشه',10, 0, GETDATE(), GETDATE())
	,(278,N'سربیشه - مود',10, 0, GETDATE(), GETDATE())
	,(279,N'فردوس',10, 0, GETDATE(), GETDATE())
	,(280,N'قائنات',10, 0, GETDATE(), GETDATE())
	,(281,N'قائنات - زهان',10, 0, GETDATE(), GETDATE())
	,(282,N'قائنات - زیرکوه',10, 0, GETDATE(), GETDATE())
	,(283,N'قائنات - سده',10, 0, GETDATE(), GETDATE())
	,(284,N'قائنات - نیمبلوک',10, 0, GETDATE(), GETDATE())
	,(285,N'نهبندان',10, 0, GETDATE(), GETDATE())
	,(286,N'نهبندان - شوسف',10, 0, GETDATE(), GETDATE())
	,(287,N'مشهد',11, 1, GETDATE(), GETDATE())
	,(288,N'مشهد - احمد آباد',11, 0, GETDATE(), GETDATE())
	,(289,N'مشهد - رضویه',11, 0, GETDATE(), GETDATE())
	,(290,N'باخرز',11, 0, GETDATE(), GETDATE())
	,(291,N'باخرز - بالاولایت',11, 0, GETDATE(), GETDATE())
	,(292,N'بجستان',11, 0, GETDATE(), GETDATE())
	,(293,N'بجستان - یونسی',11, 0, GETDATE(), GETDATE())
	,(294,N'بردسکن',11, 0, GETDATE(), GETDATE())
	,(295,N'بردسکن - انابد',11, 0, GETDATE(), GETDATE())
	,(296,N'بردسکن - شهر آباد',11, 0, GETDATE(), GETDATE())
	,(297,N'تایباد',11, 0, GETDATE(), GETDATE())
	,(298,N'تایباد - میان ولایت',11, 0, GETDATE(), GETDATE())
	,(299,N'تخت جلگه',11, 0, GETDATE(), GETDATE())
	,(300,N'تخت جلگه - طاغنکوه',11, 0, GETDATE(), GETDATE())
	,(301,N'تربت جام',11, 0, GETDATE(), GETDATE())
	,(302,N'تربت جام - بوژگان',11, 0, GETDATE(), GETDATE())
	,(303,N'تربت جام - پائین جام',11, 0, GETDATE(), GETDATE())
	,(304,N'تربت جام - صالح آباد',11, 0, GETDATE(), GETDATE())
	,(305,N'تربت جام - نصرآباد',11, 0, GETDATE(), GETDATE())
	,(306,N'تربت حیدریه',11, 0, GETDATE(), GETDATE())
	,(307,N'تربت حیدریه - بایک',11, 0, GETDATE(), GETDATE())
	,(308,N'تربت حیدریه - جلگه رخ',11, 0, GETDATE(), GETDATE())
	,(309,N'تربت حیدریه - کدکن',11, 0, GETDATE(), GETDATE())
	,(310,N'جغتای',11, 0, GETDATE(), GETDATE())
	,(311,N'جغتای - هلالی',11, 0, GETDATE(), GETDATE())
	,(312,N'جوین',11, 0, GETDATE(), GETDATE())
	,(313,N'جوین - عطاملک',11, 0, GETDATE(), GETDATE())
	,(314,N'چناران',11, 0, GETDATE(), GETDATE())
	,(315,N'چناران - گلبهار',11, 0, GETDATE(), GETDATE())
	,(316,N'خلیل آباد',11, 0, GETDATE(), GETDATE())
	,(317,N'خلیل آباد - ششطراز',11, 0, GETDATE(), GETDATE())
	,(318,N'خواف',11, 0, GETDATE(), GETDATE())
	,(319,N'خواف - جلگه زوزن',11, 0, GETDATE(), GETDATE())
	,(320,N'خواف - سلامی',11, 0, GETDATE(), GETDATE())
	,(321,N'خواف - سنگان',11, 0, GETDATE(), GETDATE())
	,(322,N'خوشاب',11, 0, GETDATE(), GETDATE())
	,(323,N'خوشاب - مشکان',11, 0, GETDATE(), GETDATE())
	,(324,N'درگز',11, 0, GETDATE(), GETDATE())
	,(325,N'درگز - چاپشلو',11, 0, GETDATE(), GETDATE())
	,(326,N'درگز - لطف آباد',11, 0, GETDATE(), GETDATE())
	,(327,N'درگز - نوخندان',11, 0, GETDATE(), GETDATE())
	,(328,N'رشتخوار',11, 0, GETDATE(), GETDATE())
	,(329,N'رشتخوار - جنگل',11, 0, GETDATE(), GETDATE())
	,(330,N'زاوه',11, 0, GETDATE(), GETDATE())
	,(331,N'زاوه - سلیمان',11, 0, GETDATE(), GETDATE())
	,(332,N'سبزوار',11, 0, GETDATE(), GETDATE())
	,(333,N'سبزوار - داورزن',11, 0, GETDATE(), GETDATE())
	,(334,N'سبزوار - روداب',11, 0, GETDATE(), GETDATE())
	,(335,N'سبزوار - ششتمد',11, 0, GETDATE(), GETDATE())
	,(336,N'سرخس',11, 0, GETDATE(), GETDATE())
	,(337,N'سرخس - مرزداران',11, 0, GETDATE(), GETDATE())
	,(338,N'شانديز',11, 0, GETDATE(), GETDATE())
	,(339,N'شانديز - طرقبه',11, 0, GETDATE(), GETDATE())
	,(340,N'فریمان',11, 0, GETDATE(), GETDATE())
	,(341,N'فریمان - قلندرآباد',11, 0, GETDATE(), GETDATE())
	,(342,N'قوچان',11, 0, GETDATE(), GETDATE())
	,(343,N'قوچان - باجگیران',11, 0, GETDATE(), GETDATE())
	,(344,N'کاشمر',11, 0, GETDATE(), GETDATE())
	,(345,N'کاشمر - کوهسرخ',11, 0, GETDATE(), GETDATE())
	,(346,N'کلات',11, 0, GETDATE(), GETDATE())
	,(347,N'کلات - زاوین',11, 0, GETDATE(), GETDATE())
	,(348,N'گناباد',11, 0, GETDATE(), GETDATE())
	,(349,N'گناباد - کاخک',11, 0, GETDATE(), GETDATE())
	,(350,N'مه ولات',11, 0, GETDATE(), GETDATE())
	,(351,N'مه ولات - شادمهر',11, 0, GETDATE(), GETDATE())
	,(352,N'نیشابور',11, 0, GETDATE(), GETDATE())
	,(353,N'نیشابور - زبرخان',11, 0, GETDATE(), GETDATE())
	,(354,N'نیشابور - سر ولایت',11, 0, GETDATE(), GETDATE())
	,(355,N'نیشابور - میان جلگه',11, 0, GETDATE(), GETDATE())
	,(356,N'بجنورد',12, 0, GETDATE(), GETDATE())
	,(357,N'بجنورد - راز و جرگلان',12, 0, GETDATE(), GETDATE())
	,(358,N'بجنورد - گرمخان',12, 0, GETDATE(), GETDATE())
	,(359,N'اسفراین',12, 0, GETDATE(), GETDATE())
	,(360,N'اسفراین - بام و صفی آباد',12, 0, GETDATE(), GETDATE())
	,(361,N'جاجرم',12, 0, GETDATE(), GETDATE())
	,(362,N'جاجرم - جلگه سنخواست',12, 0, GETDATE(), GETDATE())
	,(363,N'جاجرم - جلگه شوقان',12, 0, GETDATE(), GETDATE())
	,(364,N'شیروان',12, 0, GETDATE(), GETDATE())
	,(365,N'شیروان - سرحد',12, 0, GETDATE(), GETDATE())
	,(366,N'شیروان - قوشخانه',12, 0, GETDATE(), GETDATE())
	,(367,N'فاروج',12, 0, GETDATE(), GETDATE())
	,(368,N'فاروج - خبوشان',12, 0, GETDATE(), GETDATE())
	,(369,N'گرمه',12, 0, GETDATE(), GETDATE())
	,(370,N'مانه و سملقان',12, 0, GETDATE(), GETDATE())
	,(371,N'مانه و سملقان - سملقان',12, 0, GETDATE(), GETDATE())
	,(372,N'مانه و سملقان - مانه',12, 0, GETDATE(), GETDATE())
	,(373,N'اهواز',13, 0, GETDATE(), GETDATE())
	,(374,N'اهواز - حمیدیه',13, 0, GETDATE(), GETDATE())
	,(375,N'آبادان',13, 0, GETDATE(), GETDATE())
	,(376,N'آبادان - اروندکنار',13, 0, GETDATE(), GETDATE())
	,(377,N'امیدیه',13, 0, GETDATE(), GETDATE())
	,(378,N'امیدیه - جایزان',13, 0, GETDATE(), GETDATE())
	,(379,N'اندیکا',13, 0, GETDATE(), GETDATE())
	,(380,N'اندیکا - آبژدان',13, 0, GETDATE(), GETDATE())
	,(381,N'اندیکا - چلو',13, 0, GETDATE(), GETDATE())
	,(382,N'اندیمشک',13, 0, GETDATE(), GETDATE())
	,(383,N'اندیمشک - الوار گرمسیری',13, 0, GETDATE(), GETDATE())
	,(384,N'ایذه',13, 0, GETDATE(), GETDATE())
	,(385,N'ایذه - دهدز',13, 0, GETDATE(), GETDATE())
	,(386,N'ایذه - سوسن',13, 0, GETDATE(), GETDATE())
	,(387,N'باغ‌ملک',13, 0, GETDATE(), GETDATE())
	,(388,N'باغ‌ملک - صیدون',13, 0, GETDATE(), GETDATE())
	,(389,N'باغ‌ملک - میداود',13, 0, GETDATE(), GETDATE())
	,(390,N'باوی',13, 0, GETDATE(), GETDATE())
	,(391,N'باوی - ویس',13, 0, GETDATE(), GETDATE())
	,(392,N'بندر ماهشهر',13, 0, GETDATE(), GETDATE())
	,(393,N'بندر ماهشهر - بندر امام خمینی',13, 0, GETDATE(), GETDATE())
	,(394,N'بهبهان',13, 0, GETDATE(), GETDATE())
	,(395,N'بهبهان - آغاجاری',13, 0, GETDATE(), GETDATE())
	,(396,N'بهبهان - تشان',13, 0, GETDATE(), GETDATE())
	,(397,N'بهبهان - زیدون',13, 0, GETDATE(), GETDATE())
	,(398,N'خرمشهر',13, 0, GETDATE(), GETDATE())
	,(399,N'خرمشهر - مینو',13, 0, GETDATE(), GETDATE())
	,(400,N'دزفول',13, 0, GETDATE(), GETDATE())
	,(401,N'دزفول - چغامیش',13, 0, GETDATE(), GETDATE())
	,(402,N'دزفول - سردشت',13, 0, GETDATE(), GETDATE())
	,(403,N'دزفول - شهیون',13, 0, GETDATE(), GETDATE())
	,(404,N'دشت آزادگان',13, 0, GETDATE(), GETDATE())
	,(405,N'دشت آزادگان - بستان',13, 0, GETDATE(), GETDATE())
	,(406,N'رامشیر',13, 0, GETDATE(), GETDATE())
	,(407,N'رامشیر - مشراگه',13, 0, GETDATE(), GETDATE())
	,(408,N'رامهرمز',13, 0, GETDATE(), GETDATE())
	,(409,N'شادگان',13, 0, GETDATE(), GETDATE())
	,(410,N'شادگان - خنافره',13, 0, GETDATE(), GETDATE())
	,(411,N'شوش',13, 0, GETDATE(), GETDATE())
	,(412,N'شوش - شاوور',13, 0, GETDATE(), GETDATE())
	,(413,N'شوش - فتح المبین',13, 0, GETDATE(), GETDATE())
	,(414,N'شوشتر',13, 0, GETDATE(), GETDATE())
	,(415,N'شوشتر - شعیبیه',13, 0, GETDATE(), GETDATE())
	,(416,N'گتوند',13, 0, GETDATE(), GETDATE())
	,(417,N'گتوند - عقیلی',13, 0, GETDATE(), GETDATE())
	,(418,N'لالی',13, 0, GETDATE(), GETDATE())
	,(419,N'لالی - حتی',13, 0, GETDATE(), GETDATE())
	,(420,N'مسجدسلیمان',13, 0, GETDATE(), GETDATE())
	,(421,N'مسجدسلیمان - گلگیر',13, 0, GETDATE(), GETDATE())
	,(422,N'هفتگل',13, 0, GETDATE(), GETDATE())
	,(423,N'هفتگل - رغیوه',13, 0, GETDATE(), GETDATE())
	,(424,N'هندیجان',13, 0, GETDATE(), GETDATE())
	,(425,N'هندیجان - چم خلف عیسی',13, 0, GETDATE(), GETDATE())
	,(426,N'هویزه',13, 0, GETDATE(), GETDATE())
	,(427,N'هویزه - نیسان',13, 0, GETDATE(), GETDATE())
	,(428,N'زنجان',14, 0, GETDATE(), GETDATE())
	,(429,N'زنجان - زنجانرود',14, 0, GETDATE(), GETDATE())
	,(430,N'زنجان - قره پشتلو',14, 0, GETDATE(), GETDATE())
	,(431,N'ابهر',14, 0, GETDATE(), GETDATE())
	,(432,N'ابهر - سلطانیه',14, 0, GETDATE(), GETDATE())
	,(433,N'ایجرود',14, 0, GETDATE(), GETDATE())
	,(434,N'ایجرود - حلب',14, 0, GETDATE(), GETDATE())
	,(435,N'خدابنده',14, 0, GETDATE(), GETDATE())
	,(436,N'خدابنده - افشار',14, 0, GETDATE(), GETDATE())
	,(437,N'خدابنده - بزینه رود',14, 0, GETDATE(), GETDATE())
	,(438,N'خدابنده - سجاس رود',14, 0, GETDATE(), GETDATE())
	,(439,N'خرمدره',14, 0, GETDATE(), GETDATE())
	,(440,N'طارم',14, 0, GETDATE(), GETDATE())
	,(441,N'طارم - چورزق',14, 0, GETDATE(), GETDATE())
	,(442,N'ماه نشان',14, 0, GETDATE(), GETDATE())
	,(443,N'ماه نشان - انگوران',14, 0, GETDATE(), GETDATE())
	,(444,N'سمنان',15, 0, GETDATE(), GETDATE())
	,(445,N'سمنان - سرخه',15, 0, GETDATE(), GETDATE())
	,(446,N'دامغان',15, 0, GETDATE(), GETDATE())
	,(447,N'دامغان - امیرآباد',15, 0, GETDATE(), GETDATE())
	,(448,N'شاهرود',15, 0, GETDATE(), GETDATE())
	,(449,N'شاهرود - بسطام',15, 0, GETDATE(), GETDATE())
	,(450,N'شاهرود - بیارجمند',15, 0, GETDATE(), GETDATE())
	,(451,N'شاهرود - میامی',15, 0, GETDATE(), GETDATE())
	,(452,N'گرمسار',15, 0, GETDATE(), GETDATE())
	,(453,N'گرمسار - آرادان',15, 0, GETDATE(), GETDATE())
	,(454,N'گرمسار - ایوانکی',15, 0, GETDATE(), GETDATE())
	,(455,N'مهدی‌شهر',15, 0, GETDATE(), GETDATE())
	,(456,N'مهدی‌شهر - شهمیرزاد',15, 0, GETDATE(), GETDATE())
	,(457,N'زاهدان',16, 0, GETDATE(), GETDATE())
	,(458,N'زاهدان - کورین',16, 0, GETDATE(), GETDATE())
	,(459,N'زاهدان - میرجاوه',16, 0, GETDATE(), GETDATE())
	,(460,N'زاهدان - نصرت آباد',16, 0, GETDATE(), GETDATE())
	,(461,N'ایرانشهر',16, 0, GETDATE(), GETDATE())
	,(462,N'ایرانشهر - بزمان',16, 0, GETDATE(), GETDATE())
	,(463,N'ایرانشهر - بمپور',16, 0, GETDATE(), GETDATE())
	,(464,N'چهابهار',16, 0, GETDATE(), GETDATE())
	,(465,N'چهابهار - پلان',16, 0, GETDATE(), GETDATE())
	,(466,N'چهابهار - دشتیاری',16, 0, GETDATE(), GETDATE())
	,(467,N'خاش',16, 0, GETDATE(), GETDATE())
	,(468,N'خاش - ایرندگان',16, 0, GETDATE(), GETDATE())
	,(469,N'خاش - نوک آباد',16, 0, GETDATE(), GETDATE())
	,(470,N'دلگان',16, 0, GETDATE(), GETDATE())
	,(471,N'دلگان - جلگه چاه هاشم',16, 0, GETDATE(), GETDATE())
	,(472,N'زابل',16, 0, GETDATE(), GETDATE())
	,(473,N'زابل - پشت آب',16, 0, GETDATE(), GETDATE())
	,(474,N'زابل - شیب آب',16, 0, GETDATE(), GETDATE())
	,(475,N'زابلی',16, 0, GETDATE(), GETDATE())
	,(476,N'زابلی - آشار',16, 0, GETDATE(), GETDATE())
	,(477,N'زهک',16, 0, GETDATE(), GETDATE())
	,(478,N'زهک - جزینک',16, 0, GETDATE(), GETDATE())
	,(479,N'سراوان',16, 0, GETDATE(), GETDATE())
	,(480,N'سراوان - بم پشت',16, 0, GETDATE(), GETDATE())
	,(481,N'سراوان - جالق',16, 0, GETDATE(), GETDATE())
	,(482,N'سرباز',16, 0, GETDATE(), GETDATE())
	,(483,N'سرباز - پارود',16, 0, GETDATE(), GETDATE())
	,(484,N'سرباز - پیشین',16, 0, GETDATE(), GETDATE())
	,(485,N'سرباز - سرباز',16, 0, GETDATE(), GETDATE())
	,(486,N'سیب سوران',16, 0, GETDATE(), GETDATE())
	,(487,N'سیب سوران - هیدوچ',16, 0, GETDATE(), GETDATE())
	,(488,N'کنارک',16, 0, GETDATE(), GETDATE())
	,(489,N'کنارک - زر آباد',16, 0, GETDATE(), GETDATE())
	,(490,N'نیک شهر',16, 0, GETDATE(), GETDATE())
	,(491,N'نیک شهر - بنت',16, 0, GETDATE(), GETDATE())
	,(492,N'نیک شهر - فنوج',16, 0, GETDATE(), GETDATE())
	,(493,N'نیک شهر - قصر قند',16, 0, GETDATE(), GETDATE())
	,(494,N'نیک شهر - لاشار',16, 0, GETDATE(), GETDATE())
	,(495,N'هیرمند',16, 0, GETDATE(), GETDATE())
	,(496,N'هیرمند - قرقری',16, 0, GETDATE(), GETDATE())
	,(497,N'شیراز',17, 1, GETDATE(), GETDATE())
	,(498,N'شیراز - ارژن',17, 0, GETDATE(), GETDATE())
	,(499,N'شیراز - زرقان',17, 0, GETDATE(), GETDATE())
	,(500,N'شیراز - صدرا',17, 0, GETDATE(), GETDATE())
	,(501,N'شیراز - کربال',17, 0, GETDATE(), GETDATE())
	,(502,N'شیراز - کوار',17, 0, GETDATE(), GETDATE())
	,(503,N'آباده',17, 0, GETDATE(), GETDATE())
	,(504,N'ارسنجان',17, 0, GETDATE(), GETDATE())
	,(505,N'استهبان',17, 0, GETDATE(), GETDATE())
	,(506,N'استهبان - رونیز',17, 0, GETDATE(), GETDATE())
	,(507,N'اقلید',17, 0, GETDATE(), GETDATE())
	,(508,N'اقلید - حسن آباد',17, 0, GETDATE(), GETDATE())
	,(509,N'اقلید - سده',17, 0, GETDATE(), GETDATE())
	,(510,N'بوانات',17, 0, GETDATE(), GETDATE())
	,(511,N'بوانات - سرچهان',17, 0, GETDATE(), GETDATE())
	,(512,N'بوانات - مزایجان',17, 0, GETDATE(), GETDATE())
	,(513,N'پاسارگاد',17, 0, GETDATE(), GETDATE())
	,(514,N'پاسارگاد - پاسارگاد',17, 0, GETDATE(), GETDATE())
	,(515,N'جهرم',17, 0, GETDATE(), GETDATE())
	,(516,N'جهرم - خفر',17, 0, GETDATE(), GETDATE())
	,(517,N'جهرم - سیمکان',17, 0, GETDATE(), GETDATE())
	,(518,N'جهرم - کردیان',17, 0, GETDATE(), GETDATE())
	,(519,N'خرم بید',17, 0, GETDATE(), GETDATE())
	,(520,N'خرم بید - مشهد مرغاب',17, 0, GETDATE(), GETDATE())
	,(521,N'خنج',17, 0, GETDATE(), GETDATE())
	,(522,N'خنج - محمله',17, 0, GETDATE(), GETDATE())
	,(523,N'داراب',17, 0, GETDATE(), GETDATE())
	,(524,N'داراب - جنت',17, 0, GETDATE(), GETDATE())
	,(525,N'داراب - رستاق',17, 0, GETDATE(), GETDATE())
	,(526,N'داراب - فورگ',17, 0, GETDATE(), GETDATE())
	,(527,N'رستم',17, 0, GETDATE(), GETDATE())
	,(528,N'رستم - سورنا',17, 0, GETDATE(), GETDATE())
	,(529,N'زرین دشت',17, 0, GETDATE(), GETDATE())
	,(530,N'زرین دشت - ایزدخواست',17, 0, GETDATE(), GETDATE())
	,(531,N'سپیدان',17, 0, GETDATE(), GETDATE())
	,(532,N'سپیدان - بیضا',17, 0, GETDATE(), GETDATE())
	,(533,N'سپیدان - همایجان',17, 0, GETDATE(), GETDATE())
	,(534,N'سروستان',17, 0, GETDATE(), GETDATE())
	,(535,N'سروستان - کوهنجان',17, 0, GETDATE(), GETDATE())
	,(536,N'فراشبند',17, 0, GETDATE(), GETDATE())
	,(537,N'فراشبند - دهرم',17, 0, GETDATE(), GETDATE())
	,(538,N'فسا',17, 0, GETDATE(), GETDATE())
	,(539,N'فسا - ششده و قره بلاغ',17, 0, GETDATE(), GETDATE())
	,(540,N'فسا - شیبکوه',17, 0, GETDATE(), GETDATE())
	,(541,N'فسا - نوبندگان',17, 0, GETDATE(), GETDATE())
	,(542,N'فیروزآباد',17, 0, GETDATE(), GETDATE())
	,(543,N'فیروزآباد - میمند',17, 0, GETDATE(), GETDATE())
	,(544,N'قیروکارزین',17, 0, GETDATE(), GETDATE())
	,(545,N'قیروکارزین - افزر',17, 0, GETDATE(), GETDATE())
	,(546,N'کازرون',17, 0, GETDATE(), GETDATE())
	,(547,N'کازرون - جره و بالاده',17, 0, GETDATE(), GETDATE())
	,(548,N'کازرون - چنار شاهیجان',17, 0, GETDATE(), GETDATE())
	,(549,N'کازرون - خشت',17, 0, GETDATE(), GETDATE())
	,(550,N'کازرون - کنارتخته و کمارج',17, 0, GETDATE(), GETDATE())
	,(551,N'کازرون - کوهمره',17, 0, GETDATE(), GETDATE())
	,(552,N'گراش',17, 0, GETDATE(), GETDATE())
	,(553,N'گراش - ارد',17, 0, GETDATE(), GETDATE())
	,(554,N'لارستان',17, 0, GETDATE(), GETDATE())
	,(555,N'لارستان - اوز',17, 0, GETDATE(), GETDATE())
	,(556,N'لارستان - بنارویه',17, 0, GETDATE(), GETDATE())
	,(557,N'لارستان - بیرم',17, 0, GETDATE(), GETDATE())
	,(558,N'لارستان - جویم',17, 0, GETDATE(), GETDATE())
	,(559,N'لارستان - صحرای باغ',17, 0, GETDATE(), GETDATE())
	,(560,N'لامرد',17, 0, GETDATE(), GETDATE())
	,(561,N'لامرد - اشکنان',17, 0, GETDATE(), GETDATE())
	,(562,N'لامرد - علامرودشت',17, 0, GETDATE(), GETDATE())
	,(563,N'مرودشت',17, 0, GETDATE(), GETDATE())
	,(564,N'مرودشت - درودزن',17, 0, GETDATE(), GETDATE())
	,(565,N'مرودشت - سیدان',17, 0, GETDATE(), GETDATE())
	,(566,N'مرودشت - کامفیروز',17, 0, GETDATE(), GETDATE())
	,(567,N'مرودشت - کر',17, 0, GETDATE(), GETDATE())
	,(568,N'ممسنی',17, 0, GETDATE(), GETDATE())
	,(569,N'ممسنی - دشمن زیاری',17, 0, GETDATE(), GETDATE())
	,(570,N'ممسنی - ماهور میلانی',17, 0, GETDATE(), GETDATE())
	,(571,N'مهر',17, 0, GETDATE(), GETDATE())
	,(572,N'مهر - اسیر',17, 0, GETDATE(), GETDATE())
	,(573,N'مهر - گله دار',17, 0, GETDATE(), GETDATE())
	,(574,N'مهر - وراوی',17, 0, GETDATE(), GETDATE())
	,(575,N'نی‌ریز',17, 0, GETDATE(), GETDATE())
	,(576,N'نی‌ریز - آباده طشک',17, 0, GETDATE(), GETDATE())
	,(577,N'نی‌ریز - پشتکوه',17, 0, GETDATE(), GETDATE())
	,(578,N'نی‌ریز - قطرویه',17, 0, GETDATE(), GETDATE())
	,(579,N'قزوین',18, 0, GETDATE(), GETDATE())
	,(580,N'قزوین - رودبار الموت',18, 0, GETDATE(), GETDATE())
	,(581,N'قزوین - رودبارشهرستان',18, 0, GETDATE(), GETDATE())
	,(582,N'قزوین - طارم سفلی',18, 0, GETDATE(), GETDATE())
	,(583,N'قزوین - کوهین',18, 0, GETDATE(), GETDATE())
	,(584,N'آبیک',18, 0, GETDATE(), GETDATE())
	,(585,N'آبیک - بشاریات',18, 0, GETDATE(), GETDATE())
	,(586,N'البرز',18, 0, GETDATE(), GETDATE())
	,(587,N'البرز - زيبا شهر',18, 0, GETDATE(), GETDATE())
	,(588,N'البرز - محمدیه',18, 0, GETDATE(), GETDATE())
	,(589,N'بوئين زهرا',18, 0, GETDATE(), GETDATE())
	,(590,N'بوئين زهرا - آبگرم',18, 0, GETDATE(), GETDATE())
	,(591,N'بوئين زهرا - آوج',18, 0, GETDATE(), GETDATE())
	,(592,N'بوئين زهرا - دشتابی',18, 0, GETDATE(), GETDATE())
	,(593,N'بوئين زهرا - رامند',18, 0, GETDATE(), GETDATE())
	,(594,N'بوئين زهرا - شال',18, 0, GETDATE(), GETDATE())
	,(595,N'تاکستان',18, 0, GETDATE(), GETDATE())
	,(596,N'تاکستان - اسفرورین',18, 0, GETDATE(), GETDATE())
	,(597,N'تاکستان - خرمدشت',18, 0, GETDATE(), GETDATE())
	,(598,N'تاکستان - ضیاء آباد',18, 0, GETDATE(), GETDATE())
	,(599,N'قم',19, 1, GETDATE(), GETDATE())
	,(600,N'قم - جعفر آباد',19, 0, GETDATE(), GETDATE())
	,(601,N'قم - خلجستان',19, 0, GETDATE(), GETDATE())
	,(602,N'قم - سلفچگان',19, 0, GETDATE(), GETDATE())
	,(603,N'قم - نوفل لوشاتو',19, 0, GETDATE(), GETDATE())
	,(604,N'سنندج',20, 0, GETDATE(), GETDATE())
	,(605,N'سنندج - کلاترزان',20, 0, GETDATE(), GETDATE())
	,(606,N'بانه',20, 0, GETDATE(), GETDATE())
	,(607,N'بانه - آرمرده',20, 0, GETDATE(), GETDATE())
	,(608,N'بانه - نمشیر',20, 0, GETDATE(), GETDATE())
	,(609,N'بانه - ننور',20, 0, GETDATE(), GETDATE())
	,(610,N'بیجار',20, 0, GETDATE(), GETDATE())
	,(611,N'بیجار - چنگ الماس',20, 0, GETDATE(), GETDATE())
	,(612,N'بیجار - کرانی',20, 0, GETDATE(), GETDATE())
	,(613,N'دهگلان',20, 0, GETDATE(), GETDATE())
	,(614,N'دهگلان - بلبان آباد',20, 0, GETDATE(), GETDATE())
	,(615,N'دیواندره',20, 0, GETDATE(), GETDATE())
	,(616,N'دیواندره - سارال',20, 0, GETDATE(), GETDATE())
	,(617,N'دیواندره - کرفتو',20, 0, GETDATE(), GETDATE())
	,(618,N'سروآباد',20, 0, GETDATE(), GETDATE())
	,(619,N'سروآباد - اورامان',20, 0, GETDATE(), GETDATE())
	,(620,N'سقز',20, 0, GETDATE(), GETDATE())
	,(621,N'سقز - زیویه',20, 0, GETDATE(), GETDATE())
	,(622,N'سقز - سرشیو سقز',20, 0, GETDATE(), GETDATE())
	,(623,N'قروه',20, 0, GETDATE(), GETDATE())
	,(624,N'قروه - چهاردولی',20, 0, GETDATE(), GETDATE())
	,(625,N'قروه - سریش آباد',20, 0, GETDATE(), GETDATE())
	,(626,N'کامیاران',20, 0, GETDATE(), GETDATE())
	,(627,N'کامیاران - موچش',20, 0, GETDATE(), GETDATE())
	,(628,N'مریوان',20, 0, GETDATE(), GETDATE())
	,(629,N'مریوان - خاوومیرآباد',20, 0, GETDATE(), GETDATE())
	,(630,N'مریوان - سرشیو',20, 0, GETDATE(), GETDATE())
	,(631,N'کرمان',21, 0, GETDATE(), GETDATE())
	,(632,N'کرمان - چترود',21, 0, GETDATE(), GETDATE())
	,(633,N'کرمان - راین',21, 0, GETDATE(), GETDATE())
	,(634,N'کرمان - شهداد',21, 0, GETDATE(), GETDATE())
	,(635,N'کرمان - گلباف',21, 0, GETDATE(), GETDATE())
	,(636,N'کرمان - ماهان',21, 0, GETDATE(), GETDATE())
	,(637,N'انار',21, 0, GETDATE(), GETDATE())
	,(638,N'بافت',21, 0, GETDATE(), GETDATE())
	,(639,N'بافت - ارزوئیه',21, 0, GETDATE(), GETDATE())
	,(640,N'بردسیر',21, 0, GETDATE(), GETDATE())
	,(641,N'بردسیر - گلزار',21, 0, GETDATE(), GETDATE())
	,(642,N'بردسیر - لاله زار',21, 0, GETDATE(), GETDATE())
	,(643,N'بردسیر - نگار',21, 0, GETDATE(), GETDATE())
	,(644,N'بم',21, 0, GETDATE(), GETDATE())
	,(645,N'بم - روداب',21, 0, GETDATE(), GETDATE())
	,(646,N'بم - نرماشیر',21, 0, GETDATE(), GETDATE())
	,(647,N'جیرفت',21, 0, GETDATE(), GETDATE())
	,(648,N'جیرفت - جبالبارز',21, 0, GETDATE(), GETDATE())
	,(649,N'جیرفت - ساردوئیه',21, 0, GETDATE(), GETDATE())
	,(650,N'رابر',21, 0, GETDATE(), GETDATE())
	,(651,N'رابر - هنزا',21, 0, GETDATE(), GETDATE())
	,(652,N'راور',21, 0, GETDATE(), GETDATE())
	,(653,N'راور - کوهساران',21, 0, GETDATE(), GETDATE())
	,(654,N'رفسنجان',21, 0, GETDATE(), GETDATE())
	,(655,N'رفسنجان - فردوس',21, 0, GETDATE(), GETDATE())
	,(656,N'رفسنجان - کشکوئیه',21, 0, GETDATE(), GETDATE())
	,(657,N'رفسنجان - نوق',21, 0, GETDATE(), GETDATE())
	,(658,N'رودبار جنوب',21, 0, GETDATE(), GETDATE())
	,(659,N'رودبار جنوب - جازموریان',21, 0, GETDATE(), GETDATE())
	,(660,N'ریگان',21, 0, GETDATE(), GETDATE())
	,(661,N'ریگان - گنبکی',21, 0, GETDATE(), GETDATE())
	,(662,N'زرند',21, 0, GETDATE(), GETDATE())
	,(663,N'زرند - یزدان آباد',21, 0, GETDATE(), GETDATE())
	,(664,N'سیرجان',21, 0, GETDATE(), GETDATE())
	,(665,N'سیرجان - پاریز',21, 0, GETDATE(), GETDATE())
	,(666,N'سیرجان - زیدآباد',21, 0, GETDATE(), GETDATE())
	,(667,N'سیرجان - گلستان',21, 0, GETDATE(), GETDATE())
	,(668,N'شهر بابک',21, 0, GETDATE(), GETDATE())
	,(669,N'شهر بابک - دهج',21, 0, GETDATE(), GETDATE())
	,(670,N'عنبرآباد',21, 0, GETDATE(), GETDATE())
	,(671,N'عنبرآباد - اسماعیلی',21, 0, GETDATE(), GETDATE())
	,(672,N'عنبرآباد - جبالبارز جنوبی',21, 0, GETDATE(), GETDATE())
	,(673,N'فهرج',21, 0, GETDATE(), GETDATE())
	,(674,N'فهرج - نگین کویر',21, 0, GETDATE(), GETDATE())
	,(675,N'قلعه گنج',21, 0, GETDATE(), GETDATE())
	,(676,N'قلعه گنج - چاه خداداد',21, 0, GETDATE(), GETDATE())
	,(677,N'کوهبنان',21, 0, GETDATE(), GETDATE())
	,(678,N'کوهبنان - طغرالجرد',21, 0, GETDATE(), GETDATE())
	,(679,N'کهنوج',21, 0, GETDATE(), GETDATE())
	,(680,N'کهنوج - فاریاب',21, 0, GETDATE(), GETDATE())
	,(681,N'منوجان',21, 0, GETDATE(), GETDATE())
	,(682,N'منوجان - آسمینون',21, 0, GETDATE(), GETDATE())
	,(683,N'کرمانشاه',22, 0, GETDATE(), GETDATE())
	,(684,N'کرمانشاه - بیلوار',22, 0, GETDATE(), GETDATE())
	,(685,N'کرمانشاه - فیروزآباد',22, 0, GETDATE(), GETDATE())
	,(686,N'کرمانشاه - کوزران',22, 0, GETDATE(), GETDATE())
	,(687,N'کرمانشاه - ماهیدشت',22, 0, GETDATE(), GETDATE())
	,(688,N'اسلام‌آباد غرب',22, 0, GETDATE(), GETDATE())
	,(689,N'اسلام‌آباد غرب - حمیل',22, 0, GETDATE(), GETDATE())
	,(690,N'پاوه',22, 0, GETDATE(), GETDATE())
	,(691,N'پاوه - باینگان',22, 0, GETDATE(), GETDATE())
	,(692,N'پاوه - نوسود',22, 0, GETDATE(), GETDATE())
	,(693,N'ثلاث باباجانی',22, 0, GETDATE(), GETDATE())
	,(694,N'ثلاث باباجانی - ازگله',22, 0, GETDATE(), GETDATE())
	,(695,N'جوانرود',22, 0, GETDATE(), GETDATE())
	,(696,N'جوانرود - کلاشی',22, 0, GETDATE(), GETDATE())
	,(697,N'دالاهو',22, 0, GETDATE(), GETDATE())
	,(698,N'دالاهو - گهواره',22, 0, GETDATE(), GETDATE())
	,(699,N'روانسر',22, 0, GETDATE(), GETDATE())
	,(700,N'روانسر - شاهو',22, 0, GETDATE(), GETDATE())
	,(701,N'سرپل ذهاب',22, 0, GETDATE(), GETDATE())
	,(702,N'سنقر',22, 0, GETDATE(), GETDATE())
	,(703,N'سنقر - کلیائی',22, 0, GETDATE(), GETDATE())
	,(704,N'صحنه',22, 0, GETDATE(), GETDATE())
	,(705,N'صحنه - دینور',22, 0, GETDATE(), GETDATE())
	,(706,N'قصر شیرین',22, 0, GETDATE(), GETDATE())
	,(707,N'قصر شیرین - سومار',22, 0, GETDATE(), GETDATE())
	,(708,N'کنگاور',22, 0, GETDATE(), GETDATE())
	,(709,N'گیلانغرب',22, 0, GETDATE(), GETDATE())
	,(710,N'گیلانغرب - گوآور',22, 0, GETDATE(), GETDATE())
	,(711,N'هرسین',22, 0, GETDATE(), GETDATE())
	,(712,N'هرسین - بیستون',22, 0, GETDATE(), GETDATE())
	,(713,N'یاسوج',23, 0, GETDATE(), GETDATE())
	,(714,N'یاسوج - لوداب',23, 0, GETDATE(), GETDATE())
	,(715,N'یاسوج - مارگون',23, 0, GETDATE(), GETDATE())
	,(716,N'باشت',23, 0, GETDATE(), GETDATE())
	,(717,N'باشت - بوستان',23, 0, GETDATE(), GETDATE())
	,(718,N'بهمئی',23, 0, GETDATE(), GETDATE())
	,(719,N'بهمئی - بهمئی گرمسیری',23, 0, GETDATE(), GETDATE())
	,(720,N'چرام',23, 0, GETDATE(), GETDATE())
	,(721,N'چرام - سرفاریاب',23, 0, GETDATE(), GETDATE())
	,(722,N'دنا',23, 0, GETDATE(), GETDATE())
	,(723,N'دنا - پاتاوه',23, 0, GETDATE(), GETDATE())
	,(724,N'دنا - کبگیان',23, 0, GETDATE(), GETDATE())
	,(725,N'کهگیلویه',23, 0, GETDATE(), GETDATE())
	,(726,N'کهگیلویه - چاروسا',23, 0, GETDATE(), GETDATE())
	,(727,N'کهگیلویه - دیشموک',23, 0, GETDATE(), GETDATE())
	,(728,N'کهگیلویه - لنده',23, 0, GETDATE(), GETDATE())
	,(729,N'گچساران',23, 0, GETDATE(), GETDATE())
	,(730,N'گرگان',24, 0, GETDATE(), GETDATE())
	,(731,N'گرگان - بهاران',24, 0, GETDATE(), GETDATE())
	,(732,N'آزادشهر',24, 0, GETDATE(), GETDATE())
	,(733,N'آزادشهر - چشمه ساران',24, 0, GETDATE(), GETDATE())
	,(734,N'آق‌قلا',24, 0, GETDATE(), GETDATE())
	,(735,N'آق‌قلا - وشمگیر',24, 0, GETDATE(), GETDATE())
	,(736,N'بندرگز',24, 0, GETDATE(), GETDATE())
	,(737,N'بندرگز - نوکنده',24, 0, GETDATE(), GETDATE())
	,(738,N'ترکمن',24, 0, GETDATE(), GETDATE())
	,(739,N'ترکمن - سیجوال',24, 0, GETDATE(), GETDATE())
	,(740,N'رامیان',24, 0, GETDATE(), GETDATE())
	,(741,N'رامیان - فندرسک',24, 0, GETDATE(), GETDATE())
	,(742,N'علی آباد',24, 0, GETDATE(), GETDATE())
	,(743,N'علی آباد - کمالان',24, 0, GETDATE(), GETDATE())
	,(744,N'کردکوی',24, 0, GETDATE(), GETDATE())
	,(745,N'کلاله',24, 0, GETDATE(), GETDATE())
	,(746,N'کلاله - پیشکمر',24, 0, GETDATE(), GETDATE())
	,(747,N'گالیکش',24, 0, GETDATE(), GETDATE())
	,(748,N'گالیکش - لوه',24, 0, GETDATE(), GETDATE())
	,(749,N'گمیشان',24, 0, GETDATE(), GETDATE())
	,(750,N'گمیشان - گل دشت',24, 0, GETDATE(), GETDATE())
	,(751,N'گنبدکاووس',24, 0, GETDATE(), GETDATE())
	,(752,N'گنبدکاووس - داشلی برون',24, 0, GETDATE(), GETDATE())
	,(753,N'مراوه تپه',24, 0, GETDATE(), GETDATE())
	,(754,N'مراوه تپه - گلی داغ',24, 0, GETDATE(), GETDATE())
	,(755,N'مینودشت',24, 0, GETDATE(), GETDATE())
	,(756,N'مینودشت - کوهسارات',24, 0, GETDATE(), GETDATE())
	,(757,N'رشت',25, 0, GETDATE(), GETDATE())
	,(758,N'رشت - خشکبیجار',25, 0, GETDATE(), GETDATE())
	,(759,N'رشت - خمام',25, 0, GETDATE(), GETDATE())
	,(760,N'رشت - سنگر',25, 0, GETDATE(), GETDATE())
	,(761,N'رشت - کوچصفهان',25, 0, GETDATE(), GETDATE())
	,(762,N'رشت - لشت نشا',25, 0, GETDATE(), GETDATE())
	,(763,N'آستارا',25, 0, GETDATE(), GETDATE())
	,(764,N'آستارا - لوندویل',25, 0, GETDATE(), GETDATE())
	,(765,N'آستانه اشرفیه',25, 0, GETDATE(), GETDATE())
	,(766,N'آستانه اشرفیه - کياشهر',25, 0, GETDATE(), GETDATE())
	,(767,N'املش',25, 0, GETDATE(), GETDATE())
	,(768,N'املش - رانکوه',25, 0, GETDATE(), GETDATE())
	,(769,N'بندرانزلی',25, 0, GETDATE(), GETDATE())
	,(770,N'تالش',25, 0, GETDATE(), GETDATE())
	,(771,N'تالش - اسالم',25, 0, GETDATE(), GETDATE())
	,(772,N'تالش - حریق',25, 0, GETDATE(), GETDATE())
	,(773,N'تالش - کرگان رود',25, 0, GETDATE(), GETDATE())
	,(774,N'رضوانشهر',25, 0, GETDATE(), GETDATE())
	,(775,N'رضوانشهر - پره سر',25, 0, GETDATE(), GETDATE())
	,(776,N'رودبار',25, 0, GETDATE(), GETDATE())
	,(777,N'رودبار - خورگام',25, 0, GETDATE(), GETDATE())
	,(778,N'رودبار - رحمت آباد و بلوکات',25, 0, GETDATE(), GETDATE())
	,(779,N'رودبار - عمارلو',25, 0, GETDATE(), GETDATE())
	,(780,N'رودسر',25, 0, GETDATE(), GETDATE())
	,(781,N'رودسر - چابکسر',25, 0, GETDATE(), GETDATE())
	,(782,N'رودسر - رحیم آباد',25, 0, GETDATE(), GETDATE())
	,(783,N'رودسر - کلاچای',25, 0, GETDATE(), GETDATE())
	,(784,N'سياهکل',25, 0, GETDATE(), GETDATE())
	,(785,N'سياهکل - دیلمان',25, 0, GETDATE(), GETDATE())
	,(786,N'شفت',25, 0, GETDATE(), GETDATE())
	,(787,N'شفت - احمد سر گوراب',25, 0, GETDATE(), GETDATE())
	,(788,N'صومعه‌سرا',25, 0, GETDATE(), GETDATE())
	,(789,N'صومعه‌سرا - تولم',25, 0, GETDATE(), GETDATE())
	,(790,N'صومعه‌سرا - میرزاکوچک جنگلی',25, 0, GETDATE(), GETDATE())
	,(791,N'فومن',25, 0, GETDATE(), GETDATE())
	,(792,N'فومن - سردار جنگل',25, 0, GETDATE(), GETDATE())
	,(793,N'لاهیجان',25, 0, GETDATE(), GETDATE())
	,(794,N'لاهیجان - رودبنه',25, 0, GETDATE(), GETDATE())
	,(795,N'لنگرود',25, 0, GETDATE(), GETDATE())
	,(796,N'لنگرود - اطاقور',25, 0, GETDATE(), GETDATE())
	,(797,N'لنگرود - کومله',25, 0, GETDATE(), GETDATE())
	,(798,N'ماسال',25, 0, GETDATE(), GETDATE())
	,(799,N'ماسال - شاندرمن',25, 0, GETDATE(), GETDATE())
	,(800,N'خرم‌آباد',26, 0, GETDATE(), GETDATE())
	,(801,N'خرم‌آباد - پاپی',26, 0, GETDATE(), GETDATE())
	,(802,N'خرم‌آباد - چغلوندی',26, 0, GETDATE(), GETDATE())
	,(803,N'خرم‌آباد - زاغه',26, 0, GETDATE(), GETDATE())
	,(804,N'ازنا',26, 0, GETDATE(), GETDATE())
	,(805,N'ازنا - جاپلق',26, 0, GETDATE(), GETDATE())
	,(806,N'الیگودرز',26, 0, GETDATE(), GETDATE())
	,(807,N'الیگودرز - بشارت',26, 0, GETDATE(), GETDATE())
	,(808,N'الیگودرز - زز و ماهرو',26, 0, GETDATE(), GETDATE())
	,(809,N'بروجرد',26, 0, GETDATE(), GETDATE())
	,(810,N'بروجرد - اشترینان',26, 0, GETDATE(), GETDATE())
	,(811,N'پلدختر',26, 0, GETDATE(), GETDATE())
	,(812,N'پلدختر - معمولان',26, 0, GETDATE(), GETDATE())
	,(813,N'دلفان',26, 0, GETDATE(), GETDATE())
	,(814,N'دلفان - کاکاوند',26, 0, GETDATE(), GETDATE())
	,(815,N'دورود',26, 0, GETDATE(), GETDATE())
	,(816,N'دورود - سیلاخور',26, 0, GETDATE(), GETDATE())
	,(817,N'سلسله',26, 0, GETDATE(), GETDATE())
	,(818,N'سلسله - فیروزآباد',26, 0, GETDATE(), GETDATE())
	,(819,N'کوهدشت',26, 0, GETDATE(), GETDATE())
	,(820,N'کوهدشت - درب گنبد',26, 0, GETDATE(), GETDATE())
	,(821,N'کوهدشت - رومشکان',26, 0, GETDATE(), GETDATE())
	,(822,N'کوهدشت - طرهان',26, 0, GETDATE(), GETDATE())
	,(823,N'کوهدشت - کونانی',26, 0, GETDATE(), GETDATE())
	,(824,N'ویسیان',26, 0, GETDATE(), GETDATE())
	,(825,N'ویسیان - چگنی',26, 0, GETDATE(), GETDATE())
	,(826,N'ویسیان - شاهیوند',26, 0, GETDATE(), GETDATE())
	,(827,N'ساری',27, 0, GETDATE(), GETDATE())
	,(828,N'ساری - چهاردانگه',27, 0, GETDATE(), GETDATE())
	,(829,N'ساری - دودانگه',27, 0, GETDATE(), GETDATE())
	,(830,N'ساری - رودپی',27, 0, GETDATE(), GETDATE())
	,(831,N'ساری - کلیجان رستاق',27, 0, GETDATE(), GETDATE())
	,(832,N'ساری - میان دورود',27, 0, GETDATE(), GETDATE())
	,(833,N'آمل',27, 0, GETDATE(), GETDATE())
	,(834,N'آمل - امامزاده عبدالله',27, 0, GETDATE(), GETDATE())
	,(835,N'آمل - دابودشت',27, 0, GETDATE(), GETDATE())
	,(836,N'آمل - لاریجان',27, 0, GETDATE(), GETDATE())
	,(837,N'بابل',27, 0, GETDATE(), GETDATE())
	,(838,N'بابل - بابل کنار',27, 0, GETDATE(), GETDATE())
	,(839,N'بابل - بندپی شرقی',27, 0, GETDATE(), GETDATE())
	,(840,N'بابل - بندپی غربی',27, 0, GETDATE(), GETDATE())
	,(841,N'بابل - گتاب',27, 0, GETDATE(), GETDATE())
	,(842,N'بابل - لاله آباد',27, 0, GETDATE(), GETDATE())
	,(843,N'بابلسر',27, 0, GETDATE(), GETDATE())
	,(844,N'بابلسر - بابلسر بخش رودبست',27, 0, GETDATE(), GETDATE())
	,(845,N'بابلسر - بهنمیر',27, 0, GETDATE(), GETDATE())
	,(846,N'بهشهر',27, 0, GETDATE(), GETDATE())
	,(847,N'بهشهر - یانه سر',27, 0, GETDATE(), GETDATE())
	,(848,N'تنکابن',27, 0, GETDATE(), GETDATE())
	,(849,N'تنکابن - تنکابن بخش خرم آباد',27, 0, GETDATE(), GETDATE())
	,(850,N'تنکابن - نشتا',27, 0, GETDATE(), GETDATE())
	,(851,N'جویبار',27, 0, GETDATE(), GETDATE())
	,(852,N'جویبار - گیل خوران',27, 0, GETDATE(), GETDATE())
	,(853,N'چالوس',27, 0, GETDATE(), GETDATE())
	,(854,N'چالوس - کلاردشت',27, 0, GETDATE(), GETDATE())
	,(855,N'چالوس - مرزن آباد',27, 0, GETDATE(), GETDATE())
	,(856,N'رامسر',27, 0, GETDATE(), GETDATE())
	,(857,N'سوادکوه',27, 0, GETDATE(), GETDATE())
	,(858,N'سوادکوه - شیرگاه',27, 0, GETDATE(), GETDATE())
	,(859,N'عباس آباد',27, 0, GETDATE(), GETDATE())
	,(860,N'عباس آباد - کلارآباد',27, 0, GETDATE(), GETDATE())
	,(861,N'فریدونکنار',27, 0, GETDATE(), GETDATE())
	,(862,N'فریدونکنار - فريدونکنار بخش دهفري',27, 0, GETDATE(), GETDATE())
	,(863,N'قائم‌شهر',27, 0, GETDATE(), GETDATE())
	,(864,N'قائم‌شهر - کیاکلا',27, 0, GETDATE(), GETDATE())
	,(865,N'گلوگاه',27, 0, GETDATE(), GETDATE())
	,(866,N'گلوگاه - کلباد',27, 0, GETDATE(), GETDATE())
	,(867,N'محمودآباد',27, 0, GETDATE(), GETDATE())
	,(868,N'محمودآباد - سرخ رود',27, 0, GETDATE(), GETDATE())
	,(869,N'نکا',27, 0, GETDATE(), GETDATE())
	,(870,N'نکا - هزار جریب',27, 0, GETDATE(), GETDATE())
	,(871,N'نور',27, 0, GETDATE(), GETDATE())
	,(872,N'نور - بلده',27, 0, GETDATE(), GETDATE())
	,(873,N'نور - چمستان',27, 0, GETDATE(), GETDATE())
	,(874,N'نوشهر',27, 0, GETDATE(), GETDATE())
	,(875,N'نوشهر - کجور',27, 0, GETDATE(), GETDATE())
	,(876,N'اراک',28, 0, GETDATE(), GETDATE())
	,(877,N'اراک - ساروق',28, 0, GETDATE(), GETDATE())
	,(878,N'آشتیان',28, 0, GETDATE(), GETDATE())
	,(879,N'تفرش',28, 0, GETDATE(), GETDATE())
	,(880,N'تفرش - فراهان',28, 0, GETDATE(), GETDATE())
	,(881,N'خمین',28, 0, GETDATE(), GETDATE())
	,(882,N'خمین - کمره',28, 0, GETDATE(), GETDATE())
	,(883,N'خنداب',28, 0, GETDATE(), GETDATE())
	,(884,N'خنداب - قره چای',28, 0, GETDATE(), GETDATE())
	,(885,N'دلیجان',28, 0, GETDATE(), GETDATE())
	,(886,N'زرندیه',28, 0, GETDATE(), GETDATE())
	,(887,N'زرندیه - خرقان',28, 0, GETDATE(), GETDATE())
	,(888,N'ساوه',28, 0, GETDATE(), GETDATE())
	,(889,N'ساوه - نوبران',28, 0, GETDATE(), GETDATE())
	,(890,N'شازند',28, 0, GETDATE(), GETDATE())
	,(891,N'شازند - زالیان',28, 0, GETDATE(), GETDATE())
	,(892,N'شازند - سربند',28, 0, GETDATE(), GETDATE())
	,(893,N'شازند - قره کهریز',28, 0, GETDATE(), GETDATE())
	,(894,N'کمیجان',28, 0, GETDATE(), GETDATE())
	,(895,N'کمیجان - میلاجرد',28, 0, GETDATE(), GETDATE())
	,(896,N'محلات',28, 0, GETDATE(), GETDATE())
	,(897,N'بندرعباس',29, 0, GETDATE(), GETDATE())
	,(898,N'بندرعباس - تخت',29, 0, GETDATE(), GETDATE())
	,(899,N'بندرعباس - فین',29, 0, GETDATE(), GETDATE())
	,(900,N'بندرعباس - قلعه قاضی',29, 0, GETDATE(), GETDATE())
	,(901,N'ابوموسی',29, 0, GETDATE(), GETDATE())
	,(902,N'ابوموسی - تنب',29, 0, GETDATE(), GETDATE())
	,(903,N'بستک',29, 0, GETDATE(), GETDATE())
	,(904,N'بستک - جناح',29, 0, GETDATE(), GETDATE())
	,(905,N'بستک - کوخرد',29, 0, GETDATE(), GETDATE())
	,(906,N'بشاگرد',29, 0, GETDATE(), GETDATE())
	,(907,N'بشاگرد - گافروپارمون',29, 0, GETDATE(), GETDATE())
	,(908,N'بشاگرد - گوهران',29, 0, GETDATE(), GETDATE())
	,(909,N'بندرلنگه',29, 0, GETDATE(), GETDATE())
	,(910,N'بندرلنگه - شیبکوه',29, 0, GETDATE(), GETDATE())
	,(911,N'بندرلنگه - کیش',29, 0, GETDATE(), GETDATE())
	,(912,N'پارسیان',29, 0, GETDATE(), GETDATE())
	,(913,N'پارسیان - کوشکنار',29, 0, GETDATE(), GETDATE())
	,(914,N'جاسک',29, 0, GETDATE(), GETDATE())
	,(915,N'جاسک - لیردف',29, 0, GETDATE(), GETDATE())
	,(916,N'حاجی‌آباد',29, 0, GETDATE(), GETDATE())
	,(917,N'حاجی‌آباد - احمدی',29, 0, GETDATE(), GETDATE())
	,(918,N'حاجی‌آباد - فارغان',29, 0, GETDATE(), GETDATE())
	,(919,N'خمیر',29, 0, GETDATE(), GETDATE())
	,(920,N'خمیر - رویدر',29, 0, GETDATE(), GETDATE())
	,(921,N'رودان',29, 0, GETDATE(), GETDATE())
	,(922,N'رودان - بیکاه',29, 0, GETDATE(), GETDATE())
	,(923,N'رودان - جغین',29, 0, GETDATE(), GETDATE())
	,(924,N'رودان - رودخانه',29, 0, GETDATE(), GETDATE())
	,(925,N'سیریک',29, 0, GETDATE(), GETDATE())
	,(926,N'سیریک - بمانی',29, 0, GETDATE(), GETDATE())
	,(927,N'قشم',29, 0, GETDATE(), GETDATE())
	,(928,N'قشم - شهاب',29, 0, GETDATE(), GETDATE())
	,(929,N'قشم - هرمز',29, 0, GETDATE(), GETDATE())
	,(930,N'میناب',29, 0, GETDATE(), GETDATE())
	,(931,N'میناب - بندزرک',29, 0, GETDATE(), GETDATE())
	,(932,N'میناب - توکهور',29, 0, GETDATE(), GETDATE())
	,(933,N'میناب - سندرک',29, 0, GETDATE(), GETDATE())
	,(934,N'همدان',30, 0, GETDATE(), GETDATE())
	,(935,N'همدان - شراء',30, 0, GETDATE(), GETDATE())
	,(936,N'اسدآباد',30, 0, GETDATE(), GETDATE())
	,(937,N'اسدآباد - پیرسلیمان',30, 0, GETDATE(), GETDATE())
	,(938,N'بهار',30, 0, GETDATE(), GETDATE())
	,(939,N'بهار - صالح آباد',30, 0, GETDATE(), GETDATE())
	,(940,N'بهار - لالجین',30, 0, GETDATE(), GETDATE())
	,(941,N'تویسرکان',30, 0, GETDATE(), GETDATE())
	,(942,N'تویسرکان - قلقل رود',30, 0, GETDATE(), GETDATE())
	,(943,N'رزن',30, 0, GETDATE(), GETDATE())
	,(944,N'رزن - سردرود',30, 0, GETDATE(), GETDATE())
	,(945,N'رزن - قروه درجزین',30, 0, GETDATE(), GETDATE())
	,(946,N'فامنین',30, 0, GETDATE(), GETDATE())
	,(947,N'فامنین - پیشخور',30, 0, GETDATE(), GETDATE())
	,(948,N'کبودرآهنگ',30, 0, GETDATE(), GETDATE())
	,(949,N'کبودرآهنگ - شیرین سو',30, 0, GETDATE(), GETDATE())
	,(950,N'کبودرآهنگ - گل تپه',30, 0, GETDATE(), GETDATE())
	,(951,N'ملایر',30, 0, GETDATE(), GETDATE())
	,(952,N'ملایر - جوکار',30, 0, GETDATE(), GETDATE())
	,(953,N'ملایر - زند',30, 0, GETDATE(), GETDATE())
	,(954,N'ملایر - سامن',30, 0, GETDATE(), GETDATE())
	,(955,N'نهاوند',30, 0, GETDATE(), GETDATE())
	,(956,N'نهاوند - خزل',30, 0, GETDATE(), GETDATE())
	,(957,N'نهاوند - زرین دشت',30, 0, GETDATE(), GETDATE())
	,(958,N'نهاوند - گیان',30, 0, GETDATE(), GETDATE())
	,(959,N'یزد',31, 1, GETDATE(), GETDATE())
	,(960,N'یزد - زارچ',31, 0, GETDATE(), GETDATE())
	,(961,N'ابرکوه',31, 0, GETDATE(), GETDATE())
	,(962,N'ابرکوه - بهمن',31, 0, GETDATE(), GETDATE())
	,(963,N'اردکان',31, 0, GETDATE(), GETDATE())
	,(964,N'اردکان - خرانق',31, 0, GETDATE(), GETDATE())
	,(965,N'اردکان - عقدا',31, 0, GETDATE(), GETDATE())
	,(966,N'بافق',31, 0, GETDATE(), GETDATE())
	,(967,N'بهاباد',31, 0, GETDATE(), GETDATE())
	,(968,N'بهاباد - اسفیچ',31, 0, GETDATE(), GETDATE())
	,(969,N'تفت',31, 0, GETDATE(), GETDATE())
	,(970,N'تفت - گاریزات',31, 0, GETDATE(), GETDATE())
	,(971,N'تفت - نیر',31, 0, GETDATE(), GETDATE())
	,(972,N'خاتم',31, 0, GETDATE(), GETDATE())
	,(973,N'خاتم - مروست',31, 0, GETDATE(), GETDATE())
	,(974,N'صدوق',31, 0, GETDATE(), GETDATE())
	,(975,N'صدوق - خضر آباد',31, 0, GETDATE(), GETDATE())
	,(976,N'طبس',31, 0, GETDATE(), GETDATE())
	,(977,N'طبس - دستگردان',31, 0, GETDATE(), GETDATE())
	,(978,N'طبس - دیهوک',31, 0, GETDATE(), GETDATE())
	,(979,N'مهریز',31, 0, GETDATE(), GETDATE())
	,(980,N'میبد',31, 0, GETDATE(), GETDATE())
			

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-cities-Data-v1', GETDATE(), GETDATE()
END

GO

-- ecommerce
-- neighborhoods
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-neighborhoods-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	INSERT INTO ECNeighborhoods(
	id
	,[name]
	,cityId
	,createdAt
	,updatedAt)
	VALUES  (1,N'آزمايش', 1, GETDATE(), GETDATE())
	,(2,N'ارم', 1, GETDATE(), GETDATE())
	,(3,N'استادان', 1, GETDATE(), GETDATE())
	,(4,N'اسلام شهر', 1, GETDATE(), GETDATE())
	,(5,N'امام خميني', 1, GETDATE(), GETDATE())
	,(6,N'امام علي', 1, GETDATE(), GETDATE())
	,(7,N'امامزاده', 1, GETDATE(), GETDATE())
	,(8,N'اماميه', 1, GETDATE(), GETDATE())
	,(9,N'امير باغي', 1, GETDATE(), GETDATE())
	,(10,N'امير خيز', 1, GETDATE(), GETDATE())
	,(11,N'انقلاب', 1, GETDATE(), GETDATE())
	,(12,N'اهراب', 1, GETDATE(), GETDATE())
	,(13,N'ائل گلي', 1, GETDATE(), GETDATE())
	,(14,N'بابا باغي', 1, GETDATE(), GETDATE())
	,(15,N'بارنج', 1, GETDATE(), GETDATE())
	,(16,N'بارنج چاي', 1, GETDATE(), GETDATE())
	,(17,N'بازار', 1, GETDATE(), GETDATE())
	,(18,N'باسمنج', 1, GETDATE(), GETDATE())
	,(19,N'باغ شمال', 1, GETDATE(), GETDATE())
	,(20,N'باغميشه', 1, GETDATE(), GETDATE())
	,(21,N'بسيج', 1, GETDATE(), GETDATE())
	,(22,N'بهاران', 1, GETDATE(), GETDATE())
	,(23,N'بهارستان', 1, GETDATE(), GETDATE())
	,(24,N'بهشتي', 1, GETDATE(), GETDATE())
	,(25,N'بهمن آباد', 1, GETDATE(), GETDATE())
	,(26,N'بيلانکوه', 1, GETDATE(), GETDATE())
	,(27,N'پرواز', 1, GETDATE(), GETDATE())
	,(28,N'پل سنگي', 1, GETDATE(), GETDATE())
	,(29,N'تجلايي', 1, GETDATE(), GETDATE())
	,(30,N'ترمينال', 1, GETDATE(), GETDATE())
	,(31,N'جمشيد آباد', 1, GETDATE(), GETDATE())
	,(32,N'چرنداب', 1, GETDATE(), GETDATE())
	,(33,N'چمران', 1, GETDATE(), GETDATE())
	,(34,N'چوستدوزان', 1, GETDATE(), GETDATE())
	,(35,N'حافظ', 1, GETDATE(), GETDATE())
	,(36,N'حکم آباد', 1, GETDATE(), GETDATE())
	,(37,N'خاقاني', 1, GETDATE(), GETDATE())
	,(38,N'خطيب', 1, GETDATE(), GETDATE())
	,(39,N'خليل آباد', 1, GETDATE(), GETDATE())
	,(40,N'خيابان', 1, GETDATE(), GETDATE())
	,(41,N'دادگستري', 1, GETDATE(), GETDATE())
	,(42,N'دانش', 1, GETDATE(), GETDATE())
	,(43,N'رازي', 1, GETDATE(), GETDATE())
	,(44,N'راه آهن', 1, GETDATE(), GETDATE())
	,(45,N'رجايي شهر', 1, GETDATE(), GETDATE())
	,(46,N'رضوان شهر', 1, GETDATE(), GETDATE())
	,(47,N'رواسان', 1, GETDATE(), GETDATE())
	,(48,N'زعفرانيه', 1, GETDATE(), GETDATE())
	,(49,N'زمزم', 1, GETDATE(), GETDATE())
	,(50,N'ساري زمين', 1, GETDATE(), GETDATE())
	,(51,N'سرخاب', 1, GETDATE(), GETDATE())
	,(52,N'سهند', 1, GETDATE(), GETDATE())
	,(53,N'سيلاب', 1, GETDATE(), GETDATE())
	,(54,N'شبنم', 1, GETDATE(), GETDATE())
	,(55,N'شتربان', 1, GETDATE(), GETDATE())
	,(56,N'شريف زاده', 1, GETDATE(), GETDATE())
	,(57,N'ششگلان', 1, GETDATE(), GETDATE())
	,(58,N'شمس آباد', 1, GETDATE(), GETDATE())
	,(59,N'شنب غازان', 1, GETDATE(), GETDATE())
	,(60,N'شهرک بهشتي', 1, GETDATE(), GETDATE())
	,(61,N'شهرک رشيديه - باغميشه', 1, GETDATE(), GETDATE())
	,(62,N'شهرک طالقاني', 1, GETDATE(), GETDATE())
	,(63,N'صالح آباد', 1, GETDATE(), GETDATE())
	,(64,N'صنعتي تبريز', 1, GETDATE(), GETDATE())
	,(65,N'صنعتي دکتر بهشتي', 1, GETDATE(), GETDATE())
	,(66,N'طالقاني', 1, GETDATE(), GETDATE())
	,(67,N'عمو زين الدين', 1, GETDATE(), GETDATE())
	,(68,N'فردوس', 1, GETDATE(), GETDATE())
	,(69,N'فرودگاه', 1, GETDATE(), GETDATE())
	,(70,N'فرهنگ شهر', 1, GETDATE(), GETDATE())
	,(71,N'فرهنگيان', 1, GETDATE(), GETDATE())
	,(72,N'قراملک', 1, GETDATE(), GETDATE())
	,(73,N'قره آغاج', 1, GETDATE(), GETDATE())
	,(74,N'قورخانه', 1, GETDATE(), GETDATE())
	,(75,N'کارکنان سازمان آب', 1, GETDATE(), GETDATE())
	,(76,N'کوچه باغ', 1, GETDATE(), GETDATE())
	,(77,N'کوزه باشي', 1, GETDATE(), GETDATE())
	,(78,N'کوي فرهنگيان', 1, GETDATE(), GETDATE())
	,(79,N'گلشهر', 1, GETDATE(), GETDATE())
	,(80,N'گلکار', 1, GETDATE(), GETDATE())
	,(81,N'لاک ديزج', 1, GETDATE(), GETDATE())
	,(82,N'لاله', 1, GETDATE(), GETDATE())
	,(83,N'ليل آباد', 1, GETDATE(), GETDATE())
	,(84,N'مارالان', 1, GETDATE(), GETDATE())
	,(85,N'مخابرات', 1, GETDATE(), GETDATE())
	,(86,N'مقصوديه', 1, GETDATE(), GETDATE())
	,(87,N'ملا زينال', 1, GETDATE(), GETDATE())
	,(88,N'منظريه', 1, GETDATE(), GETDATE())
	,(89,N'ميلاد', 1, GETDATE(), GETDATE())
	,(90,N'نارمک', 1, GETDATE(), GETDATE())
	,(91,N'نيروي هوايي', 1, GETDATE(), GETDATE())
	,(92,N'وادي رحمت', 1, GETDATE(), GETDATE())
	,(93,N'وزير آباد', 1, GETDATE(), GETDATE())
	,(94,N'ولي امر', 1, GETDATE(), GETDATE())
	,(95,N'ولي عصر', 1, GETDATE(), GETDATE())
	,(96,N'وليعصر جنوبي', 1, GETDATE(), GETDATE())
	,(97,N'ويجويه', 1, GETDATE(), GETDATE())
	,(98,N'ياغچيان', 1, GETDATE(), GETDATE())
	,(99,N'يوسف آباد', 1, GETDATE(), GETDATE())
	,(100,N' احمدآباد  کران', 111, GETDATE(), GETDATE())
	,(101,N' نقش جهان  امام خمینی', 111, GETDATE(), GETDATE())
	,(102,N'آتشگاه', 111, GETDATE(), GETDATE())
	,(103,N'آزادان', 111, GETDATE(), GETDATE())
	,(104,N'آسنجان', 111, GETDATE(), GETDATE())
	,(105,N'اشراق', 111, GETDATE(), GETDATE())
	,(106,N'اصفهان-ویلا', 111, GETDATE(), GETDATE())
	,(107,N'الیادران', 111, GETDATE(), GETDATE())
	,(108,N'باتون', 111, GETDATE(), GETDATE())
	,(109,N'بازار', 111, GETDATE(), GETDATE())
	,(110,N'بلوار کشاورز', 111, GETDATE(), GETDATE())
	,(111,N'بوزان', 111, GETDATE(), GETDATE())
	,(112,N'تخت فولاد', 111, GETDATE(), GETDATE())
	,(113,N'تل واسکان', 111, GETDATE(), GETDATE())
	,(114,N'تیران', 111, GETDATE(), GETDATE())
	,(115,N'جلفا', 111, GETDATE(), GETDATE())
	,(116,N'جوباره', 111, GETDATE(), GETDATE())
	,(117,N'جوزدان', 111, GETDATE(), GETDATE())
	,(118,N'جی', 111, GETDATE(), GETDATE())
	,(119,N'چرخاب', 111, GETDATE(), GETDATE())
	,(120,N'حسین آباد', 111, GETDATE(), GETDATE())
	,(121,N'خلیل آباد', 111, GETDATE(), GETDATE())
	,(122,N'خواجو', 111, GETDATE(), GETDATE())
	,(123,N'درب کوشک', 111, GETDATE(), GETDATE())
	,(124,N'دردشت', 111, GETDATE(), GETDATE())
	,(125,N'دستگرده', 111, GETDATE(), GETDATE())
	,(126,N'دودانگی', 111, GETDATE(), GETDATE())
	,(127,N'رحیم آباد', 111, GETDATE(), GETDATE())
	,(128,N'زینبیه', 111, GETDATE(), GETDATE())
	,(129,N'سعادت آباد', 111, GETDATE(), GETDATE())
	,(130,N'سودان', 111, GETDATE(), GETDATE())
	,(131,N'سیچان', 111, GETDATE(), GETDATE())
	,(132,N'شمس آباد', 111, GETDATE(), GETDATE())
	,(133,N'شهرستان', 111, GETDATE(), GETDATE())
	,(134,N'شهرک امام خمینی', 111, GETDATE(), GETDATE())
	,(135,N'شهشهان', 111, GETDATE(), GETDATE())
	,(136,N'شیخ طوسی', 111, GETDATE(), GETDATE())
	,(137,N'شیخ یوسف', 111, GETDATE(), GETDATE())
	,(138,N'طامه', 111, GETDATE(), GETDATE())
	,(139,N'طوقچی', 111, GETDATE(), GETDATE())
	,(140,N'عباس آباد', 111, GETDATE(), GETDATE())
	,(141,N'فتح آباد', 111, GETDATE(), GETDATE())
	,(142,N'فردوان', 111, GETDATE(), GETDATE())
	,(143,N'فرسان', 111, GETDATE(), GETDATE())
	,(144,N'قلعه تبرک', 111, GETDATE(), GETDATE())
	,(145,N'قینان', 111, GETDATE(), GETDATE())
	,(146,N'کساره', 111, GETDATE(), GETDATE())
	,(147,N'کوله پارچه', 111, GETDATE(), GETDATE())
	,(148,N'کوی دادگستری', 111, GETDATE(), GETDATE())
	,(149,N'گبرآباد', 111, GETDATE(), GETDATE())
	,(150,N'گرکان', 111, GETDATE(), GETDATE())
	,(151,N'گلبهار', 111, GETDATE(), GETDATE())
	,(152,N'گلخانه', 111, GETDATE(), GETDATE())
	,(153,N'لنبان', 111, GETDATE(), GETDATE())
	,(154,N'مارنان', 111, GETDATE(), GETDATE())
	,(155,N'مارون', 111, GETDATE(), GETDATE())
	,(156,N'محله نو', 111, GETDATE(), GETDATE())
	,(157,N'مستهلک', 111, GETDATE(), GETDATE())
	,(158,N'ملک شهر', 111, GETDATE(), GETDATE())
	,(159,N'مهرآباد', 111, GETDATE(), GETDATE())
	,(160,N'ناژوان', 111, GETDATE(), GETDATE())
	,(161,N'نورباران', 111, GETDATE(), GETDATE())
	,(162,N'هزار جریب', 111, GETDATE(), GETDATE())
	,(163,N'یزد آباد', 111, GETDATE(), GETDATE())
	,(164,N'یونارت', 111, GETDATE(), GETDATE())
	,(165,N'منطقه 1 - اسلام آباد-زورآباد', 160, GETDATE(), GETDATE())
	,(166,N'منطقه 1 - عظيميه - رسالت', 160, GETDATE(), GETDATE())
	,(167,N'منطقه 2 - آسياب برجي', 160, GETDATE(), GETDATE())
	,(168,N'منطقه 2 - استاندارد', 160, GETDATE(), GETDATE())
	,(169,N'منطقه 2 - سرحد آباد', 160, GETDATE(), GETDATE())
	,(170,N'منطقه 2 - شهرک بنفشه', 160, GETDATE(), GETDATE())
	,(171,N'منطقه 2 - قلمستان - ترک آباد', 160, GETDATE(), GETDATE())
	,(172,N'منطقه 2 - مصباح', 160, GETDATE(), GETDATE())
	,(173,N'منطقه 2 - ميدان توحيد', 160, GETDATE(), GETDATE())
	,(174,N'منطقه 3 - دهکده فرديس', 160, GETDATE(), GETDATE())
	,(175,N'منطقه 3 - شهرک راه آهن', 160, GETDATE(), GETDATE())
	,(176,N'منطقه 3 - شهرک سپاه', 160, GETDATE(), GETDATE())
	,(177,N'منطقه 3 - شهرک فرديس', 160, GETDATE(), GETDATE())
	,(178,N'منطقه 3 - شهرک کوثر', 160, GETDATE(), GETDATE())
	,(179,N'منطقه 3 - شهرک ناز', 160, GETDATE(), GETDATE())
	,(180,N'منطقه 3 - شهرک هوانيروز سپاه', 160, GETDATE(), GETDATE())
	,(181,N'منطقه 3 - گلستان', 160, GETDATE(), GETDATE())
	,(182,N'منطقه 4 - احد آباد', 160, GETDATE(), GETDATE())
	,(183,N'منطقه 4 - حيسن آباد افشار', 160, GETDATE(), GETDATE())
	,(184,N'منطقه 4 - شهرک اخگرآباد', 160, GETDATE(), GETDATE())
	,(185,N'منطقه 4 - شهرک اسد آباد', 160, GETDATE(), GETDATE())
	,(186,N'منطقه 4 - شهرک اکبرآباد', 160, GETDATE(), GETDATE())
	,(187,N'منطقه 4 - شهرک دريا', 160, GETDATE(), GETDATE())
	,(188,N'منطقه 4 - شهرک رجب آباد', 160, GETDATE(), GETDATE())
	,(189,N'منطقه 4 - شهرک شعبان آباد', 160, GETDATE(), GETDATE())
	,(190,N'منطقه 4 - شهرک ملک اباد', 160, GETDATE(), GETDATE())
	,(191,N'منطقه 4 - فاز4 مهرشهر', 160, GETDATE(), GETDATE())
	,(192,N'منطقه 4 - فاز5 مهرشهر', 160, GETDATE(), GETDATE())
	,(193,N'منطقه 4 - کوي فرهنگ', 160, GETDATE(), GETDATE())
	,(194,N'منطقه 4 - مهرشهر', 160, GETDATE(), GETDATE())
	,(195,N'منطقه 5 - حصارک پايين', 160, GETDATE(), GETDATE())
	,(196,N'منطقه 5 - دهقان ويلا - ميانجاده', 160, GETDATE(), GETDATE())
	,(197,N'منطقه 5 - رضا شهر', 160, GETDATE(), GETDATE())
	,(198,N'منطقه 5 - شهرک پرديسان', 160, GETDATE(), GETDATE())
	,(199,N'منطقه 5 - شهرک چمران', 160, GETDATE(), GETDATE())
	,(200,N'منطقه 5 - شهرک قائميه', 160, GETDATE(), GETDATE())
	,(201,N'منطقه 5 - شهرک گلها', 160, GETDATE(), GETDATE())
	,(202,N'منطقه 5 - شهرک مترو', 160, GETDATE(), GETDATE())
	,(203,N'منطقه 5 - شهرک مهران', 160, GETDATE(), GETDATE())
	,(204,N'منطقه 5 - شهرک ولي عصر', 160, GETDATE(), GETDATE())
	,(205,N'منطقه 5 - قلعه شنبه', 160, GETDATE(), GETDATE())
	,(206,N'منطقه 5 - کرج نو - شهرک موحدين', 160, GETDATE(), GETDATE())
	,(207,N'منطقه 5 - گلشهر شرقي', 160, GETDATE(), GETDATE())
	,(208,N'منطقه 5 - گلشهر غربي', 160, GETDATE(), GETDATE())
	,(209,N'منطقه 6 - باغستان', 160, GETDATE(), GETDATE())
	,(210,N'منطقه 6 - حصارک بالا', 160, GETDATE(), GETDATE())
	,(211,N'منطقه 6 - دانشگاه تربيت معلم', 160, GETDATE(), GETDATE())
	,(212,N'منطقه 6 - شاهين ويلا', 160, GETDATE(), GETDATE())
	,(213,N'منطقه 6 - گلدشت', 160, GETDATE(), GETDATE())
	,(214,N'منطقه 6 - محدوده دانشگاه تربيت معلم', 160, GETDATE(), GETDATE())
	,(215,N'منطقه 7 - اشتراکي گوهردشت', 160, GETDATE(), GETDATE())
	,(216,N'منطقه 7 - حيدرآباد', 160, GETDATE(), GETDATE())
	,(217,N'منطقه 7 - شهرک اماميه', 160, GETDATE(), GETDATE())
	,(218,N'منطقه 7 - شهرک بهارستان', 160, GETDATE(), GETDATE())
	,(219,N'منطقه 7 - شهرک جهازيها', 160, GETDATE(), GETDATE())
	,(220,N'منطقه 7 - شهرک علي ابن ابيطالب', 160, GETDATE(), GETDATE())
	,(221,N'منطقه 7 - شهرک قائم', 160, GETDATE(), GETDATE())
	,(222,N'منطقه 7 - گوهردشت-فاز دو', 160, GETDATE(), GETDATE())
	,(223,N'منطقه 7 - گوهردشت-فاز سه', 160, GETDATE(), GETDATE())
	,(224,N'منطقه 7 - گوهردشت-فازيک', 160, GETDATE(), GETDATE())
	,(225,N'منطقه 8 - اتحاد', 160, GETDATE(), GETDATE())
	,(226,N'منطقه 8 - جهانشهر', 160, GETDATE(), GETDATE())
	,(227,N'منطقه 8 - حاجي آباد', 160, GETDATE(), GETDATE())
	,(228,N'منطقه 8 - حسن آباد', 160, GETDATE(), GETDATE())
	,(229,N'منطقه 8 - دانشگاه آزاد اسلامي', 160, GETDATE(), GETDATE())
	,(230,N'منطقه 8 - شهرک امام رضا', 160, GETDATE(), GETDATE())
	,(231,N'منطقه 8 - شهرک اوج', 160, GETDATE(), GETDATE())
	,(232,N'منطقه 8 - کوي کارمندان شمالي', 160, GETDATE(), GETDATE())
	,(233,N'منطقه 8 - کوي مدرس', 160, GETDATE(), GETDATE())
	,(234,N'منطقه 8 - ميدان نبوت', 160, GETDATE(), GETDATE())
	,(235,N'منطقه 9 - اصفهانيها-شاه عباسي', 160, GETDATE(), GETDATE())
	,(236,N'منطقه 9 - دولت آباد', 160, GETDATE(), GETDATE())
	,(237,N'منطقه 9 - کارخانه قند', 160, GETDATE(), GETDATE())
	,(238,N'منطقه 9 - کوي کارمندان جنوبي', 160, GETDATE(), GETDATE())
	,(239,N'منطقه 9 - کوي ولي عصر', 160, GETDATE(), GETDATE())
	,(240,N'منطقه 9 - گلشهر ويلاي شرقي', 160, GETDATE(), GETDATE())
	,(241,N'منطقه 9 - مهرويلا', 160, GETDATE(), GETDATE())
	,(242,N'منطقه 9 - ويان - چهارراه طالقاني', 160, GETDATE(), GETDATE())
	,(243,N'منطقه 10 - حافظيه', 160, GETDATE(), GETDATE())
	,(244,N'منطقه 10 - رزکان نو', 160, GETDATE(), GETDATE())
	,(245,N'منطقه 10 - شهرک صنعتي سيمين دشت', 160, GETDATE(), GETDATE())
	,(246,N'منطقه 10 - شهرک نيروگاه توانير', 160, GETDATE(), GETDATE())
	,(247,N'منطقه 10 - شهرک وحدت', 160, GETDATE(), GETDATE())
	,(248,N'منطقه 10 - شهرک هفده شهريور', 160, GETDATE(), GETDATE())
	,(249,N'منطقه 10 - منظريه', 160, GETDATE(), GETDATE())
	,(250,N'منطقه 11 - بيلقان', 160, GETDATE(), GETDATE())
	,(251,N'منطقه 11 - جهان نما', 160, GETDATE(), GETDATE())
	,(252,N'منطقه 11 - چمران', 160, GETDATE(), GETDATE())
	,(253,N'منطقه 11 - شهرک حصار بالا', 160, GETDATE(), GETDATE())
	,(254,N'منطقه 11 - شهرک حصار پايين', 160, GETDATE(), GETDATE())
	,(255,N'منطقه 11 - شهرک خلج آباد', 160, GETDATE(), GETDATE())
	,(256,N'منطقه 11 - شهرک سر جوي', 160, GETDATE(), GETDATE())
	,(257,N'منطقه 11 - شهرک کلاک نو', 160, GETDATE(), GETDATE())
	,(258,N'منطقه 11 - شهرک وسيه', 160, GETDATE(), GETDATE())
	,(259,N'منطقه 11 - کلاک بالا', 160, GETDATE(), GETDATE())
	,(260,N'منطقه 11 - کلاک پايين', 160, GETDATE(), GETDATE())
	,(261,N'منطقه 12 - شهرک آق تپه', 160, GETDATE(), GETDATE())
	,(262,N'منطقه 12 - شهرک باران', 160, GETDATE(), GETDATE())
	,(263,N'منطقه 12 - شهرک سهرابيه', 160, GETDATE(), GETDATE())
	,(264,N'منطقه 12 - شهرک کيانمهر', 160, GETDATE(), GETDATE())
	,(265,N'منطقه 12 - شهرک گلستان1', 160, GETDATE(), GETDATE())
	,(266,N'منطقه 12 - شهرک ولي عصر', 160, GETDATE(), GETDATE())
	,(267,N'منطقه 12 - کاخ مرواريد', 160, GETDATE(), GETDATE())
	,(268,N'منطقه 12 - کوي زنبق', 160, GETDATE(), GETDATE())
	,(269,N'منطقه 12 - کوي مهر', 160, GETDATE(), GETDATE())
	,(270,N'منطقه 1 - اراج', 215, GETDATE(), GETDATE())
	,(271,N'منطقه 1 - ازگل', 215, GETDATE(), GETDATE())
	,(272,N'منطقه 1 - امامزاده قاسم', 215, GETDATE(), GETDATE())
	,(273,N'منطقه 1 - اوین', 215, GETDATE(), GETDATE())
	,(274,N'منطقه 1 - باغ فردوس', 215, GETDATE(), GETDATE())
	,(275,N'منطقه 1 - تجریش', 215, GETDATE(), GETDATE())
	,(276,N'منطقه 1 - جماران', 215, GETDATE(), GETDATE())
	,(277,N'منطقه 1 - چیذر', 215, GETDATE(), GETDATE())
	,(278,N'منطقه 1 - حصار بوعلی', 215, GETDATE(), GETDATE())
	,(279,N'منطقه 1 - حکمت و دزاشیب', 215, GETDATE(), GETDATE())
	,(280,N'منطقه 1 - دارآباد', 215, GETDATE(), GETDATE())
	,(281,N'منطقه 1 - دربند', 215, GETDATE(), GETDATE())
	,(282,N'منطقه 1 - درکه', 215, GETDATE(), GETDATE())
	,(283,N'منطقه 1 - دزاشیب و جوزستان', 215, GETDATE(), GETDATE())
	,(284,N'منطقه 1 - رستم آباد', 215, GETDATE(), GETDATE())
	,(285,N'منطقه 1 - زعفرانیه', 215, GETDATE(), GETDATE())
	,(286,N'منطقه 1 - سوهانک', 215, GETDATE(), GETDATE())
	,(287,N'منطقه 1 - شهرک گلها', 215, GETDATE(), GETDATE())
	,(288,N'منطقه 1 - شهرک محلاتی', 215, GETDATE(), GETDATE())
	,(289,N'منطقه 1 - شهرک نفت', 215, GETDATE(), GETDATE())
	,(290,N'منطقه 1 - قیطریه', 215, GETDATE(), GETDATE())
	,(291,N'منطقه 1 - کاشانک', 215, GETDATE(), GETDATE())
	,(292,N'منطقه 1 - گلاب دره', 215, GETDATE(), GETDATE())
	,(293,N'منطقه 1 - محمودیه', 215, GETDATE(), GETDATE())
	,(294,N'منطقه 1 - نیاوران', 215, GETDATE(), GETDATE())
	,(295,N'منطقه 1 - ولنجک', 215, GETDATE(), GETDATE())
	,(296,N'منطقه 2 - آلستوم', 215, GETDATE(), GETDATE())
	,(297,N'منطقه 2 - اسلام آباد', 215, GETDATE(), GETDATE())
	,(298,N'منطقه 2 - ایوانک', 215, GETDATE(), GETDATE())
	,(299,N'منطقه 2 - پاتریس', 215, GETDATE(), GETDATE())
	,(300,N'منطقه 2 - پردیسان', 215, GETDATE(), GETDATE())
	,(301,N'منطقه 2 - پرواز', 215, GETDATE(), GETDATE())
	,(302,N'منطقه 2 - پونک', 215, GETDATE(), GETDATE())
	,(303,N'منطقه 2 - توحید', 215, GETDATE(), GETDATE())
	,(304,N'منطقه 2 - تهران ویلا', 215, GETDATE(), GETDATE())
	,(305,N'منطقه 2 - چوب تراش', 215, GETDATE(), GETDATE())
	,(306,N'منطقه 2 - خرم رودی', 215, GETDATE(), GETDATE())
	,(307,N'منطقه 2 - درختی', 215, GETDATE(), GETDATE())
	,(308,N'منطقه 2 - دریا', 215, GETDATE(), GETDATE())
	,(309,N'منطقه 2 - زنجان', 215, GETDATE(), GETDATE())
	,(310,N'منطقه 2 - سپهر', 215, GETDATE(), GETDATE())
	,(311,N'منطقه 2 - سرو', 215, GETDATE(), GETDATE())
	,(312,N'منطقه 2 - سعادت آباد', 215, GETDATE(), GETDATE())
	,(313,N'منطقه 2 - شادمهر', 215, GETDATE(), GETDATE())
	,(314,N'منطقه 2 - شهرک آزمایش', 215, GETDATE(), GETDATE())
	,(315,N'منطقه 2 - شهرک بوعلی', 215, GETDATE(), GETDATE())
	,(316,N'منطقه 2 - شهرک غرب', 215, GETDATE(), GETDATE())
	,(317,N'منطقه 2 - شهرک مخابرات', 215, GETDATE(), GETDATE())
	,(318,N'منطقه 2 - شهرک هما', 215, GETDATE(), GETDATE())
	,(319,N'منطقه 2 - صادقیه', 215, GETDATE(), GETDATE())
	,(320,N'منطقه 2 - طرشت', 215, GETDATE(), GETDATE())
	,(321,N'منطقه 2 - فرحزاد', 215, GETDATE(), GETDATE())
	,(322,N'منطقه 2 - کوهسار', 215, GETDATE(), GETDATE())
	,(323,N'منطقه 2 - کوی نصر', 215, GETDATE(), GETDATE())
	,(324,N'منطقه 2 - مدیریت', 215, GETDATE(), GETDATE())
	,(325,N'منطقه 2 - همایون شهر', 215, GETDATE(), GETDATE())
	,(326,N'منطقه 3 - آرارات', 215, GETDATE(), GETDATE())
	,(327,N'منطقه 3 - ارسباران', 215, GETDATE(), GETDATE())
	,(328,N'منطقه 3 - امانیه', 215, GETDATE(), GETDATE())
	,(329,N'منطقه 3 - حسن آباد-زرگنده', 215, GETDATE(), GETDATE())
	,(330,N'منطقه 3 - داودیه', 215, GETDATE(), GETDATE())
	,(331,N'منطقه 3 - درب دوم', 215, GETDATE(), GETDATE())
	,(332,N'منطقه 3 - دروس', 215, GETDATE(), GETDATE())
	,(333,N'منطقه 3 - رستم آباد - اختیاریه', 215, GETDATE(), GETDATE())
	,(334,N'منطقه 3 - قبا', 215, GETDATE(), GETDATE())
	,(335,N'منطقه 3 - قلهک', 215, GETDATE(), GETDATE())
	,(336,N'منطقه 3 - کاووسیه', 215, GETDATE(), GETDATE())
	,(337,N'منطقه 3 - ونک', 215, GETDATE(), GETDATE())
	,(338,N'منطقه 4 - اوقاف', 215, GETDATE(), GETDATE())
	,(339,N'منطقه 4 - تهران پارس شرقی', 215, GETDATE(), GETDATE())
	,(340,N'منطقه 4 - تهران پارس غربی', 215, GETDATE(), GETDATE())
	,(341,N'منطقه 4 - جوادیه', 215, GETDATE(), GETDATE())
	,(342,N'منطقه 4 - حکیمیه', 215, GETDATE(), GETDATE())
	,(343,N'منطقه 4 - خاک سفید', 215, GETDATE(), GETDATE())
	,(344,N'منطقه 4 - شمس آباد و مجیدیه', 215, GETDATE(), GETDATE())
	,(345,N'منطقه 4 - شمیرا نو', 215, GETDATE(), GETDATE())
	,(346,N'منطقه 4 - شهرک ولیعصر و شیان و لویزان', 215, GETDATE(), GETDATE())
	,(347,N'منطقه 4 - ضرابخانه و پاسداران', 215, GETDATE(), GETDATE())
	,(348,N'منطقه 4 - علم و صنعت', 215, GETDATE(), GETDATE())
	,(349,N'منطقه 4 - قاسم آباد و ده نارمک', 215, GETDATE(), GETDATE())
	,(350,N'منطقه 4 - قنات کوثر', 215, GETDATE(), GETDATE())
	,(351,N'منطقه 4 - کاظم آباد', 215, GETDATE(), GETDATE())
	,(352,N'منطقه 4 - کالاد', 215, GETDATE(), GETDATE())
	,(353,N'منطقه 4 - کوهسار', 215, GETDATE(), GETDATE())
	,(354,N'منطقه 4 - مبارک آباد و حسین آباد', 215, GETDATE(), GETDATE())
	,(355,N'منطقه 4 - مجید آباد', 215, GETDATE(), GETDATE())
	,(356,N'منطقه 4 - مهران', 215, GETDATE(), GETDATE())
	,(357,N'منطقه 4 - نارمک', 215, GETDATE(), GETDATE())
	,(358,N'منطقه 5 - المهدی', 215, GETDATE(), GETDATE())
	,(359,N'منطقه 5 - اندیشه', 215, GETDATE(), GETDATE())
	,(360,N'منطقه 5 - باغ فیض', 215, GETDATE(), GETDATE())
	,(361,N'منطقه 5 - بهاران', 215, GETDATE(), GETDATE())
	,(362,N'منطقه 5 - پرواز', 215, GETDATE(), GETDATE())
	,(363,N'منطقه 5 - پونک جنوبی', 215, GETDATE(), GETDATE())
	,(364,N'منطقه 5 - پونک شمالی', 215, GETDATE(), GETDATE())
	,(365,N'منطقه 5 - جنت آباد جنوبی', 215, GETDATE(), GETDATE())
	,(366,N'منطقه 5 - جنت آباد شمالی', 215, GETDATE(), GETDATE())
	,(367,N'منطقه 5 - جنت آباد مرکزی', 215, GETDATE(), GETDATE())
	,(368,N'منطقه 5 - حصارک', 215, GETDATE(), GETDATE())
	,(369,N'منطقه 5 - سازمان آب', 215, GETDATE(), GETDATE())
	,(370,N'منطقه 5 - سازمان برنامه جنوبی', 215, GETDATE(), GETDATE())
	,(371,N'منطقه 5 - سازمان برنامه شمالی', 215, GETDATE(), GETDATE())
	,(372,N'منطقه 5 - شاهین', 215, GETDATE(), GETDATE())
	,(373,N'منطقه 5 - شهر زیبا', 215, GETDATE(), GETDATE())
	,(374,N'منطقه 5 - شهران جنوبی', 215, GETDATE(), GETDATE())
	,(375,N'منطقه 5 - شهران شمالی', 215, GETDATE(), GETDATE())
	,(376,N'منطقه 5 - شهرک آپادانا', 215, GETDATE(), GETDATE())
	,(377,N'منطقه 5 - شهرک اکباتان', 215, GETDATE(), GETDATE())
	,(378,N'منطقه 5 - شهرک کوهسار', 215, GETDATE(), GETDATE())
	,(379,N'منطقه 5 - کن', 215, GETDATE(), GETDATE())
	,(380,N'منطقه 5 - کوی ارم', 215, GETDATE(), GETDATE())
	,(381,N'منطقه 5 - کوی بیمه', 215, GETDATE(), GETDATE())
	,(382,N'منطقه 5 - محله ابوذر', 215, GETDATE(), GETDATE())
	,(383,N'منطقه 5 - محله فردوس', 215, GETDATE(), GETDATE())
	,(384,N'منطقه 5 - مراد آباد', 215, GETDATE(), GETDATE())
	,(385,N'منطقه 5 - مهران', 215, GETDATE(), GETDATE())
	,(386,N'منطقه 5 - نفت', 215, GETDATE(), GETDATE())
	,(387,N'منطقه 6 - آرژانتین - ساعی', 215, GETDATE(), GETDATE())
	,(388,N'منطقه 6 - ایرانشهر', 215, GETDATE(), GETDATE())
	,(389,N'منطقه 6 - بهجت آباد', 215, GETDATE(), GETDATE())
	,(390,N'منطقه 6 - پارک لاله', 215, GETDATE(), GETDATE())
	,(391,N'منطقه 6 - جنت - رفتگر', 215, GETDATE(), GETDATE())
	,(392,N'منطقه 6 - دانشگاه تهران', 215, GETDATE(), GETDATE())
	,(393,N'منطقه 6 - شریعتی', 215, GETDATE(), GETDATE())
	,(394,N'منطقه 6 - شیراز', 215, GETDATE(), GETDATE())
	,(395,N'منطقه 6 - عباس آباد', 215, GETDATE(), GETDATE())
	,(396,N'منطقه 6 - فاطمی', 215, GETDATE(), GETDATE())
	,(397,N'منطقه 6 - قانم مقام- سنائی', 215, GETDATE(), GETDATE())
	,(398,N'منطقه 6 - قزل قلعه', 215, GETDATE(), GETDATE())
	,(399,N'منطقه 6 - کشاورز غربی', 215, GETDATE(), GETDATE())
	,(400,N'منطقه 6 - گاندی', 215, GETDATE(), GETDATE())
	,(401,N'منطقه 6 - میدان جهاد', 215, GETDATE(), GETDATE())
	,(402,N'منطقه 6 - میدان ولیعصر', 215, GETDATE(), GETDATE())
	,(403,N'منطقه 6 - نصرت', 215, GETDATE(), GETDATE())
	,(404,N'منطقه 6 - یوسف آباد- امیرآباد', 215, GETDATE(), GETDATE())
	,(405,N'منطقه 7 - ارامنه جنوبی', 215, GETDATE(), GETDATE())
	,(406,N'منطقه 7 - ارامنه شمالی', 215, GETDATE(), GETDATE())
	,(407,N'منطقه 7 - امجدیه- خاقانی', 215, GETDATE(), GETDATE())
	,(408,N'منطقه 7 - باغ صبا - سهروردی', 215, GETDATE(), GETDATE())
	,(409,N'منطقه 7 - بهار', 215, GETDATE(), GETDATE())
	,(410,N'منطقه 7 - حشمتیه', 215, GETDATE(), GETDATE())
	,(411,N'منطقه 7 - خواجه نصیر -حقوقی', 215, GETDATE(), GETDATE())
	,(412,N'منطقه 7 - خواجه نظام شرقی', 215, GETDATE(), GETDATE())
	,(413,N'منطقه 7 - خواجه نظام غربی', 215, GETDATE(), GETDATE())
	,(414,N'منطقه 7 - دبستان - مجیدیه', 215, GETDATE(), GETDATE())
	,(415,N'منطقه 7 - دهقان', 215, GETDATE(), GETDATE())
	,(416,N'منطقه 7 - شارق شرقی', 215, GETDATE(), GETDATE())
	,(417,N'منطقه 7 - شارق غربی', 215, GETDATE(), GETDATE())
	,(418,N'منطقه 7 - عباس آباد-اندیشه-شهید قندی', 215, GETDATE(), GETDATE())
	,(419,N'منطقه 7 - قصر', 215, GETDATE(), GETDATE())
	,(420,N'منطقه 7 - کاج', 215, GETDATE(), GETDATE())
	,(421,N'منطقه 7 - گرگان', 215, GETDATE(), GETDATE())
	,(422,N'منطقه 7 - نظام آباد', 215, GETDATE(), GETDATE())
	,(423,N'منطقه 7 - نیلوفر - شهید قندی', 215, GETDATE(), GETDATE())
	,(424,N'منطقه 8 - تسلیحات', 215, GETDATE(), GETDATE())
	,(425,N'منطقه 8 - تهران پارس', 215, GETDATE(), GETDATE())
	,(426,N'منطقه 8 - دردشت', 215, GETDATE(), GETDATE())
	,(427,N'منطقه 8 - زرکش', 215, GETDATE(), GETDATE())
	,(428,N'منطقه 8 - فدک', 215, GETDATE(), GETDATE())
	,(429,N'منطقه 8 - کرمان', 215, GETDATE(), GETDATE())
	,(430,N'منطقه 8 - لشکر شرقی', 215, GETDATE(), GETDATE())
	,(431,N'منطقه 8 - لشکر غربی', 215, GETDATE(), GETDATE())
	,(432,N'منطقه 8 - مجدیه', 215, GETDATE(), GETDATE())
	,(433,N'منطقه 8 - مدائن', 215, GETDATE(), GETDATE())
	,(434,N'منطقه 8 - نارمک جنوبی', 215, GETDATE(), GETDATE())
	,(435,N'منطقه 8 - وحیدیه', 215, GETDATE(), GETDATE())
	,(436,N'منطقه 8 - هفت حوض', 215, GETDATE(), GETDATE())
	,(437,N'منطقه 9 - استاد معین', 215, GETDATE(), GETDATE())
	,(438,N'منطقه 9 - امامزاده عبدالله', 215, GETDATE(), GETDATE())
	,(439,N'منطقه 9 - دکترهوشیار', 215, GETDATE(), GETDATE())
	,(440,N'منطقه 9 - سرآسیاب مهرآباد', 215, GETDATE(), GETDATE())
	,(441,N'منطقه 9 - شمشیری', 215, GETDATE(), GETDATE())
	,(442,N'منطقه 9 - شهید دستغیب', 215, GETDATE(), GETDATE())
	,(443,N'منطقه 9 - فتح', 215, GETDATE(), GETDATE())
	,(444,N'منطقه 9 - فرودگاه', 215, GETDATE(), GETDATE())
	,(445,N'منطقه 9 - مهرآباد جنوبی', 215, GETDATE(), GETDATE())
	,(446,N'منطقه 10 - بریانک', 215, GETDATE(), GETDATE())
	,(447,N'منطقه 10 - زنجان جنوبی', 215, GETDATE(), GETDATE())
	,(448,N'منطقه 10 - سرسبیل جنوبی', 215, GETDATE(), GETDATE())
	,(449,N'منطقه 10 - سرسبیل شمالی', 215, GETDATE(), GETDATE())
	,(450,N'منطقه 10 - سلیمانی- تیموری', 215, GETDATE(), GETDATE())
	,(451,N'منطقه 10 - شبیری-جی', 215, GETDATE(), GETDATE())
	,(452,N'منطقه 10 - کارون جنوبی', 215, GETDATE(), GETDATE())
	,(453,N'منطقه 10 - کارون شمالی', 215, GETDATE(), GETDATE())
	,(454,N'منطقه 10 - هاشمی', 215, GETDATE(), GETDATE())
	,(455,N'منطقه 10 - هفت چنار', 215, GETDATE(), GETDATE())
	,(456,N'منطقه 11 - آذربایجان', 215, GETDATE(), GETDATE())
	,(457,N'منطقه 11 - آگاهی', 215, GETDATE(), GETDATE())
	,(458,N'منطقه 11 - اسکندری', 215, GETDATE(), GETDATE())
	,(459,N'منطقه 11 - امیریه', 215, GETDATE(), GETDATE())
	,(460,N'منطقه 11 - انبار نفت', 215, GETDATE(), GETDATE())
	,(461,N'منطقه 11 - باغ شاه-میدان حر', 215, GETDATE(), GETDATE())
	,(462,N'منطقه 11 - جمالزاده-حشمت الدوله', 215, GETDATE(), GETDATE())
	,(463,N'منطقه 11 - جمهوری', 215, GETDATE(), GETDATE())
	,(464,N'منطقه 11 - خرم شهر', 215, GETDATE(), GETDATE())
	,(465,N'منطقه 11 - راه آهن', 215, GETDATE(), GETDATE())
	,(466,N'منطقه 11 - شیخ هادی', 215, GETDATE(), GETDATE())
	,(467,N'منطقه 11 - عباسی', 215, GETDATE(), GETDATE())
	,(468,N'منطقه 11 - فروزش-امیر بهادر', 215, GETDATE(), GETDATE())
	,(469,N'منطقه 11 - فلسطین', 215, GETDATE(), GETDATE())
	,(470,N'منطقه 11 - قلمستان-برادران جوادیان', 215, GETDATE(), GETDATE())
	,(471,N'منطقه 11 - مخصوص', 215, GETDATE(), GETDATE())
	,(472,N'منطقه 11 - منیریه', 215, GETDATE(), GETDATE())
	,(473,N'منطقه 11 - هلال احمر', 215, GETDATE(), GETDATE())
	,(474,N'منطقه 12 - آبشار', 215, GETDATE(), GETDATE())
	,(475,N'منطقه 12 - ارگ - پامنار', 215, GETDATE(), GETDATE())
	,(476,N'منطقه 12 - امامزاده یحیی', 215, GETDATE(), GETDATE())
	,(477,N'منطقه 12 - ایران', 215, GETDATE(), GETDATE())
	,(478,N'منطقه 12 - بازار', 215, GETDATE(), GETDATE())
	,(479,N'منطقه 12 - بهارستان', 215, GETDATE(), GETDATE())
	,(480,N'منطقه 12 - تختي', 215, GETDATE(), GETDATE())
	,(481,N'منطقه 12 - دروازه شمیران', 215, GETDATE(), GETDATE())
	,(482,N'منطقه 12 - سنگلج', 215, GETDATE(), GETDATE())
	,(483,N'منطقه 12 - شهید هرندی', 215, GETDATE(), GETDATE())
	,(484,N'منطقه 12 - فردوسی', 215, GETDATE(), GETDATE())
	,(485,N'منطقه 12 - قیام', 215, GETDATE(), GETDATE())
	,(486,N'منطقه 12 - کوثر', 215, GETDATE(), GETDATE())
	,(487,N'منطقه 13 - آشتیانی', 215, GETDATE(), GETDATE())
	,(488,N'منطقه 13 - امامت', 215, GETDATE(), GETDATE())
	,(489,N'منطقه 13 - حافظ', 215, GETDATE(), GETDATE())
	,(490,N'منطقه 13 - حافظیه', 215, GETDATE(), GETDATE())
	,(491,N'منطقه 13 - دهقان', 215, GETDATE(), GETDATE())
	,(492,N'منطقه 13 - زاهد گیلانی', 215, GETDATE(), GETDATE())
	,(493,N'منطقه 13 - زینبیه', 215, GETDATE(), GETDATE())
	,(494,N'منطقه 13 - سرخه حصار', 215, GETDATE(), GETDATE())
	,(495,N'منطقه 13 - شورا', 215, GETDATE(), GETDATE())
	,(496,N'منطقه 13 - شهید اسدی', 215, GETDATE(), GETDATE())
	,(497,N'منطقه 13 - صفا', 215, GETDATE(), GETDATE())
	,(498,N'منطقه 13 - قاسم آباد', 215, GETDATE(), GETDATE())
	,(499,N'منطقه 13 - نیروی هوایی', 215, GETDATE(), GETDATE())
	,(500,N'منطقه 14 - آهنگ', 215, GETDATE(), GETDATE())
	,(501,N'منطقه 14 - آهنگران', 215, GETDATE(), GETDATE())
	,(502,N'منطقه 14 - ابوذر', 215, GETDATE(), GETDATE())
	,(503,N'منطقه 14 - بروجردی', 215, GETDATE(), GETDATE())
	,(504,N'منطقه 14 - پرستار', 215, GETDATE(), GETDATE())
	,(505,N'منطقه 14 - تاکسیرانی', 215, GETDATE(), GETDATE())
	,(506,N'منطقه 14 - جابری', 215, GETDATE(), GETDATE())
	,(507,N'منطقه 14 - جوادیه', 215, GETDATE(), GETDATE())
	,(508,N'منطقه 14 - چهارصددستگاه', 215, GETDATE(), GETDATE())
	,(509,N'منطقه 14 - خاوران', 215, GETDATE(), GETDATE())
	,(510,N'منطقه 14 - دژکام', 215, GETDATE(), GETDATE())
	,(511,N'منطقه 14 - دولاب', 215, GETDATE(), GETDATE())
	,(512,N'منطقه 14 - سیزده آبان', 215, GETDATE(), GETDATE())
	,(513,N'منطقه 14 - شاهین', 215, GETDATE(), GETDATE())
	,(514,N'منطقه 14 - شکوفه', 215, GETDATE(), GETDATE())
	,(515,N'منطقه 14 - شکیب', 215, GETDATE(), GETDATE())
	,(516,N'منطقه 14 - شهرابی', 215, GETDATE(), GETDATE())
	,(517,N'منطقه 14 - شیوا', 215, GETDATE(), GETDATE())
	,(518,N'منطقه 14 - صددستگاه', 215, GETDATE(), GETDATE())
	,(519,N'منطقه 14 - فرزانه', 215, GETDATE(), GETDATE())
	,(520,N'منطقه 14 - قصر فیروزه', 215, GETDATE(), GETDATE())
	,(521,N'منطقه 14 - مینای جنوبی', 215, GETDATE(), GETDATE())
	,(522,N'منطقه 14 - مینای شمالی', 215, GETDATE(), GETDATE())
	,(523,N'منطقه 14 - نبی اکرم', 215, GETDATE(), GETDATE())
	,(524,N'منطقه 14 - نیکنام', 215, GETDATE(), GETDATE())
	,(525,N'منطقه 15 - ابوذر', 215, GETDATE(), GETDATE())
	,(526,N'منطقه 15 - اتابک', 215, GETDATE(), GETDATE())
	,(527,N'منطقه 15 - اسلام آباد - ولفجر', 215, GETDATE(), GETDATE())
	,(528,N'منطقه 15 - افسریه بالا', 215, GETDATE(), GETDATE())
	,(529,N'منطقه 15 - افسریه پایین', 215, GETDATE(), GETDATE())
	,(530,N'منطقه 15 - دهقان', 215, GETDATE(), GETDATE())
	,(531,N'منطقه 15 - شوش', 215, GETDATE(), GETDATE())
	,(532,N'منطقه 15 - شهرک رضویه', 215, GETDATE(), GETDATE())
	,(533,N'منطقه 15 - طیب', 215, GETDATE(), GETDATE())
	,(534,N'منطقه 15 - کیان شهر بالا', 215, GETDATE(), GETDATE())
	,(535,N'منطقه 15 - کیان شهر پایین', 215, GETDATE(), GETDATE())
	,(536,N'منطقه 15 - مسعودیه', 215, GETDATE(), GETDATE())
	,(537,N'منطقه 15 - مشیریه', 215, GETDATE(), GETDATE())
	,(538,N'منطقه 15 - مطهری', 215, GETDATE(), GETDATE())
	,(539,N'منطقه 15 - مظاهری', 215, GETDATE(), GETDATE())
	,(540,N'منطقه 15 - مینایی', 215, GETDATE(), GETDATE())
	,(541,N'منطقه 15 - ولیعصر', 215, GETDATE(), GETDATE())
	,(542,N'منطقه 15 - هاشم آباد', 215, GETDATE(), GETDATE())
	,(543,N'منطقه 16 - باغ آذری', 215, GETDATE(), GETDATE())
	,(544,N'منطقه 16 - تختي', 215, GETDATE(), GETDATE())
	,(545,N'منطقه 16 - جوادیه', 215, GETDATE(), GETDATE())
	,(546,N'منطقه 16 - خزانه', 215, GETDATE(), GETDATE())
	,(547,N'منطقه 16 - شهرک بعثت', 215, GETDATE(), GETDATE())
	,(548,N'منطقه 16 - علی آباد جنوبی', 215, GETDATE(), GETDATE())
	,(549,N'منطقه 16 - علی آباد شمالی', 215, GETDATE(), GETDATE())
	,(550,N'منطقه 16 - نازی آباد', 215, GETDATE(), GETDATE())
	,(551,N'منطقه 16 - یاخچی آباد(رضوان)', 215, GETDATE(), GETDATE())
	,(552,N'منطقه 17 - آذری', 215, GETDATE(), GETDATE())
	,(553,N'منطقه 17 - امام زاده حسن', 215, GETDATE(), GETDATE())
	,(554,N'منطقه 17 - باغ خزانه', 215, GETDATE(), GETDATE())
	,(555,N'منطقه 17 - بلورسازی', 215, GETDATE(), GETDATE())
	,(556,N'منطقه 17 - جلیلی', 215, GETDATE(), GETDATE())
	,(557,N'منطقه 17 - زمزم', 215, GETDATE(), GETDATE())
	,(558,N'منطقه 17 - زهتابی', 215, GETDATE(), GETDATE())
	,(559,N'منطقه 17 - فلاح', 215, GETDATE(), GETDATE())
	,(560,N'منطقه 17 - گلچین', 215, GETDATE(), GETDATE())
	,(561,N'منطقه 17 - مقدم', 215, GETDATE(), GETDATE())
	,(562,N'منطقه 17 - وصفنارد', 215, GETDATE(), GETDATE())
	,(563,N'منطقه 17 - یافت آباد', 215, GETDATE(), GETDATE())
	,(564,N'منطقه 18 - بهداشت', 215, GETDATE(), GETDATE())
	,(565,N'منطقه 18 - تولید دارو', 215, GETDATE(), GETDATE())
	,(566,N'منطقه 18 - حسینی -فردوس', 215, GETDATE(), GETDATE())
	,(567,N'منطقه 18 - خلیج فارس جنوبی', 215, GETDATE(), GETDATE())
	,(568,N'منطقه 18 - خلیج فارس شمالی', 215, GETDATE(), GETDATE())
	,(569,N'منطقه 18 - شاد آباد', 215, GETDATE(), GETDATE())
	,(570,N'منطقه 18 - شمس آباد', 215, GETDATE(), GETDATE())
	,(571,N'منطقه 18 - شهرک امام خمینی', 215, GETDATE(), GETDATE())
	,(572,N'منطقه 18 - شهید رجائی', 215, GETDATE(), GETDATE())
	,(573,N'منطقه 18 - صاحب الزمان', 215, GETDATE(), GETDATE())
	,(574,N'منطقه 18 - صادقيه', 215, GETDATE(), GETDATE())
	,(575,N'منطقه 18 - ولیعصر جنوبی', 215, GETDATE(), GETDATE())
	,(576,N'منطقه 18 - ولیعصر شمالی', 215, GETDATE(), GETDATE())
	,(577,N'منطقه 18 - هفده شهریور', 215, GETDATE(), GETDATE())
	,(578,N'منطقه 18 - یافت آباد جنوبی', 215, GETDATE(), GETDATE())
	,(579,N'منطقه 18 - یافت آباد شمالی', 215, GETDATE(), GETDATE())
	,(580,N'منطقه 19 - اسفندیاری وبستان', 215, GETDATE(), GETDATE())
	,(581,N'منطقه 19 - اسماعیل آباد', 215, GETDATE(), GETDATE())
	,(582,N'منطقه 19 - بهمنیار', 215, GETDATE(), GETDATE())
	,(583,N'منطقه 19 - خانی آباد نو جنوبی', 215, GETDATE(), GETDATE())
	,(584,N'منطقه 19 - خانی آباد نو شمالی', 215, GETDATE(), GETDATE())
	,(585,N'منطقه 19 - دولت خواه', 215, GETDATE(), GETDATE())
	,(586,N'منطقه 19 - شریعتی جنوبی', 215, GETDATE(), GETDATE())
	,(587,N'منطقه 19 - شریعتی شمالی', 215, GETDATE(), GETDATE())
	,(588,N'منطقه 19 - شکوفه جنوبی', 215, GETDATE(), GETDATE())
	,(589,N'منطقه 19 - شکوفه شمالی', 215, GETDATE(), GETDATE())
	,(590,N'منطقه 19 - شهرک احمد خمینی', 215, GETDATE(), GETDATE())
	,(591,N'منطقه 19 - شهرک رسالت', 215, GETDATE(), GETDATE())
	,(592,N'منطقه 19 - شهید کاظمی', 215, GETDATE(), GETDATE())
	,(593,N'منطقه 19 - عبدل آباد', 215, GETDATE(), GETDATE())
	,(594,N'منطقه 19 - علی آباد', 215, GETDATE(), GETDATE())
	,(595,N'منطقه 19 - قلعه مرغی', 215, GETDATE(), GETDATE())
	,(596,N'منطقه 19 - نعمت آباد', 215, GETDATE(), GETDATE())
	,(597,N'منطقه 20 - استخر', 215, GETDATE(), GETDATE())
	,(598,N'منطقه 20 - اقدسیه', 215, GETDATE(), GETDATE())
	,(599,N'منطقه 20 - باروت کوبی', 215, GETDATE(), GETDATE())
	,(600,N'منطقه 20 - تقی آبد', 215, GETDATE(), GETDATE())
	,(601,N'منطقه 20 - جوانمرد قصاب', 215, GETDATE(), GETDATE())
	,(602,N'منطقه 20 - حمزه آباد', 215, GETDATE(), GETDATE())
	,(603,N'منطقه 20 - دولت آباد', 215, GETDATE(), GETDATE())
	,(604,N'منطقه 20 - دیلمان', 215, GETDATE(), GETDATE())
	,(605,N'منطقه 20 - سرتخت', 215, GETDATE(), GETDATE())
	,(606,N'منطقه 20 - سیزده آبان', 215, GETDATE(), GETDATE())
	,(607,N'منطقه 20 - شهادت', 215, GETDATE(), GETDATE())
	,(608,N'منطقه 20 - شهید بهشتی', 215, GETDATE(), GETDATE())
	,(609,N'منطقه 20 - شهید غیوری-ابن بابویه', 215, GETDATE(), GETDATE())
	,(610,N'منطقه 20 - صفاییه', 215, GETDATE(), GETDATE())
	,(611,N'منطقه 20 - ظهیر آباد و ابن بابویه', 215, GETDATE(), GETDATE())
	,(612,N'منطقه 20 - علایین', 215, GETDATE(), GETDATE())
	,(613,N'منطقه 20 - عیاس آباد', 215, GETDATE(), GETDATE())
	,(614,N'منطقه 20 - فیروز آبادی', 215, GETDATE(), GETDATE())
	,(615,N'منطقه 20 - منصوریه منگل', 215, GETDATE(), GETDATE())
	,(616,N'منطقه 20 - ولی آباد', 215, GETDATE(), GETDATE())
	,(617,N'منطقه 20 - هاشم آباد', 215, GETDATE(), GETDATE())
	,(618,N'منطقه 21 - باشگاه نفت', 215, GETDATE(), GETDATE())
	,(619,N'منطقه 21 - تهرانسر شرقی', 215, GETDATE(), GETDATE())
	,(620,N'منطقه 21 - تهرانسر شمالی', 215, GETDATE(), GETDATE())
	,(621,N'منطقه 21 - تهرانسر غربی', 215, GETDATE(), GETDATE())
	,(622,N'منطقه 21 - تهرانسر مرکزی', 215, GETDATE(), GETDATE())
	,(623,N'منطقه 21 - چیتگر جنوبی', 215, GETDATE(), GETDATE())
	,(624,N'منطقه 21 - چیتگر شمالی', 215, GETDATE(), GETDATE())
	,(625,N'منطقه 21 - شهرک آزادی', 215, GETDATE(), GETDATE())
	,(626,N'منطقه 21 - شهرک استقلال', 215, GETDATE(), GETDATE())
	,(627,N'منطقه 21 - شهرک پاسداران', 215, GETDATE(), GETDATE())
	,(628,N'منطقه 21 - شهرک دانشگاه تهران', 215, GETDATE(), GETDATE())
	,(629,N'منطقه 21 - شهرک دریا', 215, GETDATE(), GETDATE())
	,(630,N'منطقه 21 - شهرک شهرداری', 215, GETDATE(), GETDATE())
	,(631,N'منطقه 21 - شهرک غزالی', 215, GETDATE(), GETDATE())
	,(632,N'منطقه 21 - شهرک فرهنگیان', 215, GETDATE(), GETDATE())
	,(633,N'منطقه 21 - ورداورد', 215, GETDATE(), GETDATE())
	,(634,N'منطقه 21 - ویلا شهر', 215, GETDATE(), GETDATE())
	,(635,N'منطقه 22 - آبشار تهران', 215, GETDATE(), GETDATE())
	,(636,N'منطقه 22 - پژوهش شمالي', 215, GETDATE(), GETDATE())
	,(637,N'منطقه 22 - چيتگر - آزاد شهر', 215, GETDATE(), GETDATE())
	,(638,N'منطقه 22 - دهکده المپيک', 215, GETDATE(), GETDATE())
	,(639,N'منطقه 22 - زيبادشت', 215, GETDATE(), GETDATE())
	,(640,N'منطقه 22 - شهرک شهيد خرازي', 215, GETDATE(), GETDATE())
	,(641,N'منطقه 22 - شهرک صدرا', 215, GETDATE(), GETDATE())
	,(642,N'منطقه 22 - گلستان شرقي', 215, GETDATE(), GETDATE())
	,(643,N'منطقه 22 - گلستان غربي', 215, GETDATE(), GETDATE())
	,(644,N'منطقه 1 - آبکوه - سعدآباد', 287, GETDATE(), GETDATE())
	,(645,N'منطقه 1 - احمدآباد', 287, GETDATE(), GETDATE())
	,(646,N'منطقه 1 - ارشاد', 287, GETDATE(), GETDATE())
	,(647,N'منطقه 1 - بهشتي', 287, GETDATE(), GETDATE())
	,(648,N'منطقه 1 - راهنمايي', 287, GETDATE(), GETDATE())
	,(649,N'منطقه 1 - سجاد', 287, GETDATE(), GETDATE())
	,(650,N'منطقه 1 - سعدآباد', 287, GETDATE(), GETDATE())
	,(651,N'منطقه 1 - سناباد', 287, GETDATE(), GETDATE())
	,(652,N'منطقه 1 - فلسطين', 287, GETDATE(), GETDATE())
	,(653,N'منطقه 1 - کلاهدوز', 287, GETDATE(), GETDATE())
	,(654,N'منطقه 1 - گوهرشاد', 287, GETDATE(), GETDATE())
	,(655,N'منطقه 2 - آيت الله عبادي', 287, GETDATE(), GETDATE())
	,(656,N'منطقه 2 - ايثارگران', 287, GETDATE(), GETDATE())
	,(657,N'منطقه 2 - بهاران', 287, GETDATE(), GETDATE())
	,(658,N'منطقه 2 - پرديس', 287, GETDATE(), GETDATE())
	,(659,N'منطقه 2 - حجت', 287, GETDATE(), GETDATE())
	,(660,N'منطقه 2 - حضرت ابوطالب - گلبرگ', 287, GETDATE(), GETDATE())
	,(661,N'منطقه 2 - حضرت عبدالمطلب - قائم عج', 287, GETDATE(), GETDATE())
	,(662,N'منطقه 2 - زرکش', 287, GETDATE(), GETDATE())
	,(663,N'منطقه 2 - سپاد - شهرک امام حسين', 287, GETDATE(), GETDATE())
	,(664,N'منطقه 2 - سمزقند', 287, GETDATE(), GETDATE())
	,(665,N'منطقه 2 - شفا', 287, GETDATE(), GETDATE())
	,(666,N'منطقه 2 - شهيد مطهري', 287, GETDATE(), GETDATE())
	,(667,N'منطقه 2 - شهيدمطهري', 287, GETDATE(), GETDATE())
	,(668,N'منطقه 2 - شهيدهنرور', 287, GETDATE(), GETDATE())
	,(669,N'منطقه 2 - عامل', 287, GETDATE(), GETDATE())
	,(670,N'منطقه 2 - فدک', 287, GETDATE(), GETDATE())
	,(671,N'منطقه 2 - فرامرز عباسي', 287, GETDATE(), GETDATE())
	,(672,N'منطقه 2 - قائم', 287, GETDATE(), GETDATE())
	,(673,N'منطقه 2 - کارخانه قند - جانبازان', 287, GETDATE(), GETDATE())
	,(674,N'منطقه 2 - کوي امير المومنين', 287, GETDATE(), GETDATE())
	,(675,N'منطقه 2 - مشهدقلي', 287, GETDATE(), GETDATE())
	,(676,N'منطقه 2 - موسوي قوچاني', 287, GETDATE(), GETDATE())
	,(677,N'منطقه 2 - مهدي آباد', 287, GETDATE(), GETDATE())
	,(678,N'منطقه 2 - نان رضوي', 287, GETDATE(), GETDATE())
	,(679,N'منطقه 2 - نوده', 287, GETDATE(), GETDATE())
	,(680,N'منطقه 2 - نويد', 287, GETDATE(), GETDATE())
	,(681,N'منطقه 3 - بلال', 287, GETDATE(), GETDATE())
	,(682,N'منطقه 3 - بهمن', 287, GETDATE(), GETDATE())
	,(683,N'منطقه 3 - خواجه ربيع', 287, GETDATE(), GETDATE())
	,(684,N'منطقه 3 - دروي', 287, GETDATE(), GETDATE())
	,(685,N'منطقه 3 - راه آهن', 287, GETDATE(), GETDATE())
	,(686,N'منطقه 3 - رسالت', 287, GETDATE(), GETDATE())
	,(687,N'منطقه 3 - سيس آباد', 287, GETDATE(), GETDATE())
	,(688,N'منطقه 3 - طبرسي شمالي', 287, GETDATE(), GETDATE())
	,(689,N'منطقه 3 - فاطميه', 287, GETDATE(), GETDATE())
	,(690,N'منطقه 3 - گاز', 287, GETDATE(), GETDATE())
	,(691,N'منطقه 3 - هاشمي نژاد', 287, GETDATE(), GETDATE())
	,(692,N'منطقه 4 - ابوذر', 287, GETDATE(), GETDATE())
	,(693,N'منطقه 4 - ايثار', 287, GETDATE(), GETDATE())
	,(694,N'منطقه 4 - پنج تن', 287, GETDATE(), GETDATE())
	,(695,N'منطقه 4 - پنج تن آل عبا', 287, GETDATE(), GETDATE())
	,(696,N'منطقه 4 - تلگرد', 287, GETDATE(), GETDATE())
	,(697,N'منطقه 4 - رده', 287, GETDATE(), GETDATE())
	,(698,N'منطقه 4 - شهيدقرباني', 287, GETDATE(), GETDATE())
	,(699,N'منطقه 4 - طلاب', 287, GETDATE(), GETDATE())
	,(700,N'منطقه 4 - گلشور - بهشت', 287, GETDATE(), GETDATE())
	,(701,N'منطقه 4 - وحيد', 287, GETDATE(), GETDATE())
	,(702,N'منطقه 5 - اميرالمومنين', 287, GETDATE(), GETDATE())
	,(703,N'منطقه 5 - ثامن', 287, GETDATE(), GETDATE())
	,(704,N'منطقه 5 - حسين آباد', 287, GETDATE(), GETDATE())
	,(705,N'منطقه 5 - رضاييه', 287, GETDATE(), GETDATE())
	,(706,N'منطقه 5 - سجاديه', 287, GETDATE(), GETDATE())
	,(707,N'منطقه 5 - شهيد آويني', 287, GETDATE(), GETDATE())
	,(708,N'منطقه 5 - مهدي آباد', 287, GETDATE(), GETDATE())
	,(709,N'منطقه 5 - مهرآباد', 287, GETDATE(), GETDATE())
	,(710,N'منطقه 5 - نيزه', 287, GETDATE(), GETDATE())
	,(711,N'منطقه 6 - آقا مصطفي خميني', 287, GETDATE(), GETDATE())
	,(712,N'منطقه 6 - اروند', 287, GETDATE(), GETDATE())
	,(713,N'منطقه 6 - اميرآباد', 287, GETDATE(), GETDATE())
	,(714,N'منطقه 6 - انصار', 287, GETDATE(), GETDATE())
	,(715,N'منطقه 6 - پورسينا', 287, GETDATE(), GETDATE())
	,(716,N'منطقه 6 - چهنو', 287, GETDATE(), GETDATE())
	,(717,N'منطقه 6 - شهرک شيرين', 287, GETDATE(), GETDATE())
	,(718,N'منطقه 6 - شهيدباهنر', 287, GETDATE(), GETDATE())
	,(719,N'منطقه 6 - شهيدمعقول', 287, GETDATE(), GETDATE())
	,(720,N'منطقه 6 - شيرودي', 287, GETDATE(), GETDATE())
	,(721,N'منطقه 6 - کارمندان اول', 287, GETDATE(), GETDATE())
	,(722,N'منطقه 6 - کارمندان دوم', 287, GETDATE(), GETDATE())
	,(723,N'منطقه 6 - کشاورز', 287, GETDATE(), GETDATE())
	,(724,N'منطقه 6 - محمدآباد', 287, GETDATE(), GETDATE())
	,(725,N'منطقه 6 - مصلي', 287, GETDATE(), GETDATE())
	,(726,N'منطقه 6 - موعود', 287, GETDATE(), GETDATE())
	,(727,N'منطقه 7 - 17شهريور', 287, GETDATE(), GETDATE())
	,(728,N'منطقه 7 - ابوذر', 287, GETDATE(), GETDATE())
	,(729,N'منطقه 7 - المهدي', 287, GETDATE(), GETDATE())
	,(730,N'منطقه 7 - انقلاب', 287, GETDATE(), GETDATE())
	,(731,N'منطقه 7 - ايوان', 287, GETDATE(), GETDATE())
	,(732,N'منطقه 7 - بهارستان', 287, GETDATE(), GETDATE())
	,(733,N'منطقه 7 - پروين اعتصامي', 287, GETDATE(), GETDATE())
	,(734,N'منطقه 7 - رباط', 287, GETDATE(), GETDATE())
	,(735,N'منطقه 7 - سيدي', 287, GETDATE(), GETDATE())
	,(736,N'منطقه 7 - طرق', 287, GETDATE(), GETDATE())
	,(737,N'منطقه 7 - عسگريه', 287, GETDATE(), GETDATE())
	,(738,N'منطقه 7 - عنصري', 287, GETDATE(), GETDATE())
	,(739,N'منطقه 7 - فرودگاه', 287, GETDATE(), GETDATE())
	,(740,N'منطقه 7 - کارگران', 287, GETDATE(), GETDATE())
	,(741,N'منطقه 7 - کوشش', 287, GETDATE(), GETDATE())
	,(742,N'منطقه 7 - کوي پليس', 287, GETDATE(), GETDATE())
	,(743,N'منطقه 7 - مقدم', 287, GETDATE(), GETDATE())
	,(744,N'منطقه 7 - وليعصر', 287, GETDATE(), GETDATE())
	,(745,N'منطقه 8 - 10 دي', 287, GETDATE(), GETDATE())
	,(746,N'منطقه 8 - آيت الله خامنه اي', 287, GETDATE(), GETDATE())
	,(747,N'منطقه 8 - امام خميني', 287, GETDATE(), GETDATE())
	,(748,N'منطقه 8 - امام رضا', 287, GETDATE(), GETDATE())
	,(749,N'منطقه 8 - ايمان', 287, GETDATE(), GETDATE())
	,(750,N'منطقه 8 - بهشتي', 287, GETDATE(), GETDATE())
	,(751,N'منطقه 8 - جنت', 287, GETDATE(), GETDATE())
	,(752,N'منطقه 8 - خرمشهر', 287, GETDATE(), GETDATE())
	,(753,N'منطقه 8 - دانش', 287, GETDATE(), GETDATE())
	,(754,N'منطقه 8 - سراب', 287, GETDATE(), GETDATE())
	,(755,N'منطقه 8 - سلام', 287, GETDATE(), GETDATE())
	,(756,N'منطقه 8 - گوهسنگي', 287, GETDATE(), GETDATE())
	,(757,N'منطقه 9 - آب و برق', 287, GETDATE(), GETDATE())
	,(758,N'منطقه 9 - اقبال', 287, GETDATE(), GETDATE())
	,(759,N'منطقه 9 - بهارستان', 287, GETDATE(), GETDATE())
	,(760,N'منطقه 9 - چهارچشمه', 287, GETDATE(), GETDATE())
	,(761,N'منطقه 9 - حافظ', 287, GETDATE(), GETDATE())
	,(762,N'منطقه 9 - رضاشهر', 287, GETDATE(), GETDATE())
	,(763,N'منطقه 9 - سرافرازان', 287, GETDATE(), GETDATE())
	,(764,N'منطقه 9 - شهرآرا', 287, GETDATE(), GETDATE())
	,(765,N'منطقه 9 - کوثر', 287, GETDATE(), GETDATE())
	,(766,N'منطقه 9 - نوفل لوشاتو', 287, GETDATE(), GETDATE())
	,(767,N'منطقه 9 - نيروهوايي', 287, GETDATE(), GETDATE())
	,(768,N'منطقه 9 - هنرستان', 287, GETDATE(), GETDATE())
	,(769,N'منطقه 10 - استاد يوسفي', 287, GETDATE(), GETDATE())
	,(770,N'منطقه 10 - امام هادي', 287, GETDATE(), GETDATE())
	,(771,N'منطقه 10 - اماميه', 287, GETDATE(), GETDATE())
	,(772,N'منطقه 10 - ايثارگران', 287, GETDATE(), GETDATE())
	,(773,N'منطقه 10 - حجاب', 287, GETDATE(), GETDATE())
	,(774,N'منطقه 10 - خاتم الانبياء', 287, GETDATE(), GETDATE())
	,(775,N'منطقه 10 - رازي', 287, GETDATE(), GETDATE())
	,(776,N'منطقه 10 - رسالت', 287, GETDATE(), GETDATE())
	,(777,N'منطقه 10 - شاهد', 287, GETDATE(), GETDATE())
	,(778,N'منطقه 10 - فرهنگيان', 287, GETDATE(), GETDATE())
	,(779,N'منطقه 10 - لشگر', 287, GETDATE(), GETDATE())
	,(780,N'منطقه 10 - وليعصر', 287, GETDATE(), GETDATE())
	,(781,N'منطقه 11 - آزادشهر', 287, GETDATE(), GETDATE())
	,(782,N'منطقه 11 - تربيت', 287, GETDATE(), GETDATE())
	,(783,N'منطقه 11 - دانشجو', 287, GETDATE(), GETDATE())
	,(784,N'منطقه 11 - زيبا شهر', 287, GETDATE(), GETDATE())
	,(785,N'منطقه 11 - سيدرضي', 287, GETDATE(), GETDATE())
	,(786,N'منطقه 11 - شريف', 287, GETDATE(), GETDATE())
	,(787,N'منطقه 11 - شهيدرضوي', 287, GETDATE(), GETDATE())
	,(788,N'منطقه 11 - فارق التحصيلان', 287, GETDATE(), GETDATE())
	,(789,N'منطقه 11 - فرهنگ', 287, GETDATE(), GETDATE())
	,(790,N'منطقه 12 - الهيه', 287, GETDATE(), GETDATE())
	,(791,N'منطقه 12 - اميريه', 287, GETDATE(), GETDATE())
	,(792,N'منطقه 12 - جاهدشهر', 287, GETDATE(), GETDATE())
	,(793,N'منطقه 12 - وکيل آباد', 287, GETDATE(), GETDATE())
	,(794,N'منطقه 13 - بالا خيابان', 287, GETDATE(), GETDATE())
	,(795,N'منطقه 13 - پايين خيابان', 287, GETDATE(), GETDATE())
	,(796,N'منطقه 13 - چهار باغ', 287, GETDATE(), GETDATE())
	,(797,N'منطقه 13 - حرم مطهر', 287, GETDATE(), GETDATE())
	,(798,N'منطقه 13 - طبرسي', 287, GETDATE(), GETDATE())
	,(799,N'منطقه 13 - عيدگاه', 287, GETDATE(), GETDATE())
	,(800,N'منطقه 13 - نوغان', 287, GETDATE(), GETDATE())
	,(801,N'ابیوردی', 497, GETDATE(), GETDATE())
	,(802,N'اتحاد', 497, GETDATE(), GETDATE())
	,(803,N'ارام', 497, GETDATE(), GETDATE())
	,(804,N'ارگ کریمخان', 497, GETDATE(), GETDATE())
	,(805,N'امام حسین', 497, GETDATE(), GETDATE())
	,(806,N'امامزاده ابراهیم', 497, GETDATE(), GETDATE())
	,(807,N'امیرکبیر', 497, GETDATE(), GETDATE())
	,(808,N'انجیره', 497, GETDATE(), GETDATE())
	,(809,N'ایثار', 497, GETDATE(), GETDATE())
	,(810,N'بازار', 497, GETDATE(), GETDATE())
	,(811,N'باغ بش', 497, GETDATE(), GETDATE())
	,(812,N'باغ تخت', 497, GETDATE(), GETDATE())
	,(813,N'باهنر', 497, GETDATE(), GETDATE())
	,(814,N'بنی هاشم', 497, GETDATE(), GETDATE())
	,(815,N'بهشتی', 497, GETDATE(), GETDATE())
	,(816,N'بیات', 497, GETDATE(), GETDATE())
	,(817,N'پودنک', 497, GETDATE(), GETDATE())
	,(818,N'چقا', 497, GETDATE(), GETDATE())
	,(819,N'چهار راه نمازی', 497, GETDATE(), GETDATE())
	,(820,N'حافظیه', 497, GETDATE(), GETDATE())
	,(821,N'حسین آباد', 497, GETDATE(), GETDATE())
	,(822,N'حسین آباد سرتل', 497, GETDATE(), GETDATE())
	,(823,N'خاتون', 497, GETDATE(), GETDATE())
	,(824,N'خلیلی', 497, GETDATE(), GETDATE())
	,(825,N'خیام', 497, GETDATE(), GETDATE())
	,(826,N'دانشگاه', 497, GETDATE(), GETDATE())
	,(827,N'دباغخانه', 497, GETDATE(), GETDATE())
	,(828,N'دروازه کازرون', 497, GETDATE(), GETDATE())
	,(829,N'دستغیب', 497, GETDATE(), GETDATE())
	,(830,N'دلگشا', 497, GETDATE(), GETDATE())
	,(831,N'روی سازی', 497, GETDATE(), GETDATE())
	,(832,N'ریاستی', 497, GETDATE(), GETDATE())
	,(833,N'سبویه', 497, GETDATE(), GETDATE())
	,(834,N'سرباغ', 497, GETDATE(), GETDATE())
	,(835,N'سعدیه جنوبی', 497, GETDATE(), GETDATE())
	,(836,N'سعدیه شمالی', 497, GETDATE(), GETDATE())
	,(837,N'سلطان آباد', 497, GETDATE(), GETDATE())
	,(838,N'سنگ آبد', 497, GETDATE(), GETDATE())
	,(839,N'سه راه برق', 497, GETDATE(), GETDATE())
	,(840,N'سیلو', 497, GETDATE(), GETDATE())
	,(841,N'شاه قلی بیگی', 497, GETDATE(), GETDATE())
	,(842,N'شاهیجان', 497, GETDATE(), GETDATE())
	,(843,N'شریف آباد', 497, GETDATE(), GETDATE())
	,(844,N'شقایق', 497, GETDATE(), GETDATE())
	,(845,N'شمس آباد', 497, GETDATE(), GETDATE())
	,(846,N'شهدا', 497, GETDATE(), GETDATE())
	,(847,N'شهرک امام حسین', 497, GETDATE(), GETDATE())
	,(848,N'شهرک امیرکبیر', 497, GETDATE(), GETDATE())
	,(849,N'شهرک بهار(پای کت)', 497, GETDATE(), GETDATE())
	,(850,N'شهرک بهشتی', 497, GETDATE(), GETDATE())
	,(851,N'شهرک پرواز', 497, GETDATE(), GETDATE())
	,(852,N'شهرک حافظ', 497, GETDATE(), GETDATE())
	,(853,N'شهرک صدرا', 497, GETDATE(), GETDATE())
	,(854,N'شهرک مطهری', 497, GETDATE(), GETDATE())
	,(855,N'شهرک ولی عصر', 497, GETDATE(), GETDATE())
	,(856,N'شیخ روزبهان(میانرود)', 497, GETDATE(), GETDATE())
	,(857,N'شیخ علی چوپان', 497, GETDATE(), GETDATE())
	,(858,N'شیشه گری', 497, GETDATE(), GETDATE())
	,(859,N'صابونیها', 497, GETDATE(), GETDATE())
	,(860,N'عفیف آباد جنوبی', 497, GETDATE(), GETDATE())
	,(861,N'عفیف آباد شمالی', 497, GETDATE(), GETDATE())
	,(862,N'غدیر', 497, GETDATE(), GETDATE())
	,(863,N'فردوسی', 497, GETDATE(), GETDATE())
	,(864,N'فرودگاه', 497, GETDATE(), GETDATE())
	,(865,N'فرهنگ شهر', 497, GETDATE(), GETDATE())
	,(866,N'قدمگاه', 497, GETDATE(), GETDATE())
	,(867,N'قصرالدشت', 497, GETDATE(), GETDATE())
	,(868,N'قلعه شاهزاده بیگم', 497, GETDATE(), GETDATE())
	,(869,N'قلعه قبله', 497, GETDATE(), GETDATE())
	,(870,N'قلعه کوتاهی', 497, GETDATE(), GETDATE())
	,(871,N'کتس بس(مهدی آباد)', 497, GETDATE(), GETDATE())
	,(872,N'کوی الزهرا', 497, GETDATE(), GETDATE())
	,(873,N'کوی طلاب', 497, GETDATE(), GETDATE())
	,(874,N'کوی کارمندان سیلو', 497, GETDATE(), GETDATE())
	,(875,N'کیان شهر', 497, GETDATE(), GETDATE())
	,(876,N'گلشن(کشن)', 497, GETDATE(), GETDATE())
	,(877,N'لاوان', 497, GETDATE(), GETDATE())
	,(878,N'لشگری', 497, GETDATE(), GETDATE())
	,(879,N'معالی آباد', 497, GETDATE(), GETDATE())
	,(880,N'نمازی', 497, GETDATE(), GETDATE())
	,(881,N'والفجر', 497, GETDATE(), GETDATE())
	,(882,N'وزیر آباد', 497, GETDATE(), GETDATE())
	,(883,N'وصال شیرازی', 497, GETDATE(), GETDATE())
	,(884,N'ولی عصر', 497, GETDATE(), GETDATE())
	,(885,N'آستانه', 599, GETDATE(), GETDATE())
	,(886,N'باغ پنبه', 599, GETDATE(), GETDATE())
	,(887,N'براسون', 599, GETDATE(), GETDATE())
	,(888,N'پرديسان', 599, GETDATE(), GETDATE())
	,(889,N'جمکران', 599, GETDATE(), GETDATE())
	,(890,N'حاج زينال', 599, GETDATE(), GETDATE())
	,(891,N'خاک فرج', 599, GETDATE(), GETDATE())
	,(892,N'دروازه قلعه', 599, GETDATE(), GETDATE())
			

	INSERT INTO ECNeighborhoods(
	id
	,[name]
	,cityId
	,createdAt
	,updatedAt)
	VALUES  (893,N'سالاريه', 599, GETDATE(), GETDATE())
		,(894,N'سنگ بند', 599, GETDATE(), GETDATE())
		,(895,N'سيد معصومه', 599, GETDATE(), GETDATE())
		,(896,N'سيدان', 599, GETDATE(), GETDATE())
		,(897,N'شاد قلي', 599, GETDATE(), GETDATE())
		,(898,N'شهرک امام حسن', 599, GETDATE(), GETDATE())
		,(899,N'شهرک امام حسين', 599, GETDATE(), GETDATE())
		,(900,N'شهرک امام خميني', 599, GETDATE(), GETDATE())
		,(901,N'شهرک باجک', 599, GETDATE(), GETDATE())
		,(902,N'شهرک توانير', 599, GETDATE(), GETDATE())
		,(903,N'شهرک سازمان آب', 599, GETDATE(), GETDATE())
		,(904,N'شهرک شهدا', 599, GETDATE(), GETDATE())
		,(905,N'شهرک شهرداري', 599, GETDATE(), GETDATE())
		,(906,N'شهرک شهيد بيطرفان - فرهنگيان', 599, GETDATE(), GETDATE())
		,(907,N'شهرک طالقاني', 599, GETDATE(), GETDATE())
		,(908,N'شهرک فاطميه', 599, GETDATE(), GETDATE())
		,(909,N'شهرک فرهنگيان', 599, GETDATE(), GETDATE())
		,(910,N'شهرک قائم', 599, GETDATE(), GETDATE())
		,(911,N'شهرک قدس', 599, GETDATE(), GETDATE())
		,(912,N'شهرک قلعه کامکار', 599, GETDATE(), GETDATE())
		,(913,N'شهرک منتظر المهدي', 599, GETDATE(), GETDATE())
		,(914,N'شهرک مهديه - طلاب', 599, GETDATE(), GETDATE())
		,(915,N'شيخ آباد', 599, GETDATE(), GETDATE())
		,(916,N'صفاشهر', 599, GETDATE(), GETDATE())
		,(917,N'فتح آباد', 599, GETDATE(), GETDATE())
		,(918,N'کاسگري', 599, GETDATE(), GETDATE())
		,(919,N'کوي وليعصر', 599, GETDATE(), GETDATE())
		,(920,N'موسويان', 599, GETDATE(), GETDATE())
		,(921,N'ميرزاييه', 599, GETDATE(), GETDATE())
		,(922,N'نيروگاه', 599, GETDATE(), GETDATE())
		,(923,N'يزدان شهر', 599, GETDATE(), GETDATE())
		,(924,N' سفیل آباد محمود آباد', 959, GETDATE(), GETDATE())
		,(925,N' شهرک شاهدیه  ابرند آباد', 959, GETDATE(), GETDATE())
		,(926,N' شهرک شاهدیه  نصرت آباد', 959, GETDATE(), GETDATE())
		,(927,N' قاسم آبادنو قاسم نقی', 959, GETDATE(), GETDATE())
		,(928,N'اکبر آباد', 959, GETDATE(), GETDATE())
		,(929,N'اکرم آباد', 959, GETDATE(), GETDATE())
		,(930,N'اکرمیه', 959, GETDATE(), GETDATE())
		,(931,N'امام', 959, GETDATE(), GETDATE())
		,(932,N'امام جعفر صادق', 959, GETDATE(), GETDATE())
		,(933,N'اهرستان', 959, GETDATE(), GETDATE())
		,(934,N'ایرانشهر', 959, GETDATE(), GETDATE())
		,(935,N'جنت آباد', 959, GETDATE(), GETDATE())
		,(936,N'حسن آباد', 959, GETDATE(), GETDATE())
		,(937,N'حسن آباد مشیر', 959, GETDATE(), GETDATE())
		,(938,N'حمیدیا شهر', 959, GETDATE(), GETDATE())
		,(939,N'خلف خانعلی', 959, GETDATE(), GETDATE())
		,(940,N'خواجه خضر', 959, GETDATE(), GETDATE())
		,(941,N'خیر آباد', 959, GETDATE(), GETDATE())
		,(942,N'دارالشفا', 959, GETDATE(), GETDATE())
		,(943,N'دانشگاه یزد', 959, GETDATE(), GETDATE())
		,(944,N'دروازه قرآن', 959, GETDATE(), GETDATE())
		,(945,N'دولت آباد', 959, GETDATE(), GETDATE())
		,(946,N'رحمت آباد', 959, GETDATE(), GETDATE())
		,(947,N'سرسنگ', 959, GETDATE(), GETDATE())
		,(948,N'سلسبیل', 959, GETDATE(), GETDATE())
		,(949,N'سید صحرا', 959, GETDATE(), GETDATE())
		,(950,N'سید فتح الدین رضا', 959, GETDATE(), GETDATE())
		,(951,N'سید نصرالدین', 959, GETDATE(), GETDATE())
		,(952,N'شهرک آزادشهر', 959, GETDATE(), GETDATE())
		,(953,N'شهرک امام رضا', 959, GETDATE(), GETDATE())
		,(954,N'شهرک امام شهر', 959, GETDATE(), GETDATE())
		,(955,N'شهرک بهاران', 959, GETDATE(), GETDATE())
		,(956,N'شهرک دانشگاه', 959, GETDATE(), GETDATE())
		,(957,N'شهرک رزمندگان', 959, GETDATE(), GETDATE())
		,(958,N'شهرک شهید صدوقی', 959, GETDATE(), GETDATE())
		,(959,N'شهرک صنعتی', 959, GETDATE(), GETDATE())
		,(960,N'شهرک فرهنگیان', 959, GETDATE(), GETDATE())
		,(961,N'شهرک فولاد آلیاژی', 959, GETDATE(), GETDATE())
		,(962,N'شهرک ولی عصر', 959, GETDATE(), GETDATE())
		,(963,N'شیخداد', 959, GETDATE(), GETDATE())
		,(964,N'صدا وسیما', 959, GETDATE(), GETDATE())
		,(965,N'صفائیه', 959, GETDATE(), GETDATE())
		,(966,N'عیش آباد', 959, GETDATE(), GETDATE())
		,(967,N'فرودگاه', 959, GETDATE(), GETDATE())
		,(968,N'فهادان', 959, GETDATE(), GETDATE())
		,(969,N'قاسم آباد', 959, GETDATE(), GETDATE())
		,(970,N'قندی', 959, GETDATE(), GETDATE())
		,(971,N'کسنویه', 959, GETDATE(), GETDATE())
		,(972,N'کوچه بیوک', 959, GETDATE(), GETDATE())
		,(973,N'کوی اباذر', 959, GETDATE(), GETDATE())
		,(974,N'کوی ارشاد', 959, GETDATE(), GETDATE())
		,(975,N'کوی امام حسین', 959, GETDATE(), GETDATE())
		,(976,N'کوی پاسدار', 959, GETDATE(), GETDATE())
		,(977,N'کوی پانزده خرداد', 959, GETDATE(), GETDATE())
		,(978,N'کوی توحید', 959, GETDATE(), GETDATE())
		,(979,N'کوی جوادالائمه', 959, GETDATE(), GETDATE())
		,(980,N'کوی حجت', 959, GETDATE(), GETDATE())
		,(981,N'کوی خرمشاه', 959, GETDATE(), GETDATE())
		,(982,N'کوی راه آهن', 959, GETDATE(), GETDATE())
		,(983,N'کوی سادات', 959, GETDATE(), GETDATE())
		,(984,N'کوی سعدی', 959, GETDATE(), GETDATE())
		,(985,N'کوی شاهد', 959, GETDATE(), GETDATE())
		,(986,N'کوی فتح', 959, GETDATE(), GETDATE())
		,(987,N'کوی فجر', 959, GETDATE(), GETDATE())
		,(988,N'کوی فرهنگ', 959, GETDATE(), GETDATE())
		,(989,N'کوی کوثر', 959, GETDATE(), GETDATE())
		,(990,N'کوی لادن', 959, GETDATE(), GETDATE())
		,(991,N'کوی مطهری', 959, GETDATE(), GETDATE())
		,(992,N'کوی ملکی', 959, GETDATE(), GETDATE())
		,(993,N'کوی مولا', 959, GETDATE(), GETDATE())
		,(994,N'کوی نصر', 959, GETDATE(), GETDATE())
		,(995,N'کوی نور', 959, GETDATE(), GETDATE())
		,(996,N'گازرگاه', 959, GETDATE(), GETDATE())
		,(997,N'لب خندق', 959, GETDATE(), GETDATE())
		,(998,N'مالمیر', 959, GETDATE(), GETDATE())
		,(999,N'محمد آباد', 959, GETDATE(), GETDATE())
		,(1000,N'محمود آباد', 959, GETDATE(), GETDATE())
		,(1001,N'محمودیه', 959, GETDATE(), GETDATE())
		,(1002,N'مریم آباد', 959, GETDATE(), GETDATE())
		,(1003,N'ملا فرج الله', 959, GETDATE(), GETDATE())
		,(1004,N'مهدی آباد', 959, GETDATE(), GETDATE())
		,(1005,N'میوه و تره بار', 959, GETDATE(), GETDATE())
		,(1006,N'نصیر آباد', 959, GETDATE(), GETDATE())
		,(1007,N'نعیم آباد', 959, GETDATE(), GETDATE())
		,(1008,N'نیروگاه', 959, GETDATE(), GETDATE())
		,(1009,N'یزدباف', 959, GETDATE(), GETDATE())

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-neighborhoods-Data-v1', GETDATE(), GETDATE()
END

GO

-- ecommerce
-- variation prices
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-variationprices-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('jahizan'))
		)
BEGIN
	
	INSERT INTO ECVariationPrices(id, [name], [required], createdAt, updatedAt)
	SELECT 1, N'اقساطی', 1, GETDATE(), GETDATE()
	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-variationprices-Data-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-variationprices-Data-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN
	
	INSERT INTO ECVariationPrices(id, [name], [required], createdAt, updatedAt)
	SELECT 2, N'نقدی', 0, GETDATE(), GETDATE()
	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-variationprices-Data-v2', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-commentstatuses-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN
	
	INSERT INTO ECProductCommentStatuses(id, [name], createdAt, updatedAt)
	VALUES (1, N'منتشر شده', GETDATE(), GETDATE())
			,(2, N'منتشر نشده', GETDATE(), GETDATE())
	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-commentstatuses-Data-v1', GETDATE(), GETDATE()
END

GO



IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-commentstatuses-Data-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN
	
	INSERT INTO ECProductCommentStatuses(id, [name], createdAt, updatedAt)
	VALUES (3, N'پاسخ توسط ادمین', GETDATE(), GETDATE())
	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-commentstatuses-Data-v2', GETDATE(), GETDATE()
END

GO



IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-inventorytrackchangestatuses-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN
	
	INSERT INTO ECInventoryTrackChangeStatuses(id, [name], createdAt, updatedAt)
	VALUES (1, N'ثبت موجودی', GETDATE(), GETDATE())
			,(2, N'بروزرسانی موجودی', GETDATE(), GETDATE())
			,(3, N'کاهش موجودی به منظور ثبت سفارش', GETDATE(), GETDATE())
			,(4, N'بازگشت موجودی به منظور سفارش پرداخت نشده', GETDATE(), GETDATE())
	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-inventorytrackchangestatuses-Data-v1', GETDATE(), GETDATE()
END

GO



IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-entityTypeSorts-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN
	
	INSERT INTO ECEntityTypeSorts(id, [title], [sortField], [sortOrder], createdAt, updatedAt)
	VALUES (1, N'جدید ترین ها', 'id', 'DESC', GETDATE(), GETDATE())
		,(2, N'قدیمی ترین ها', 'id', 'ASC', GETDATE(), GETDATE())
		,(3, N'گران ترین ها', 'lastPrice', 'DESC', GETDATE(), GETDATE())
		,(4, N'ارزان ترین ها', 'lastPrice', 'ASC', GETDATE(), GETDATE())
		,(5, N'تصادفی', 'randomize', 'ASC', GETDATE(), GETDATE())
			
	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-entityTypeSorts-Data-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'ecommerce-selectedproducttypes-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN
	
	INSERT INTO ECSelectedProductTypes(id, [title], createdAt, updatedAt)
	VALUES (1, N'بر اساس محصول', GETDATE(), GETDATE())
			,(2, N'بر اساس دسته بندی', GETDATE(), GETDATE())
			
	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ecommerce-selectedproducttypes-Data-v1', GETDATE(), GETDATE()
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
			,(3, N'کافه رستوران', getdate(), getdate())
		

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
	VALUES (1, N'دارای آفر', getdate(), getdate())
			,(2, N'اقتصادی', getdate(), getdate())
			,(3, N'شگفت انگیز', getdate(), getdate())
			,(4, N'لاکچری', getdate(), getdate())

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-buffetCost-Data-v1', GETDATE(), GETDATE()
END

GO

-- discount coffe options
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'DiscountCoffe-options-Data-v1' 
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

	INSERT INTO DiscountCoffeOptions(id, title, iconClass,createdAt, updatedAt)
	VALUES (1, N'اسموک روم', 'las la-joint',getdate(), getdate())
			,(2, N'اتاق بازی', 'lni lni-game',getdate(), getdate())
			,(3, N'فضای کودکان', 'lni lni-brush',getdate(), getdate())
			,(4, N'سرو غذا', 'lni lni-dinner',getdate(), getdate())
			,(5, N'برگر', 'lni lni-burger',getdate(), getdate())
			,(6, N'آب میوه', 'lni lni-juice',getdate(), getdate())
			,(7, N'پیتزا', 'lni lni-pizza',getdate(), getdate())
			,(8, N'سلف سرویس', 'lni lni-service',getdate(), getdate())

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'DiscountCoffe-options-Data-v1', GETDATE(), GETDATE()
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

-- vendor role : hint: change the id
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Roles-Data-v2' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ECommerce'))
		)
	
BEGIN
	
	INSERT INTO Roles
	(
		roleName
		,static_id
		,createdAt
		,updatedAt
	) 
	SELECT N'فروشنده', 2, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Roles-Data-v2', GETDATE(), GETDATE()
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


-- courier
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Roles-Data-v3' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ECommerce'))
		)
BEGIN
	
	INSERT INTO Roles
	(
		roleName
		,static_id
		,createdAt
		,updatedAt
	) 
	SELECT N'پیک', 3, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Roles-Data-v3', GETDATE(), GETDATE()
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


-- ecommerce brands
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v6' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 6, N'brands', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v6', GETDATE(), GETDATE()
END

GO



-- ecommerce guarantees
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v7' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 7, N'guarantees', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v7', GETDATE(), GETDATE()
END

GO

-- ecommerce entityTypes
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v8' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 8, N'entityTypes', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v8', GETDATE(), GETDATE()
END

GO


-- ecommerce product-photo
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v9' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 9, N'productTempPhoto', getdate(), getdate()

	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 10, N'product-photo', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v9', GETDATE(), GETDATE()
END

GO


-- ecommerce vendors
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v10' 
			))
BEGIN
	

	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 11, N'vendors', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v10', GETDATE(), GETDATE()
END

GO


-- discount coffe/ coffe galleries
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v11' 
			))
BEGIN
	

	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 12, N'coffe-galleries', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v11', GETDATE(), GETDATE()
END

GO


-- ecommerce banner or slider
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v12' 
			))
BEGIN
	

	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 13, N'bannder-slider', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v12', GETDATE(), GETDATE()
END

GO



-- ecommerce product-video
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v13' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 14, N'productTempVideo', getdate(), getdate()

	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 15, N'product-video', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v13', GETDATE(), GETDATE()
END

GO


-- ecommerce selected-products
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v14' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 16, N'selectedproducts', getdate(), getdate()


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v14', GETDATE(), GETDATE()
END

GO




-- courier settings
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'ec-couriersettings-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ECommerce'))
		)
	
BEGIN
	
	INSERT INTO Settings([key], [value], [type], createdAt, updatedAt)
	SELECT N'BASE_COURIER_PRICE', N'50000', N'number', getdate(), getdate()

	INSERT INTO Settings([key], [value], [type], createdAt, updatedAt)
	SELECT N'COURIER_PRICE_BY_KILOMETRE', N'2000', N'number', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-couriersettings-Data-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'ec-headernotification-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ECommerce'))
		)
	
BEGIN
	
	INSERT INTO Settings([key], [value], [type], createdAt, updatedAt)
	SELECT N'HEADER_NOTIFICATION_TEXT', NULL, N'string', getdate(), getdate()


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-headernotification-Data-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'ec-headernotification-Data-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ECommerce'))
		)
	
BEGIN
	
	INSERT INTO Settings([key], [value], [type], createdAt, updatedAt)
	SELECT N'HEADER_NOTIFICATION_TEXT_COLOR', NULL, N'string', getdate(), getdate()
	
	INSERT INTO Settings([key], [value], [type], createdAt, updatedAt)
	SELECT N'HEADER_NOTIFICATION_BACKGROUND_COLOR', NULL, N'string', getdate(), getdate()


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'ec-headernotification-Data-v2', GETDATE(), GETDATE()
END

GO



IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'gold-currentPrices-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ECommerce'))
		)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('goldongallery'))
		)
	
BEGIN
	
	INSERT INTO Settings([key], [value], [type], createdAt, updatedAt)
	SELECT N'GOLD_CURRENT_PRICE', '1', N'bigint', getdate(), getdate()

	INSERT INTO Settings([key], [value], [type], createdAt, updatedAt)
	SELECT N'GOLD_CURRENT_PRICE_JOB_STATUS', 'true', N'boolean', getdate(), getdate()

	INSERT INTO Settings([key], [value], [type], createdAt, updatedAt)
	SELECT N'GOLD_CURRENT_PRICE_JOB_PROBLEM', 'false', N'boolean', getdate(), getdate()


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gold-currentPrices-Data-v1', GETDATE(), GETDATE()
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

-- discount coffe
-- coffe reports
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v15' 
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

	DECLARE @entityName nvarchar(256) = N'CoffeReports'
	DECLARE @groupName nvarchar(256) = N'discountcoffe.admin.coffereports'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'کافه و رستوران'
	DECLARE @menuName nvarchar(256) = N'گزارش های کافه'
	DECLARE @menuUrl nvarchar(512) = N'/discountcoffe/admin/coffereports'

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
	SELECT 'CORE-Permissions-Data-v15', GETDATE(), GETDATE()
END

GO



-- eav/admin/entityTypes
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v16' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'EntityTypes'
	DECLARE @groupName nvarchar(256) = N'eav.admin.entitytype'
	DECLARE @findParentMenu bit = 0;
	DECLARE @parentMenuName nvarchar(256) = N'محصول'
	DECLARE @menuName nvarchar(256) = N'دسته بندی ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/eav/entityTypes'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';
	DECLARE @permissionSymbolDelete nvarchar(512) = @groupName + '.delete';
	DECLARE @permissionSymbolUploadImage nvarchar(512) = @groupName + '.uploadImage';


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
	SELECT 'UPLOADIMAGE_' + @entityName, @permissionSymbolUploadImage, @groupId, GETDATE(), GETDATE()

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
	SELECT 'CORE-Permissions-Data-v16', GETDATE(), GETDATE()
END

GO

-- eav/admin/entitymodel
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v17' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'EntityModels'
	DECLARE @groupName nvarchar(256) = N'eav.admin.entitymodel'
	

	
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	

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
	
	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp




	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v17', GETDATE(), GETDATE()
END

GO

-- eav/admin/attributeTypes
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v18' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AttributeTypes'
	DECLARE @groupName nvarchar(256) = N'eav.admin.attributetypes'
	

	
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
	SELECT 'CORE-Permissions-Data-v18', GETDATE(), GETDATE()
END

GO

-- eav/admin/attribute
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v19' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Attributes'
	DECLARE @groupName nvarchar(256) = N'eav.admin.attribute'
	

	
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

	
	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v19', GETDATE(), GETDATE()
END

GO


-- eav/admin/attributevalue
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v20' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AttributeValues'
	DECLARE @groupName nvarchar(256) = N'eav.admin.attributevalue'
	

	
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

	
	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v20', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/brands
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v21' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Brands'
	DECLARE @groupName nvarchar(256) = N'ecommerce.brands'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'محصول'
	DECLARE @menuName nvarchar(256) = N'برند ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/brands'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';
	DECLARE @permissionSymbolDelete nvarchar(512) = @groupName + '.delete';
	DECLARE @permissionSymbolUploadImage nvarchar(512) = @groupName + '.uploadImage';


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
	SELECT 'UPLOADIMAGE_' + @entityName, @permissionSymbolUploadImage, @groupId, GETDATE(), GETDATE()

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
	SELECT 'CORE-Permissions-Data-v21', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/colors
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v22' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Colors'
	DECLARE @groupName nvarchar(256) = N'ecommerce.colors'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'محصول'
	DECLARE @menuName nvarchar(256) = N'رنگ ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/colors'

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
	SELECT 'CORE-Permissions-Data-v22', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/guarantees
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v23' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Guarantees'
	DECLARE @groupName nvarchar(256) = N'ecommerce.guarantees'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'محصول'
	DECLARE @menuName nvarchar(256) = N'گارانتی ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/guarantees'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';
	DECLARE @permissionSymbolDelete nvarchar(512) = @groupName + '.delete';
	DECLARE @permissionSymbolUploadImage nvarchar(512) = @groupName + '.uploadImage';



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
	SELECT 'UPLOADIMAGE_' + @entityName, @permissionSymbolUploadImage, @groupId, GETDATE(), GETDATE()

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
	SELECT 'CORE-Permissions-Data-v23', GETDATE(), GETDATE()
END

GO

-- ecommerce/productphotos
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v24' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'ProductPhotos'
	DECLARE @groupName nvarchar(256) = N'ecommerce.productphotos'
	

	DECLARE @permissionSymbolUploadImage nvarchar(512) = @groupName + '.uploadImage';



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
	SELECT 'UPLOADIMAGE_' + @entityName, @permissionSymbolUploadImage, @groupId, GETDATE(), GETDATE()

	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v24', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/vendors
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v25' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Vendors'
	DECLARE @groupName nvarchar(256) = N'ecommerce.vendors'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'محصول'
	DECLARE @menuName nvarchar(256) = N'فروشندگان'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/vendors'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';
	DECLARE @permissionSymbolDelete nvarchar(512) = @groupName + '.delete';
	DECLARE @permissionSymbolUploadImage nvarchar(512) = @groupName + '.uploadImage';



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
	SELECT 'UPLOADIMAGE_' + @entityName, @permissionSymbolUploadImage, @groupId, GETDATE(), GETDATE()

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
	SELECT 'CORE-Permissions-Data-v25', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/vendoraddresses
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v26' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'VendorAddresses'
	DECLARE @groupName nvarchar(256) = N'ecommerce.vendoraddresses'
	DECLARE @findParentMenu bit = 0;
	DECLARE @parentMenuName nvarchar(256) = N'فروشنده'
	DECLARE @menuName nvarchar(256) = N'آدرس ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/vendoraddresses'

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
	SELECT 'CORE-Permissions-Data-v26', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/products
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v27' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Products'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.products'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'محصول'
	DECLARE @menuName nvarchar(256) = N'محصولات'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/products'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';
	DECLARE @permissionSymbolDelete nvarchar(512) = @groupName + '.delete';
	DECLARE @permissionSymbolSuperEdit nvarchar(512) = @groupName + '.superedit';


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
	SELECT 'SUPEREDIT_' + @entityName, @permissionSymbolSuperEdit, @groupId, GETDATE(), GETDATE()

	

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
	SELECT 'CORE-Permissions-Data-v27', GETDATE(), GETDATE()
END

GO


-- discount coffe
-- qrscan
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v28' 
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

	DECLARE @entityName nvarchar(256) = N'QrScan'
	DECLARE @groupName nvarchar(256) = N'discountcoffe.admin.qrscan'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'کافه و رستوران'
	DECLARE @menuName nvarchar(256) = N'اسکن بارکد'
	DECLARE @menuUrl nvarchar(512) = N'/discountcoffe/admin/qrscan'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';




	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);


															

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
	SELECT 'CORE-Permissions-Data-v28', GETDATE(), GETDATE()
END

GO


-- discount coffe
-- holidays
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v29' 
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

	DECLARE @entityName nvarchar(256) = N'Holidays'
	DECLARE @groupName nvarchar(256) = N'discountcoffe.admin.holidays'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'کافه و رستوران'
	DECLARE @menuName nvarchar(256) = N'اعلام روز های تعطیل'
	DECLARE @menuUrl nvarchar(512) = N'/discountcoffe/admin/holidays'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';




	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);


															

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
	SELECT 'CORE-Permissions-Data-v29', GETDATE(), GETDATE()
END

GO

-- discount coffe
-- reports
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v30' 
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

	DECLARE @entityName nvarchar(256) = N'FactorReport'
	DECLARE @groupName nvarchar(256) = N'discountcoffe.admin.factorreport'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'کافه و رستوران'
	DECLARE @menuName nvarchar(256) = N'صورت حساب'
	DECLARE @menuUrl nvarchar(512) = N'/discountcoffe/admin/factorReport'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';




	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);


															

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
	SELECT 'CORE-Permissions-Data-v30', GETDATE(), GETDATE()
END

GO


-- discount coffe
-- all reports
IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v31' 
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

	DECLARE @entityName nvarchar(256) = N'FactorReport'
	DECLARE @groupName nvarchar(256) = N'discountcoffe.admin.allfactorreport'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'کافه و رستوران'
	DECLARE @menuName nvarchar(256) = N'صورت حساب ها'
	DECLARE @menuUrl nvarchar(512) = N'/discountcoffe/admin/allFactorReport'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';




	-- permission groups
	INSERT INTO PermissionGroups(permissionGroupName, [visibility], createdAt, updatedAt)
	OUTPUT inserted.id INTO @GroupTemp(gorupId)
	SELECT @groupName, 1, GETDATE(), GETDATE();

	SELECT  @groupId = gorupId FROM @GroupTemp


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);


															

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
	SELECT 'CORE-Permissions-Data-v31', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/discounts
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v32' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Discounts'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.discounts'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'محصول'
	DECLARE @menuName nvarchar(256) = N'تخفیفات'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/discounts'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';
	DECLARE @permissionSymbolDelete nvarchar(512) = @groupName + '.delete';
	DECLARE @permissionSymbolSuperEdit nvarchar(512) = @groupName + '.superedit';


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
	SELECT 'SUPEREDIT_' + @entityName, @permissionSymbolSuperEdit, @groupId, GETDATE(), GETDATE()


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
	SELECT 'CORE-Permissions-Data-v32', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/discountconditions
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v33' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'DiscountConditions'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.discountconditions'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'محصول'
	DECLARE @menuName nvarchar(256) = N'شرط تخفیف'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/discounts'


	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
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
	SELECT 'DELETE_' + @entityName, @permissionSymbolDelete, @groupId, GETDATE(), GETDATE()


	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v33', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/transactions
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v34' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Transactions'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.tranactions'
	DECLARE @findParentMenu bit = 0;
	DECLARE @parentMenuName nvarchar(256) = N'پرداخت و حمل و نقل'
	DECLARE @menuName nvarchar(256) = N'تراکنش ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/transactions'

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
	SELECT 'CORE-Permissions-Data-v34', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/postagefees
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v35' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'PostageFees'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.postagefees'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'پرداخت و حمل و نقل'
	DECLARE @menuName nvarchar(256) = N'نرخ پستی'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/postageFees'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolPathAllProvincePrice nvarchar(512) = @groupName + '.updateAllProvincePrice';



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
	SELECT 'PATCH_AllProvincePrice_' + @entityName, @permissionSymbolPathAllProvincePrice, @groupId, GETDATE(), GETDATE()
	


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
	SELECT 'CORE-Permissions-Data-v35', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/pendingOrders
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v36' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'PendingOrders'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.pendingorders'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'فروشنده'
	DECLARE @menuName nvarchar(256) = N'سفارشات منتظر پردازش'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/pendingOrders'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolProcessDetail nvarchar(512) = @groupName + '.processdetail';



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
	SELECT 'ProcessDetail_' + @entityName, @permissionSymbolProcessDetail, @groupId, GETDATE(), GETDATE()
	


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
	SELECT 'CORE-Permissions-Data-v36', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/pendingOrders
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v36' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'PendingOrders'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.pendingorders'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'فروشنده'
	DECLARE @menuName nvarchar(256) = N'سفارشات منتظر پردازش'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/pendingOrders'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolProcessDetail nvarchar(512) = @groupName + '.processdetail';



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
	SELECT 'ProcessDetail_' + @entityName, @permissionSymbolProcessDetail, @groupId, GETDATE(), GETDATE()
	


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
	SELECT 'CORE-Permissions-Data-v36', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/postageOrders
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v37' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'PostageOrders'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.postageorders'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'فروشنده'
	DECLARE @menuName nvarchar(256) = N'سفارشات منتظر ارسال به پست'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/postageOrders'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolProcessPost nvarchar(512) = @groupName + '.processpost';



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
	SELECT 'ProcessPost_' + @entityName, @permissionSymbolProcessPost, @groupId, GETDATE(), GETDATE()
	


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
	SELECT 'CORE-Permissions-Data-v37', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/totalOrders
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v38' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'TotalOrders'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.totalorders'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'فروشنده'
	DECLARE @menuName nvarchar(256) = N'همه ی سفارشات'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/totalOrders'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolRemoveDetail nvarchar(512) = @groupName + '.removedetail';
	DECLARE @permissionSymbolDecreaseDetail nvarchar(512) = @groupName + '.decreasedetail';
	DECLARE @permissionSymbolChangeShipmentWay nvarchar(512) = @groupName + '.changeshipmentway';
	DECLARE @permissionSymbolChangeOrderStatus nvarchar(512) = @groupName + '.changeorderstatus';
	DECLARE @permissionSymbolEditReceiptPost nvarchar(512) = @groupName + '.editreceiptpost';

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
	SELECT 'RemoveDetail_' + @entityName, @permissionSymbolRemoveDetail, @groupId, GETDATE(), GETDATE()


	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'DecreaseDetail_' + @entityName, @permissionSymbolDecreaseDetail, @groupId, GETDATE(), GETDATE()


	

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'ChangeShipmentWay_' + @entityName, @permissionSymbolChangeShipmentWay, @groupId, GETDATE(), GETDATE()


	

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'ChangeOrderStatus_' + @entityName, @permissionSymbolChangeOrderStatus, @groupId, GETDATE(), GETDATE()

	
	
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'DELETE_' + @entityName, @permissionSymbolDelete, @groupId, GETDATE(), GETDATE()

	
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'EditReceiptPost_' + @entityName, @permissionSymbolEditReceiptPost, @groupId, GETDATE(), GETDATE()


	
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
	SELECT 'CORE-Permissions-Data-v38', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/couriers
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v39' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Courier'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.couriers'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'پرداخت و حمل و نقل'
	DECLARE @menuName nvarchar(256) = N'پیک ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/couriers'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
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
	SELECT 'CORE-Permissions-Data-v39', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/courierPrices
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v40' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'CourierPrice'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.courierprices'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'پرداخت و حمل و نقل'
	DECLARE @menuName nvarchar(256) = N'نرخ پیک'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/courierPrices'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
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
	SELECT 'CORE-Permissions-Data-v40', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/courierOrders
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v41' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'CourierOrders'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.courierorders'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'فروشنده'
	DECLARE @menuName nvarchar(256) = N'سفارشات منتظر ارسال به پیک'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/courierOrders'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolProcessPost nvarchar(512) = @groupName + '.processcourier';



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
	SELECT 'ProcessCourier_' + @entityName, @permissionSymbolProcessPost, @groupId, GETDATE(), GETDATE()
	


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
	SELECT 'CORE-Permissions-Data-v41', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/deliveryOrders
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v42' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'DeliveryOrders'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.deliveryorders'
	DECLARE @findParentMenu bit = 0;
	DECLARE @parentMenuName nvarchar(256) = N'پیک'
	DECLARE @menuName nvarchar(256) = N'سفارشات منتظر ارسال به مشتری'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/deliveryOrders'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolProcessDeliver nvarchar(512) = @groupName + '.processdeliver';



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
	SELECT 'ProcessCourier_' + @entityName, @permissionSymbolProcessDeliver, @groupId, GETDATE(), GETDATE()
	


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
	SELECT 'CORE-Permissions-Data-v42', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/variationprices
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v43' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'VariationPrices'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.variationprices'


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
	SELECT 'CORE-Permissions-Data-v43', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/repoort/adminsales
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v44' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'ReportAdminSales'
	DECLARE @groupName nvarchar(256) = N'ecommerce.report.adminsales'
	DECLARE @findParentMenu bit = 0;
	DECLARE @parentMenuName nvarchar(256) = N'گزارشات'
	DECLARE @menuName nvarchar(256) = N'میزان فروش و درآمد (ادمین)'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/report/adminSales'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';




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
	SELECT 'CORE-Permissions-Data-v44', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/repoort/vendorsales
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v45' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'ReportVendorSales'
	DECLARE @groupName nvarchar(256) = N'ecommerce.report.vendorsales'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'گزارشات'
	DECLARE @menuName nvarchar(256) = N'میزان فروش و درآمد (فروشنده)'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/report/vendorSales'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';




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
	SELECT 'CORE-Permissions-Data-v45', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/repoort/adminCouriers
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v46' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'ReportAdminCouriers'
	DECLARE @groupName nvarchar(256) = N'ecommerce.report.admincouriers'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'گزارشات'
	DECLARE @menuName nvarchar(256) = N'سفارشات پیکی(ادمین)'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/report/adminCouriers'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';




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
	SELECT 'CORE-Permissions-Data-v46', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/repoort/adminPosts
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v47' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'ReportAdminPosts'
	DECLARE @groupName nvarchar(256) = N'ecommerce.report.adminposts'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'گزارشات'
	DECLARE @menuName nvarchar(256) = N'سفارشات پستی(ادمین)'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/report/adminPosts'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';




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
	SELECT 'CORE-Permissions-Data-v47', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/repoort/couriers
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v48' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'ReportCouriers'
	DECLARE @groupName nvarchar(256) = N'ecommerce.report.couriers'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'گزارشات'
	DECLARE @menuName nvarchar(256) = N'سفارشات پیکی'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/report/couriers'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';




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
	SELECT 'CORE-Permissions-Data-v48', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/paymentgateways
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v49' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'PaymentGateways'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.paymentgateways'


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
	SELECT 'CORE-Permissions-Data-v49', GETDATE(), GETDATE()
END

GO



-- ecommerce/admin/repoort/paymenttransactions
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v50' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'PaymentTransactions'
	DECLARE @groupName nvarchar(256) = N'ecommerce.report.paymenttransactions'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'گزارشات'
	DECLARE @menuName nvarchar(256) = N'کمیسیون درگاه'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/report/paymentTransactions'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';




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
	SELECT 'CORE-Permissions-Data-v50', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/report/inventories
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v51' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'InventoriesReport'
	DECLARE @groupName nvarchar(256) = N'ecommerce.report.inventories'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'گزارشات'
	DECLARE @menuName nvarchar(256) = N'آمار موجودی ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/report/inventories'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';




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
	SELECT 'CORE-Permissions-Data-v51', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/inventorystatuses
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v52' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'InventoryStatus'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.inventorystatuses'


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
	SELECT 'CORE-Permissions-Data-v52', GETDATE(), GETDATE()
END

GO



-- ecommerce/admin/entityTypeFactors
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v53' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'EntityTypeFactors'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.entitytypefactors'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/entityTypeFactors'


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

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v53', GETDATE(), GETDATE()
END

GO



-- ecommerce/admin/productcomments
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v54' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'ProductComments'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.productcomments'
	DECLARE @findParentMenu bit = 0;
	DECLARE @parentMenuName nvarchar(256) = N'کامنت و بازخورد'
	DECLARE @menuName nvarchar(256) = N'کامنت ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/productComments'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolConfirmComment nvarchar(512) = @groupName + '.confirmcomment';
	DECLARE @permissionSymbolRejectComment nvarchar(512) = @groupName + '.rejectcomment';
	



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
	SELECT 'ConfrimComment_' + @entityName, @permissionSymbolConfirmComment, @groupId, GETDATE(), GETDATE()
	

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'RejectComment_' + @entityName, @permissionSymbolRejectComment, @groupId, GETDATE(), GETDATE()

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
	SELECT 'CORE-Permissions-Data-v54', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/productcommentstatuses
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v55' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'ProductCommentStatus'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.productcommentstatuses'


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
	SELECT 'CORE-Permissions-Data-v55', GETDATE(), GETDATE()
END

GO



-- ecommerce/admin/orderstatuses
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v56' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'OrderStatus'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.orderstatuses'


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
	SELECT 'CORE-Permissions-Data-v56', GETDATE(), GETDATE()
END

GO



-- ecommerce/admin/ordershipmentways
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v57' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'OrderShipmentWays'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.ordershipmentways'


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
	SELECT 'CORE-Permissions-Data-v57', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/addresses
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v58' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AdminAddress'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.addresses'
	

	
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

	
	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v58', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/repoort/productSales
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v59' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'ReportProductSales'
	DECLARE @groupName nvarchar(256) = N'ecommerce.report.productsales'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'گزارشات'
	DECLARE @menuName nvarchar(256) = N'گزارش تعداد فروش کالا'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/report/productSales'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';




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
	SELECT 'CORE-Permissions-Data-v59', GETDATE(), GETDATE()
END

GO




-- ecommerce/admin/inventoryhistories
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v60' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'InventoryHistories'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.inventoryhistories'


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
	SELECT 'CORE-Permissions-Data-v60', GETDATE(), GETDATE()
END

GO



-- ecommerce/admin/pages
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v61' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Pages'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.pages'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'مدیریت'
	DECLARE @menuName nvarchar(256) = N'صفحات'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/pages'

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
	SELECT 'CORE-Permissions-Data-v61', GETDATE(), GETDATE()
END

GO


-- ecommerce/admin/cancellorders
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v62' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'CancellOrders'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.cancellorders'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'فروشنده'
	DECLARE @menuName nvarchar(256) = N'سفارشات کنسل شده'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/cancellOrders'

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
	SELECT 'CORE-Permissions-Data-v62', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/homePages
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v63' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'HomePages'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.homepages'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'مدیریت'
	DECLARE @menuName nvarchar(256) = N'تنظیمات صفحه اصلی'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/homePages'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	



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
	SELECT 'CREATE_' + @entityName, @permissionSymbolCreate, @groupId, GETDATE(), GETDATE()
	


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
	SELECT 'CORE-Permissions-Data-v63', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/homepagephotos
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v64' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'HomePagePhotoss'
	DECLARE @groupName nvarchar(256) = N'ecommerce.homepagephotos'
	
	DECLARE @permissionSymbolUploadImage nvarchar(512) = @groupName + '.uploadImage';
	DECLARE @permissionSymbolShowImage nvarchar(512) = @groupName + '.showImage';
	



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
	SELECT 'UPLOADIMAGE_' + @entityName, @permissionSymbolUploadImage, @groupId, GETDATE(), GETDATE()
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'SHOWIMAGE_' + @entityName, @permissionSymbolShowImage, @groupId, GETDATE(), GETDATE()
	


	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v64', GETDATE(), GETDATE()
END

GO


-- ecommerce/productvideos
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v65' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'ProductVideos'
	DECLARE @groupName nvarchar(256) = N'ecommerce.productvideos'
	

	DECLARE @permissionSymbolUploadImage nvarchar(512) = @groupName + '.uploadVideo';



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
	SELECT 'UPLOADVIDEO_' + @entityName, @permissionSymbolUploadImage, @groupId, GETDATE(), GETDATE()

	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v65', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/notifications
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v66' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Notification'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.notifications'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'مدیریت'
	DECLARE @menuName nvarchar(256) = N'اطلاع رسانی'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/notifications'

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
	SELECT 'CORE-Permissions-Data-v66', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/headerNotifications
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v67' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'HeaderNotification'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.headernotifications'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'مدیریت'
	DECLARE @menuName nvarchar(256) = N'اطلاع رسانی بالای سایت'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/headerNotifications'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
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
	SELECT 'CORE-Permissions-Data-v67', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/goldCurrentPrices
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v68' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GoldCurrentPrices'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.currentprices'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'مدیریت'
	DECLARE @menuName nvarchar(256) = N'تنظیمات قیمت لحظه ای'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/goldCurrentPrices'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
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
	SELECT 'CORE-Permissions-Data-v68', GETDATE(), GETDATE()
END

GO



-- ecommerce/admin/priceformulas
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v69' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'PriceFormulas'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.priceformulas'


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
	SELECT 'CORE-Permissions-Data-v69', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/factordiscounts
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v70' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'FactorDiscounts'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.factordiscounts'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'محصول'
	DECLARE @menuName nvarchar(256) = N'تخفیف ارسال رایگان'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/factorDiscounts'

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
	SELECT 'CORE-Permissions-Data-v70', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/selectedProducts
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v71' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'SelectedProducts'
	DECLARE @groupName nvarchar(256) = N'ecommerce.selectedproducts'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'محصول'
	DECLARE @menuName nvarchar(256) = N'دستچین کالا ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/selectedProducts'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.update';
	DECLARE @permissionSymbolDelete nvarchar(512) = @groupName + '.delete';
	DECLARE @permissionSymbolUploadImage nvarchar(512) = @groupName + '.uploadImage';


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
	SELECT 'UPLOADIMAGE_' + @entityName, @permissionSymbolUploadImage, @groupId, GETDATE(), GETDATE()

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
	SELECT 'CORE-Permissions-Data-v71', GETDATE(), GETDATE()
END

GO

-- ecommerce/admin/selectedProductItems
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v72' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'SelectedProductItems'
	DECLARE @groupName nvarchar(256) = N'ecommerce.selectedproductsitems'
	
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
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
	SELECT 'CREATE_' + @entityName, @permissionSymbolCreate, @groupId, GETDATE(), GETDATE()
		
															
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'DELETE_' + @entityName, @permissionSymbolDelete, @groupId, GETDATE(), GETDATE()


	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v72', GETDATE(), GETDATE()
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

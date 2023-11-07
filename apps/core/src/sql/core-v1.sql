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

IF OBJECT_ID('Migrations', 'U') IS  NULL 
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
		WHERE title like N'%'+ @parentMenuName +'%'
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
	DECLARE @findParentMenu bit = 0;
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
		WHERE title like N'%'+ @parentMenuName +'%'
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
	DECLARE @findParentMenu bit = 0;
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
		WHERE title like N'%'+ @parentMenuName +'%'
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
	DECLARE @findParentMenu bit = 0;
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
		WHERE title like N'%'+ @parentMenuName +'%'
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
	DECLARE @findParentMenu bit = 0;
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
		WHERE title like N'%'+ @parentMenuName +'%'
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

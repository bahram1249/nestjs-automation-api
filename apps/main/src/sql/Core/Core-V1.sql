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

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-UserTypes-v1' 
					
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN

	CREATE TABLE UserTypes
	(
		id							int									PRIMARY KEY,
		title						nvarchar(256)						NOT NULL,
		[createdAt]					datetimeoffset						NOT NULL,
		[updatedAt]					datetimeoffset						NOT NULL
	)

	INSERT INTO UserTypes(id, title, createdAt, updatedAt)
	VALUES (1, N'حقیقی', getdate(), getdate())
		,(2, N'حقوقی', getdate(), getdate())


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-UserTypes-v1', GETDATE(), GETDATE()
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


IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Users-v3'

			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN

	ALTER TABLE Users
		ADD nationalCode					nvarchar(25)						 NULL;



	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Users-v3', GETDATE(), GETDATE()
END

GO



IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Users-v4'

			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		OR ([key] = 'SITE_NAME' AND [value] IN ('SITE_NAME'))
	)
BEGIN

	ALTER TABLE Users
		ADD userTypeId	int NULL default 1
			CONSTRAINT FK_Users_UserTypeId  FOREIGN KEY REFERENCES UserTypes(id);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Users-v4', GETDATE(), GETDATE()
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





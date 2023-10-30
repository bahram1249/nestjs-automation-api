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
		id						bigint								PRIMARY KEY,
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
		[visiblity]				bit									NULL,
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
	INSERT INTO PermissionGroups(permissionGroupName, [visiblity], createdAt, updatedAt)
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
	INSERT INTO PermissionGroups(permissionGroupName, [visiblity], createdAt, updatedAt)
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
	INSERT INTO PermissionGroups(permissionGroupName, [visiblity], createdAt, updatedAt)
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
	INSERT INTO PermissionGroups(permissionGroupName, [visiblity], createdAt, updatedAt)
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



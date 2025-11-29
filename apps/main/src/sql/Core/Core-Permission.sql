


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
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.transactions'
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

-- ecommerce/admin/totalOrders--showcustomerinfo
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v38.1' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'TotalOrders'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.totalorders'


	DECLARE @permissionSymbolShowCustomerInfo nvarchar(512) = @groupName + '.showcustomerinfo';
	
	SELECT  @groupId = id FROM PermissionGroups WHERE permissionGroupName = @groupName


	-- permissions

	
	DECLARE @PermissionTemp TABLE (
		permissionId int
	);

	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'SHOWCUSTOMERINFO_' + @entityName, @permissionSymbolShowCustomerInfo, @groupId, GETDATE(), GETDATE()
															

	
	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v38.1', GETDATE(), GETDATE()
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


-- eav/admin/blogpublishes
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v73' 
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

	DECLARE @entityName nvarchar(256) = N'BlogPublishes'
	DECLARE @groupName nvarchar(256) = N'eav.admin.blogpublishes'


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
	SELECT 'CORE-Permissions-Data-v73', GETDATE(), GETDATE()
END

GO


-- eav/admin/blogEntityTypes
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v74' 
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

	DECLARE @entityName nvarchar(256) = N'BlogEntityTypes'
	DECLARE @groupName nvarchar(256) = N'eav.admin.entitytype'
	DECLARE @findParentMenu bit = 0;
	DECLARE @parentMenuName nvarchar(256) = N'وبلاگ'
	DECLARE @menuName nvarchar(256) = N'دسته بندی ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/eav/blogEntityTypes'

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
	SELECT 'CORE-Permissions-Data-v74', GETDATE(), GETDATE()
END

GO


-- eav/admin/posts
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v75' 
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

	DECLARE @entityName nvarchar(256) = N'Posts'
	DECLARE @groupName nvarchar(256) = N'eav.admin.posts'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'وبلاگ'
	DECLARE @menuName nvarchar(256) = N'مطالب'
	DECLARE @menuUrl nvarchar(512) = N'/admin/eav/posts'

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
	SELECT 'CORE-Permissions-Data-v75', GETDATE(), GETDATE()
END

GO

-- gs/admin/brands
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v76' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Brands'
	DECLARE @groupName nvarchar(256) = N'gs.admin.brands'
	DECLARE @findParentMenu bit = 0;
	DECLARE @parentMenuName nvarchar(256) = N'اطلاعات پایه گارانتی'
	DECLARE @menuName nvarchar(256) = N'برند ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/brands'

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
	SELECT 'CORE-Permissions-Data-v76', GETDATE(), GETDATE()
END

GO

-- gs/admin/producttypes
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v77' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'ProductTypes'
	DECLARE @groupName nvarchar(256) = N'gs.admin.producttypes'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'اطلاعات پایه گارانتی'
	DECLARE @menuName nvarchar(256) = N'انواع محصول'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/productTypes'

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
	SELECT 'CORE-Permissions-Data-v77', GETDATE(), GETDATE()
END

GO

-- gs/admin/normalGuarantee
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v78' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'NormalGuarantee'
	DECLARE @groupName nvarchar(256) = N'gs.admin.noramlguarantees'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'اطلاعات پایه گارانتی'
	DECLARE @menuName nvarchar(256) = N'کارت گارانتی های عادی'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/normalGuarantee'

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
	SELECT 'CORE-Permissions-Data-v78', GETDATE(), GETDATE()
END

GO


-- gs/admin/variants
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v79'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Varaint'
	DECLARE @groupName nvarchar(256) = N'gs.admin.variants'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'اطلاعات پایه گارانتی'
	DECLARE @menuName nvarchar(256) = N'مدل دستگاه ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/variants'

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
	SELECT 'CORE-Permissions-Data-v79', GETDATE(), GETDATE()
END

GO

-- gs/admin/guaranteeOrganization
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v80'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeOrganizations'
	DECLARE @groupName nvarchar(256) = N'gs.admin.guaranteeorganizations'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'اطلاعات پایه گارانتی'
	DECLARE @menuName nvarchar(256) = N'نمایندگان'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/guaranteeOrganizations'

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
	SELECT 'CORE-Permissions-Data-v80', GETDATE(), GETDATE()
END

GO

-- gs/admin/guaranteeOrganizationContracts
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v81'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeOrganizationContracts'
	DECLARE @groupName nvarchar(256) = N'gs.admin.guaranteeorganizationcontracts'
	

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
	SELECT 'CORE-Permissions-Data-v81', GETDATE(), GETDATE()
END

GO

-- gs/admin/additionalpackages
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v82'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeAdditionalPackages'
	DECLARE @groupName nvarchar(256) = N'gs.admin.additionalpackages'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'اطلاعات پایه گارانتی'
	DECLARE @menuName nvarchar(256) = N'شرایط مازاد گارانتی'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/additionalPackages'

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
	SELECT 'CORE-Permissions-Data-v82', GETDATE(), GETDATE()
END

GO



-- gs/admin/cartables
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v83'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeCartables'
	DECLARE @groupName nvarchar(256) = N'gs.admin.cartables'
	DECLARE @findParentMenu bit = 0;
	DECLARE @parentMenuName nvarchar(256) = N'عملیات'
	DECLARE @menuName nvarchar(256) = N'کارتابل'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/cartables'

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
	SELECT 'CORE-Permissions-Data-v83', GETDATE(), GETDATE()
END

GO

-- gs/admin/solutions
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v84'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeSolutions'
	DECLARE @groupName nvarchar(256) = N'gs.admin.solutions'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'اطلاعات پایه گارانتی'
	DECLARE @menuName nvarchar(256) = N'خدمات'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/solutions'

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
	SELECT 'CORE-Permissions-Data-v84', GETDATE(), GETDATE()
END

GO

-- gs/admin/technicalPersons
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v85'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeTechnicalPersons'
	DECLARE @groupName nvarchar(256) = N'gs.admin.technicalpersons'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'عملیات'
	DECLARE @menuName nvarchar(256) = N'تکنسین ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/technicalPersons'

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
	SELECT 'CORE-Permissions-Data-v85', GETDATE(), GETDATE()
END

GO

-- gs/admin/vipbundletypes
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v86'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeVipBundleType'
	DECLARE @groupName nvarchar(256) = N'gs.admin.vipbundletypes'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'اطلاعات پایه گارانتی'
	DECLARE @menuName nvarchar(256) = N'انواع کارت های گارانتی'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/vipBundleTypes'

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
	SELECT 'CORE-Permissions-Data-v86', GETDATE(), GETDATE()
END

GO

-- gs/admin/factors
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v87'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Factors'
	DECLARE @groupName nvarchar(256) = N'gs.admin.factors'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'عملیات'
	DECLARE @menuName nvarchar(256) = N'فاکتور ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/factors'

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
	SELECT 'CORE-Permissions-Data-v87', GETDATE(), GETDATE()
END

GO


-- gs/admin/vipgenerators
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v88'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeVipGenerators'
	DECLARE @groupName nvarchar(256) = N'gs.admin.vipgenerators'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'اطلاعات پایه گارانتی'
	DECLARE @menuName nvarchar(256) = N'صددور کارت گارانتی وی آی پی'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/vipGenerators'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
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
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()

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
	SELECT 'CORE-Permissions-Data-v88', GETDATE(), GETDATE()
END

GO

-- gs/admin/trackingRequests
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v89'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeTrackingRequests'
	DECLARE @groupName nvarchar(256) = N'gs.admin.trackingrequests'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'عملیات'
	DECLARE @menuName nvarchar(256) = N'پیگیری درخواست'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/trackingRequests'

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
	SELECT 'CORE-Permissions-Data-v89', GETDATE(), GETDATE()
END

GO


-- gs/admin/supervisorusers
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v90'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeSuperVisors'
	DECLARE @groupName nvarchar(256) = N'gs.admin.supervisorusers'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'عملیات'
	DECLARE @menuName nvarchar(256) = N'ناظر ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/superVisorUsers'

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
	SELECT 'CORE-Permissions-Data-v90', GETDATE(), GETDATE()
END

GO


-- gs/admin/surveys
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v91'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeResponse'
	DECLARE @groupName nvarchar(256) = N'gs.admin.response'
	DECLARE @findParentMenu bit = 0;
	DECLARE @parentMenuName nvarchar(256) = N'گزارشات'
	DECLARE @menuName nvarchar(256) = N'نظر سنجی ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/surveys'

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
	SELECT 'CORE-Permissions-Data-v91', GETDATE(), GETDATE()
END

GO

-- gs/admin/supplierpersons
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v92'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeSupplierPersons'
	DECLARE @groupName nvarchar(256) = N'gs.admin.supplierpersons'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'عملیات'
	DECLARE @menuName nvarchar(256) = N'تامین کنندگان'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/supplierPersons'

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
	SELECT 'CORE-Permissions-Data-v92', GETDATE(), GETDATE()
END

GO

-- eav/admin/linkedEntityTypeBrands
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v93' 
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

	DECLARE @entityName nvarchar(256) = N'LinkedEntityTypeBrand'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.linkedentitytypebrands'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'محصول'
	DECLARE @menuName nvarchar(256) = N'صفحه ساز دسته بندی و برندها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/linkedEntityTypeBrands'

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
	SELECT 'CORE-Permissions-Data-v93', GETDATE(), GETDATE()
END

GO

-- gs/admin/preregistrationorganization
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v94'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteePreRegistrationOrganizations'
	DECLARE @groupName nvarchar(256) = N'gs.admin.preregistrationorganizations'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'عملیات'
	DECLARE @menuName nvarchar(256) = N'لیست ثبت نام نمایندگان'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/preRegistrationOrganizations'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
	DECLARE @permissionSymbolUpdate nvarchar(512) = @groupName + '.confirm';
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
	SELECT 'CONFIRM_' + @entityName, @permissionSymbolUpdate, @groupId, GETDATE(), GETDATE()

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
	SELECT 'CORE-Permissions-Data-v94', GETDATE(), GETDATE()
END

GO


-- gs/report/incomeReports
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v95'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeIncomeReports'
	DECLARE @groupName nvarchar(256) = N'gs.report.incomereports'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'گزارشات'
	DECLARE @menuName nvarchar(256) = N'گزارش درآمدی'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/incomeReports'

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
	SELECT 'CORE-Permissions-Data-v95', GETDATE(), GETDATE()
END

GO


-- ecommerce/publicphotos
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v96' 
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

	DECLARE @entityName nvarchar(256) = N'PublicPhotos'
	DECLARE @groupName nvarchar(256) = N'ecommerce.publicphotos'
	

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
	SELECT 'CORE-Permissions-Data-v96', GETDATE(), GETDATE()
END

GO

-- gs/admin/subscriptions
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v97'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeSubscriptions'
	DECLARE @groupName nvarchar(256) = N'gs.admin.subscriptions'
	DECLARE @findParentMenu bit = 0;
	DECLARE @parentMenuName nvarchar(256) = N'باشگاه مشتریان'
	DECLARE @menuName nvarchar(256) = N'لیست ثبت نام'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/subscriptions'

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
	SELECT 'CORE-Permissions-Data-v97', GETDATE(), GETDATE()
END

GO

-- gs/admin/faqs
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v98' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Faqs'
	DECLARE @groupName nvarchar(256) = N'gs.admin.faqs'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'مدیریت'
	DECLARE @menuName nvarchar(256) = N'سوالات متداول'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/faqs'

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
	SELECT 'CORE-Permissions-Data-v98', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v99' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
	AND NOT EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('pegahgallery', 'goldongallery'))
		)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'Logistic'
	DECLARE @groupName nvarchar(256) = N'ecommerce.logistics'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'پرداخت و حمل و نقل'
	DECLARE @menuName nvarchar(256) = N'لاجستیک'
	DECLARE @menuUrl nvarchar(512) = N'/admin/ecommerce/logistics'

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
	SELECT 'CORE-Permissions-Data-v99', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v100' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
	AND NOT EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('pegahgallery', 'goldongallery'))
		)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'LogisticUser'
	DECLARE @groupName nvarchar(256) = N'ecommerce.logisticusers'
	
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
	SELECT 'CORE-Permissions-Data-v100', GETDATE(), GETDATE()
END

GO



IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v101' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
	AND NOT EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('pegahgallery', 'goldongallery'))
		)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'LogisticShipment'
	DECLARE @groupName nvarchar(256) = N'ecommerce.logisticshipmentways'
	
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


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v101', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v102' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
	AND NOT EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('pegahgallery', 'goldongallery'))
		)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AdminLogisticSendingPeriod'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.logisticsendingperiods'
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
	SELECT 'CORE-Permissions-Data-v102', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v103' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
	)
	AND NOT EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('pegahgallery', 'goldongallery'))
		)
BEGIN
	
	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'AdminLogisticWeeklyPeriods'
	DECLARE @groupName nvarchar(256) = N'ecommerce.admin.logisticweeklyperiods'
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolGetOne nvarchar(512) = @groupName + '.getone';
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
	SELECT 'GETONE_' + @entityName, @permissionSymbolGetOne, @groupId, GETDATE(), GETDATE()
															 
	INSERT INTO Permissions(permissionName ,permissionSymbol,permissionGroupId,  createdAt, updatedAt)
	OUTPUT inserted.id INTO @PermissionTemp(permissionId)
	SELECT 'CREATE_' + @entityName, @permissionSymbolCreate, @groupId, GETDATE(), GETDATE()
															 

	-- CRUD THIS Enity FOR super-admin
	INSERT INTO RolePermissions(roleId, permissionId, createdAt, updatedAt)
	SELECT @roleId, permissionId, GETDATE(), GETDATE()
	FROM @PermissionTemp

	DELETE FROM @PermissionTemp

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Permissions-Data-v103', GETDATE(), GETDATE()
END

GO


-- gs/admin/irangs-import-data
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v104'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'IrangsImportData'
	DECLARE @groupName nvarchar(256) = N'guarantee.admin.irangs-import-data'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'اطلاعات پایه گارانتی'
	DECLARE @menuName nvarchar(256) = N'ورود اطلاعات ایران جی اس'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/irangs-import-data'

	DECLARE @permissionSymbolShowMenu nvarchar(512) = @groupName + '.showmenu';
	DECLARE @permissionSymbolGetAll nvarchar(512) = @groupName + '.getall';
	DECLARE @permissionSymbolCreate nvarchar(512) = @groupName + '.create';
	DECLARE @permissionSymbolDownload nvarchar(512) = @groupName + '.download';


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
	SELECT 'DOWNLOAD_' + @entityName, @permissionSymbolDownload, @groupId, GETDATE(), GETDATE()


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
	SELECT 'CORE-Permissions-Data-v104', GETDATE(), GETDATE()
END

GO

-- gs/report/useractionreports
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v105'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeUserActionReports'
	DECLARE @groupName nvarchar(256) = N'gs.report.useractionreports'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'گزارشات'
	DECLARE @menuName nvarchar(256) = N'گزارش عملکرد کاربران'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/userActionReports'

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
	SELECT 'CORE-Permissions-Data-v105', GETDATE(), GETDATE()
END

GO


-- gs/report/activityreports
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v106'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeActivityReports'
	DECLARE @groupName nvarchar(256) = N'gs.report.activityreports'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'گزارشات'
	DECLARE @menuName nvarchar(256) = N'گزارش فعالیت ها'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/activityReports'

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
	SELECT 'CORE-Permissions-Data-v106', GETDATE(), GETDATE()
END

GO


-- gs/report/supplierreports
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v107'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeSupplierReports'
	DECLARE @groupName nvarchar(256) = N'gs.report.supplierreports'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'گزارشات'
	DECLARE @menuName nvarchar(256) = N'گزارش تامین کنندگان'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/supplierReports'

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
	SELECT 'CORE-Permissions-Data-v107', GETDATE(), GETDATE()
END

GO

-- gs/report/technicalpersonreports
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Permissions-Data-v108'
			))
	AND EXISTS (
		SELECT 1 FROM Settings WHERE 1=1
		AND ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
	)
BEGIN

	DECLARE @roleId int = (SELECT TOP 1 id FROM Roles WHERE static_id = 1)
	DECLARE @userId bigint = (SELECT TOP 1 id FROM Users WHERE static_id = 1)

	DECLARE @GroupTemp TABLE (
		gorupId int
	);

	DECLARE @groupId int = null;

	DECLARE @entityName nvarchar(256) = N'GuaranteeTechnicalPersonReports'
	DECLARE @groupName nvarchar(256) = N'gs.report.technicalpersonreports'
	DECLARE @findParentMenu bit = 1;
	DECLARE @parentMenuName nvarchar(256) = N'گزارشات'
	DECLARE @menuName nvarchar(256) = N'گزارش افراد فنی'
	DECLARE @menuUrl nvarchar(512) = N'/admin/gs/technicalPersonReports'

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
	SELECT 'CORE-Permissions-Data-v108', GETDATE(), GETDATE()
END

GO


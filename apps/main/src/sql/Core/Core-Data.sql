
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

-- organization
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Roles-Data-v4' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	
	INSERT INTO Roles
	(
		roleName
		,static_id
		,createdAt
		,updatedAt
	) 
	SELECT N'نماینده', 4, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Roles-Data-v4', GETDATE(), GETDATE()
END

GO

-- supervisor
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Roles-Data-v5' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	
	INSERT INTO Roles
	(
		roleName
		,static_id
		,createdAt
		,updatedAt
	) 
	SELECT N'ناظر', 5, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Roles-Data-v5', GETDATE(), GETDATE()
END

GO


-- technical person
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Roles-Data-v6' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	
	INSERT INTO Roles
	(
		roleName
		,static_id
		,createdAt
		,updatedAt
	) 
	SELECT N'تکنسین', 6, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Roles-Data-v6', GETDATE(), GETDATE()
END

GO


-- suppliers
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Roles-Data-v7' 
			))
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
BEGIN
	
	INSERT INTO Roles
	(
		roleName
		,static_id
		,createdAt
		,updatedAt
	) 
	SELECT N'تامین کنندگان قطعه', 7, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Roles-Data-v7', GETDATE(), GETDATE()
END

GO

-- logistics
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-Roles-Data-v8' 
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
	SELECT N'لاجستیک', 8, getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-Roles-Data-v8', GETDATE(), GETDATE()
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


-- eav temp blog photos
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v15' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 17, N'tempblogphoto', getdate(), getdate()


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v15', GETDATE(), GETDATE()
END

GO


-- eav blog photos
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v16' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 18, N'blogphoto', getdate(), getdate()


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v16', GETDATE(), GETDATE()
END

GO


-- temp requests
IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v17' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 19, N'tempguaranteerequests', getdate(), getdate()

	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 20, N'guaranteerequests', getdate(), getdate()

	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 21, N'organizationbussinesslicense', getdate(), getdate()


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v17', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v18' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 22, N'temporganization', getdate(), getdate()

	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 23, N'national', getdate(), getdate()

	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 24, N'estate', getdate(), getdate()

	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 25, N'postal', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v18', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS ((SELECT 1 FROM Migrations WHERE version = 'CORE-AttachmentTypes-Data-v19' 
			))
BEGIN
	
	INSERT INTO AttachmentTypes(id, typeName, createdAt, updatedAt)
	SELECT 26, N'ecommercepublicphoto', getdate(), getdate()

	

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'CORE-AttachmentTypes-Data-v19', GETDATE(), GETDATE()
END

GO


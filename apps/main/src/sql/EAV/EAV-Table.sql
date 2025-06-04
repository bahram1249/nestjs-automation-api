

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


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-entitytype-v6' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE EAVEntityTypes 
		ADD showLanding	bit NULL 

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-entitytype-v6', GETDATE(), GETDATE()
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
		CONSTRAINT PK_EAVEntityPhotos PRIMARY KEY CLUSTERED(entityId, attachmentId),
	);



	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-product-photos-v1', GETDATE(), GETDATE()
END

GO



-- eav product photos
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-product-photos-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE EAVEntityPhotos ADD [priority] int not null DEFAULT 0



	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-product-photos-v2', GETDATE(), GETDATE()
END

GO


-- eav product photos
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-product-photos-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN


	ALTER TABLE EAVEntityPhotos
		DROP CONSTRAINT PK_EAVEntityPhotos

	ALTER TABLE EAVEntityPhotos 
		ADD CONSTRAINT PK_EAVEntityPhotos 
			PRIMARY KEY CLUSTERED (entityId, [priority], attachmentId)



	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-product-photos-v3', GETDATE(), GETDATE()
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



-- eav blog publishes
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-blog-publishes-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE EAVBlogPublishes (
		id							int							PRIMARY KEY,
		[name]						nvarchar(256)				NOT NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-blog-publishes-v1', GETDATE(), GETDATE()
END

GO

-- eav blog
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-posts-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	CREATE TABLE EAVPosts (
		id							bigint						PRIMARY KEY,
		entityTypeId				int							NULL
			CONSTRAINT FK_EAVBlogs_EntityTypeId
				FOREIGN KEY REFERENCES EAVEntityTypes(id),
		publishId					int 						NOT NULL
			CONSTRAINT FK_EAVBlogs_PublishId
				FOREIGN KEY REFERENCES EAVBlogPublishes(id),
		slug						nvarchar(1024)				NOT NULL,
		title						nvarchar(256)				NOT NULL,
		[description]				ntext						NOT NULL,
		metaTitle					nvarchar(256)					NULL,
		metaDescription				nvarchar(512)					NULL,
		metaKeywords				nvarchar(512)					NULL,
		userId						bigint							NULL
			CONSTRAINT FK_EAVBlogs_UserId
				FOREIGN KEY REFERENCES Users(id),
		isDeleted					bit							NULL,
		[createdAt]					datetimeoffset				NOT NULL,
		[updatedAt]					datetimeoffset				NOT NULL,
	);


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-posts-v1', GETDATE(), GETDATE()
END

GO

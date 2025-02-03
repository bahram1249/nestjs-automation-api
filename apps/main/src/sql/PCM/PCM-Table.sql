
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

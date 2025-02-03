


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
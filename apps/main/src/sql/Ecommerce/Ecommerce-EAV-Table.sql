
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'eav-ecommerce-eav-entity-type-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('ecommerce'))
		)
BEGIN

	ALTER TABLE EAVEntityTypes 
        ADD shippingWayId int NULL
            CONSTRAINT FK_EAVEntityTypes_ShippingWayId
				FOREIGN KEY REFERENCES ECShippingWays(id)

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'eav-ecommerce-eav-entity-type-v1', GETDATE(), GETDATE()
END

GO



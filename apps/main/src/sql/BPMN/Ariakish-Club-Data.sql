IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'data-gs-providers-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN

        INSERT INTO GSProviders(id, title, createdAt, updatedAt)
        SELECT 1, N'ARIAKISH_SELLER', GETDATE(), GETDATE()


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'data-gs-providers-v1', GETDATE(), GETDATE()
    
    END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'data-gs-guaranteeconfirmstatuses-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN

        INSERT INTO GSGuaranteeConfirmStatuses(id, title, createdAt, updatedAt)
        VALUES (1, N'منتظر تایید', GETDATE(), GETDATE())
                ,(2, N'تایید شده', GETDATE(), GETDATE())

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'data-gs-guaranteeconfirmstatuses-v1', GETDATE(), GETDATE()
    
    END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'data-gs-guaranteeperiods-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN

        INSERT INTO GSGuaranteePeriods(title, providerText, createdAt, updatedAt)
        VALUES  (N'گارانتی یک ماه', N'1MONTHS_PERIOD', GETDATE() ,GETDATE())
            , (N'گارانتی دو ماه', N'2MONTHS_PERIOD', GETDATE() ,GETDATE())
            , (N'گارانتی سه ماه', N'3MONTHS_PERIOD', GETDATE() ,GETDATE())
            , (N'گارانتی چهار ماه', N'4MONTHS_PERIOD', GETDATE() ,GETDATE())
            , (N'گارانتی پنج ماه', N'5MONTHS_PERIOD', GETDATE() ,GETDATE())
            , (N'گارانتی شش ماه', N'6MONTHS_PERIOD', GETDATE() ,GETDATE())
            , (N'گارانتی هفت ماه', N'7MONTHS_PERIOD', GETDATE() ,GETDATE())
            , (N'گارانتی هشت ماه', N'8MONTHS_PERIOD', GETDATE() ,GETDATE())
            , (N'گارانتی نه ماه', N'9MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی ده ماه', N'10MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی یازده ماه', N'11MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی دوازده ماه', N'12MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی سیزده ماه', N'13MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی چهارده ماه', N'14MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی پانزده ماه', N'15MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی شانزده ماه', N'16MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی هفده ماه', N'17MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی هجده ماه', N'18MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی نوزده ماه', N'19MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی بیست ماه', N'20MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی بیست و یک ماه', N'21MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی بیست و دو ماه', N'22MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی بیست و سه ماه', N'23MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی بیست و چهار ماه', N'24MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی بیست و پنج ماه', N'25MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی بیست و شش ماه', N'26MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی بیست و هفت ماه', N'27MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی بیست و هشت ماه', N'28MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی بیست و نه ماه', N'29MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی سی ماه', N'30MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی سی و یک ماه', N'31MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی سی و دو ماه', N'32MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی سی و سه ماه', N'33MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی سی و چهار ماه', N'34MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی سی و پنج ماه', N'35MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی سی و شش ماه', N'36MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی سی و هفت ماه', N'37MONTHS_PERIOD', GETDATE() ,GETDATE())
            , ( N'گارانتی سی و هشت ماه', N'38MONTHS_PERIOD', GETDATE() ,GETDATE())

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'data-gs-guaranteeperiods-v1', GETDATE(), GETDATE()
    
    END

GO



IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'data-gs-guaranteetypes-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
    )
    BEGIN

        INSERT INTO GSGuaranteeTypes(id, title, createdAt, updatedAt)
        VALUES (1, N'گارانتی عادی', GETDATE(), GETDATE())
            , (2, N'گارانتی VIP', GETDATE(), GETDATE())

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'data-gs-guaranteetypes-v1', GETDATE(), GETDATE()
    
    END

GO


IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'gs-brand-offset-settings-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
	
BEGIN
	
	INSERT INTO Settings([key], [value], [type], createdAt, updatedAt)
	SELECT N'SELLER_BRAND_OFFSET', N'0', N'number', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-brand-offset-settings-Data-v1', GETDATE(), GETDATE()
END

GO



IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'gs-product-type-offset-settings-Data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)
	
BEGIN
	
	INSERT INTO Settings([key], [value], [type], createdAt, updatedAt)
	SELECT N'SELLER_PRODUCT_TYPE_OFFSET', N'0', N'number', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-product-type-offset-settings-Data-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'gs-variant-offset-settings-Data-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)

BEGIN

	INSERT INTO Settings([key], [value], [type], createdAt, updatedAt)
	SELECT N'SELLER_VARIANT_OFFSET', N'0', N'number', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-variant-offset-settings-Data-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS ( SELECT 1 FROM Migrations WHERE version = 'gs-guarantee-offset-settings-Data-v1'
			)
	AND EXISTS (
		SELECT 1 FROM Settings
		WHERE ([key] = 'CUSTOMER_NAME' AND [value] IN ('AriaKish'))
		)

BEGIN

	INSERT INTO Settings([key], [value], [type], createdAt, updatedAt)
	SELECT N'SELLER_GUARANTEE_OFFSET', N'0', N'number', getdate(), getdate()

	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'gs-guarantee-offset-settings-Data-v1', GETDATE(), GETDATE()
END

GO

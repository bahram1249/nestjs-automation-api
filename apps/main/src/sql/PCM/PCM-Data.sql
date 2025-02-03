
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
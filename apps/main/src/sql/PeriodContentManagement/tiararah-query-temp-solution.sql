DECLARE @signUpStartDate date = '2023-06-15'
SELECT *
FROM PersianDates
WHERE GregorianDate = @signUpStartDate

DECLARE @periodTypeId int = 4
DECLARE @offsetDay int = (
	SELECT TOP 1 DATEDIFF(DAY,startDate, @signUpStartDate)
	FROM PCMPeriods
	WHERE periodTypeId = @periodTypeId
	 AND startDate <= @signUpStartDate AND endDate >= @signUpStartDate
)

PRINT @offsetDay



SELECT id
	,startDate
	,persianStartDate
	,endDate
	,persianEndDate
	,rn 
	FROM (
	SELECT id
		, pdStart.GregorianDate as startDate
		, pdStart.YearMonthDay as persianStartDate
		, pdEnd.GregorianDate as endDate
		, pdEnd.YearMonthDay as persianEndDate
		, ROW_NUMBER() OVER(order by startDate asc) as rn
	FROM PCMPeriods t
	LEFT JOIN PersianDates pdStart
	ON DATEADD(DAY, @offsetDay, t.startDate) = pdStart.GregorianDate
	LEFT JOIN PersianDates pdEnd
	ON DATEADD(DAY, @offsetDay, t.endDate) = pdEnd.GregorianDate
	WHERE t.periodTypeId = @periodTypeId
		AND DATEADD(DAY, @offsetDay , endDate) >=  @signUpStartDate
					
) T
WHERE startDate <= getdate()
	AND endDate >= getdate()




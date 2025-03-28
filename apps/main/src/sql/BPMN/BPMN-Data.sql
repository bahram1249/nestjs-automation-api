IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-condition-types-data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
		)
BEGIN

	INSERT INTO BPMNConditionTypes(id, [name], createdAt, updatedAt)
    VALUES(1, N'SQL_CONDITION', GETDATE(), GETDATE()),
            (2, N'SOURCE_CONDITION', GETDATE(), GETDATE())


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'bpmn-condition-types-data-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-activity-types-data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
		)
BEGIN

	INSERT INTO BPMNActivityTypes(id, [name], createdAt, updatedAt)
    VALUES (1, N'SIMPLE_STATE', GETDATE(), GETDATE())
        , (2, N'EVENT_STATE', GETDATE(), GETDATE())


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'bpmn-activity-types-data-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-activity-types-data-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
		)
BEGIN

	INSERT INTO BPMNActivityTypes(id, [name], createdAt, updatedAt)
    VALUES (3, N'SUBPROCESS_STATE', GETDATE(), GETDATE())


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'bpmn-activity-types-data-v2', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-activity-types-data-v3' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
		)
BEGIN

	INSERT INTO BPMNActivityTypes(id, [name], createdAt, updatedAt)
    VALUES (4, N'CLIENT_STATE', GETDATE(), GETDATE())


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'bpmn-activity-types-data-v3', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-action-types-data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
		)
BEGIN

	
    INSERT INTO BPMNActionTypes(id, [name], createdAt, updatedAt)
    VALUES (1, N'SQL_ACTION', GETDATE(), GETDATE())
        , (2, N'SOURCE_ACTION', GETDATE(), GETDATE())

       


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'bpmn-action-types-data-v1', GETDATE(), GETDATE()
END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-node-command-types-data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
		)
BEGIN

	
    INSERT INTO BPMNNodeCommandTypes(id, [name], [commandColor], createdAt, updatedAt)
    VALUES (1, N'SUBMIT', N'#16C47F',GETDATE(), GETDATE())
        ,(2, N'REJECT', N'#F93827',GETDATE(), GETDATE())
        ,(3, N'REVERSE', N'#FFD65A',GETDATE(), GETDATE())


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'bpmn-node-command-types-data-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-referral-types-data-v1' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
		)
BEGIN

	
    INSERT INTO BPMNReferralTypes(id, [name], [createdAt], [updatedAt])
    VALUES (1, N'DIRECT', GETDATE(), GETDATE())
        , (2, N'ROLE', GETDATE(), GETDATE())
        , (3, N'SAME_ORGANIZATION_ROLE', GETDATE(), GETDATE())


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'bpmn-referral-types-data-v1', GETDATE(), GETDATE()
END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-referral-types-data-v2' 
			)
	AND EXISTS (
		SELECT 1 FROM Settings 
		WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
		)
BEGIN

	
    INSERT INTO BPMNReferralTypes(id, [name], [createdAt], [updatedAt])
    VALUES (4, N'REQUESTOWNER', GETDATE(), GETDATE())


	INSERT INTO Migrations(version, createdAt, updatedAt)
	SELECT 'bpmn-referral-types-data-v2', GETDATE(), GETDATE()
END

GO


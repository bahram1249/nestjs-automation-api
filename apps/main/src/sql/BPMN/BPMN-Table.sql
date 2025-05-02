
-- process
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-process-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNProcess(
            id                              int identity(1,1)               PRIMARY KEY,
            [name]                          nvarchar(256)                   NOT NULL,
            [isSubProcess]                  bit                             NULL,
            isDeleted                       bit                             NULL,
            staticId                        int                             NULL,
            [createdAt]					    datetimeoffset			        NOT NULL,
            [updatedAt]					    datetimeoffset			        NOT NULL
        );
        
        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-process-v1', GETDATE(), GETDATE()
    END

GO

-- condition types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-conditiontypes-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNConditionTypes
        (
            id                              int                             PRIMARY KEY,
            [name]                          nvarchar(256)                   NOT NULL,
            [createdAt]					    datetimeoffset			        NOT NULL,
            [updatedAt]					    datetimeoffset			        NOT NULL
        )

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-conditiontypes-v1', GETDATE(), GETDATE()
    END

GO

-- conditions
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-conditions-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNConditions
        (
            id                          int identity(1,1)               PRIMARY KEY,
            [name]                      nvarchar(256)                   NOT NULL,
            conditionTypeId             int                             NOT NULL
                CONSTRAINT FK_BPMNConditions_ConditionTypeId
                    FOREIGN KEY REFERENCES BPMNConditionTypes(id),
            conditionSource             nvarchar(1024)                  NULL,
            conditionText               nvarchar(max)                   NULL,
            isDeleted                   bit                             NULL,
            [createdAt]				    datetimeoffset			        NOT NULL,
            [updatedAt]				    datetimeoffset			        NOT NULL

        )

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-conditions-v1', GETDATE(), GETDATE()
    END

GO

-- activity types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-actiontypes-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNActionTypes
        (
            id                          int                             PRIMARY KEY,
            [name]                      nvarchar(256)                   NOT NULL,
            [createdAt]			        datetimeoffset			        NOT NULL,
            [updatedAt]				    datetimeoffset			        NOT NULL
        )

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-actiontypes-v1', GETDATE(), GETDATE()
    END

GO

-- actions
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-actions-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNActions
        (
            id                          int identity(1,1)               PRIMARY KEY,
            [name]                      nvarchar(256)                   NOT NULL,
            actionTypeId                int                             NOT NULL
                CONSTRAINT FK_BPMNAction_ActionTypeId
                    FOREIGN KEY REFERENCES BPMNActionTypes(id),
            actionSource                nvarchar(1024)                  NULL,
            actionText                  nvarchar(max)                   NULL,
            isDeleted                   bit                             NULL,
            [createdAt]				    datetimeoffset      			NOT NULL,
            [updatedAt]				    datetimeoffset		        	NOT NULL
        )


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-actions-v1', GETDATE(), GETDATE()
    END

GO

-- activity types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-activitytypes-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNActivityTypes
        (
            id                          int                             PRIMARY KEY,
            [name]                      nvarchar(256)                   NOT NULL,
            [createdAt]			        datetimeoffset      			NOT NULL,
            [updatedAt]			        datetimeoffset		        	NOT NULL
        )


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-activitytypes-v1', GETDATE(), GETDATE()
    END

GO

-- activities
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-activities-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN
        
        CREATE TABLE BPMNActivities
        (
            id                          int identity(1,1)               PRIMARY KEY,
            [name]                      nvarchar(256)                   NOT NULL,
            isStartActivity             bit                             NOT NULL,
            isEndActivity               bit                             NOT NULL,
            activityTypeId              int                             NOT NULL
                CONSTRAINT FK_BPMNActivities_ActivityTypeId
                    FOREIGN KEY REFERENCES BPMNActivityTypes(id),
            processId                   int                             NOT NULL
                CONSTRAINT FK_BPMNActivities_ProcesssId
                    FOREIGN KEY REFERENCES BPMNProcess(id),
            haveMultipleItems           bit                             NOT NULL,
            insideProcessRunnerId       int                             NULL
                CONSTRAINT FK_BPMNActivities_insideProcessRunnerId
                    FOREIGN KEY REFERENCES BPMNProcess(id),
            isDeleted                   bit                             NULL,
            [createdAt]				    datetimeoffset			        NOT NULL,
            [updatedAt]				    datetimeoffset			        NOT NULL
        )


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-activities-v1', GETDATE(), GETDATE()
    END

GO

-- inbound actions
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-inboundactions-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNInboundActions
        (
            id                          int identity(1,1)               PRIMARY KEY,
            activityId                  int                             NOT NULL
                CONSTRAINT FK_BPMNInboundActions_ActivityId
                    FOREIGN KEY REFERENCES BPMNActivities(id),
            actionId                    int                             NOT NULL
                CONSTRAINT FK_BPMNInboundActions_ActionId
                    FOREIGN KEY REFERENCES BPMNActions(id),
            priority                    int                             NULL,
            isDeleted                   int                             NULL,
            [createdAt]				    datetimeoffset			        NOT NULL,
            [updatedAt]				    datetimeoffset			        NOT NULL
        )


        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-inboundactions-v1', GETDATE(), GETDATE()
    END

GO


-- outbound actions
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-outboundactions-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNOutboundActions
        (
            id                          int identity(1,1)               PRIMARY KEY,
            activityId                  int                             NOT NULL
                CONSTRAINT FK_BPMNOutboundActions_ActivityId
                    FOREIGN KEY REFERENCES BPMNActivities(id),
            actionId                    int                             NOT NULL
                CONSTRAINT FK_BPMNOutboundActions_ActionId
                    FOREIGN KEY REFERENCES BPMNActions(id),
            priority                    int                             NULL,
            isDeleted                   int                             NULL,
            [createdAt]				    datetimeoffset			        NOT NULL,
            [updatedAt]				    datetimeoffset			        NOT NULL
        )
        
        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-outboundactions-v1', GETDATE(), GETDATE()
    END

GO

-- referal types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-referraltypes-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNReferralTypes
        (
            id                              int                             PRIMARY KEY,
            [name]                          nvarchar(256)                   NOT NULL,
            [createdAt]				        datetimeoffset			        NOT NULL,
            [updatedAt]				        datetimeoffset			        NOT NULL
        )
        
        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-referraltypes-v1', GETDATE(), GETDATE()
    END

GO


-- Nodes
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-nodes-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNNodes
        (
            id                               int identity(1,1)              PRIMARY KEY,
            fromActivityId                   int                            NOT NULL
                CONSTRAINT FK_BPMNNodes_FromActivityId
                    FOREIGN KEY REFERENCES BPMNActivities(id),
            toActivityId                     int                            NOT NULL
                CONSTRAINT FK_BPMNNodes_ToActivityId
                    FOREIGN KEY REFERENCES BPMNActivities(id),
            autoIterate                       bit                            NOT NULL,
            conditionFailedActionRunnerId    int                            NULL
                CONSTRAINT FK_BPMNNodes_ConditionFailedActionRunnerId
                    FOREIGN KEY REFERENCES BPMNActions(id),
            referralTypeId                    int                            NOT NULL
                CONSTRAINT FK_BPMNNodes_ReferralTypeId
                    FOREIGN KEY REFERENCES BPMNReferralTypes(id),
            roleId                           int                            NULL
                CONSTRAINT FK_BPMNNodes_RoleId
                    FOREIGN KEY REFERENCES Roles(id),
            userId                           bigint                         NULL
                CONSTRAINT FK_BPMNNodes_UserId
                    FOREIGN KEY REFERENCES Users(id),
            injectForm                       nvarchar(256)                  NULL,
            isDeleted                        bit                            NULL,
            [createdAt]				         datetimeoffset			        NOT NULL,
            [updatedAt]				         datetimeoffset			        NOT NULL
        )
        
        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-nodes-v1', GETDATE(), GETDATE()
    END

GO

-- Nodes v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-nodes-v2'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        ALTER TABLE BPMNNodes
            ADD [name] nvarchar(512) NULL,
                [description] nvarchar(1024) NULL
        
        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-nodes-v2', GETDATE(), GETDATE()
    END

GO

-- Nodes v3
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-nodes-v3'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        ALTER TABLE BPMNNodes
            ADD eventCall bit null
        
        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-nodes-v3', GETDATE(), GETDATE()
    END

GO

-- Node Command Types
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-nodecommandtypes-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNNodeCommandTypes
        (
            id                               int                                 PRIMARY KEY,
            [name]                           nvarchar(256)                       NOT NULL,
            commandColor                     nvarchar(128)                       NULL,
            [createdAt]				         datetimeoffset			             NOT NULL,
            [updatedAt]				         datetimeoffset			             NOT NULL
        );
        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-nodecommandtypes-v1', GETDATE(), GETDATE()
    END

GO


-- Node Commands
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-nodecommands-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNNodeCommands
        (
            id                               int identity(1,1)                   PRIMARY KEY,
            nodeId                           int                                 NOT NULL
                CONSTRAINT FK_BPMNNodeCommands_NodeId
                    FOREIGN KEY REFERENCES BPMNNodes(id),
            [name]                           nvarchar(256)                       NOT NULL,
            nodeCommandTypeId                int                                 NOT NULL
                CONSTRAINT FK_BPMNNodeCommand_NodeCommandTypeId
                    FOREIGN KEY REFERENCES BPMNNodeCommandTypes(id),
            isDeleted                        bit                                 NULL,
            [createdAt]				         datetimeoffset			             NOT NULL,
            [updatedAt]				         datetimeoffset			             NOT NULL
        )
        
        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-nodecommands-v1', GETDATE(), GETDATE()
    END

GO

-- Node Commands v2
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-nodecommands-v2'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        ALTER TABLE BPMNNodeCommands
            ADD [route] nvarchar(1024) null
        
        
        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-nodecommands-v2', GETDATE(), GETDATE()
    END

GO

-- Node Conditions
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-nodeconditions-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNNodeConditions
        (
            nodeId                  int                                 NOT NULL
                CONSTRAINT FK_BPMNNodeCondition_NodeId
                    FOREIGN KEY REFERENCES BPMNNodes(id),
            conditionId             int                                 NOT NULL
                CONSTRAINT FK_BPMNNodeCondition_ConditionId
                    FOREIGN KEY REFERENCES BPMNConditions(id),
            priority                int                                 NULL,
            [createdAt]				datetimeoffset			            NOT NULL,
            [updatedAt]				datetimeoffset			            NOT NULL,
            CONSTRAINT PK_BPMNNodeConditions PRIMARY KEY CLUSTERED(nodeId, conditionId)
        )    

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-nodeconditions-v1', GETDATE(), GETDATE()
    END

GO

-- Organization
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-organization-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNOrganizations
        (
            id                      int identity(1,1)                   PRIMARY KEY,
            [name]                  nvarchar(1024)                      NOT NULL,
            isDeleted               bit                                 NULL,
            parentId                int                                 NULL
                CONSTRAINT FK_BPMNOrganization_ParentId
                    FOREIGN KEY REFERENCES BPMNOrganizations(id),
            [createdAt]				datetimeoffset			            NOT NULL,
            [updatedAt]				datetimeoffset			            NOT NULL,
        )

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-organization-v1', GETDATE(), GETDATE()
    END

GO

-- Occurred Events
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-occurredevents-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNOccurredEvents
        (
            id                      int identity(1,1)                   PRIMARY KEY,
            [name]                  nvarchar(1024)                      NOT NULL,
            isDeleted               bit                                 NULL,
            [createdAt]				datetimeoffset			            NOT NULL,
            [updatedAt]				datetimeoffset			            NOT NULL,
        )

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-occurredevents-v1', GETDATE(), GETDATE()
    END

GO

-- Requests
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-requests-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNRequests
        (
            id                      bigint identity(1,1)                PRIMARY KEY,
            userId                  bigint                              NOT NULL
                CONSTRAINT  FK_BPMNRequests_UserId
                    FOREIGN KEY REFERENCES Users(id),
            processId               int                                 NOT NULL
                CONSTRAINT FK_BPMNRequests_ProcessId
                    FOREIGN KEY REFERENCES BPMNProcess(id),
            organizationId          int                                 NULL
                CONSTRAINT FK_BPMNRequests_OrganizationId
                    FOREIGN KEY REFERENCES BPMNOrganizations(id),    
            [createdAt]				datetimeoffset			            NOT NULL,
            [updatedAt]				datetimeoffset			            NOT NULL
        )      

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-requests-v1', GETDATE(), GETDATE()
    END

GO

-- Request Occurred Events
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-requestoccurredevents-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNRequestOccurredEvents
        (
            requestId               bigint                               NOT NULL
                CONSTRAINT FK_BPMNRequestOccuredEvents_RequestId
                    FOREIGN KEY REFERENCES BPMNRequests(id),
            occurredEventId         int                                  NOT NULL
                CONSTRAINT FK_BPMNRequestOccurredEvents_OccurredEventId
                    FOREIGN KEY REFERENCES BPMNOccurredEvents(id),
            id                      bigint identity(1,1)                NOT NULL,
            [createdAt]				datetimeoffset			            NOT NULL,
            [updatedAt]				datetimeoffset			            NOT NULL,
            CONSTRAINT PK_BPMNRequestOccuredEvents PRIMARY KEY CLUSTERED(requestId, occurredEventId, id)
        )

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-requestoccurredevents-v1', GETDATE(), GETDATE()
    END

GO

-- Request States
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-requeststates-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNRequestStates
        (
            requestId               bigint                              NOT NULL
                CONSTRAINT FK_BPMNRequestStates_RequestId
                    FOREIGN KEY REFERENCES BPMNRequests(id),
            id                      bigint identity(1,1)                NOT NULL,
            activityId              int                                 NOT NULL
                CONSTRAINT FK_BPMNRequestStates_ActivityId
                    FOREIGN KEY REFERENCES BPMNActivities(id),
            userId                  bigint                              NULL
                CONSTRAINT FK_BPMNRequestStates_UserId
                    FOREIGN KEY REFERENCES Users(id),
            roleId                  int                                 NULL
                CONSTRAINT FK_BPMNRequestStates_RoleId
                    FOREIGN KEY REFERENCES Roles(id),
            organizationId          int                                 NULL
                CONSTRAINT FK_BPMNRequestStates_OrganizationId
                    FOREIGN KEY REFERENCES BPMNOrganizations(id),
            returnRequestStateId    bigint                              NULL,                                 
            [createdAt]				datetimeoffset			            NOT NULL,
            [updatedAt]				datetimeoffset			            NOT NULL,
            CONSTRAINT PK_BPMNRequestStates PRIMARY KEY CLUSTERED (requestId, id)
        )


        CREATE NONCLUSTERED INDEX NIX_RequestStates_RequestId ON BPMNRequestStates(requestId);
        
        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-requeststates-v1', GETDATE(), GETDATE()
    END

GO

-- Request Histories
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-requesthistories-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNRequestHistories
        (
            requestId               bigint                              NOT NULL
                CONSTRAINT FK_BPMNRequestHistories_RequestId
                    FOREIGN KEY REFERENCES BPMNRequests(id),
            id                      bigint identity(1,1)                NOT NULL,
            nodeId                  int                                 NOT NULL
                CONSTRAINT FK_BPMNRequestHistories_NodeId
                    FOREIGN KEY REFERENCES BPMNNodes(id),
            nodeCommandId           int                                 NOT NULL
                CONSTRAINT FK_BPMNRequestHistories_NodeCommandId
                    FOREIGN KEY REFERENCES BPMNNodeCommands(id),
            fromActivityId          int                                 NOT NULL
                CONSTRAINT FK_BPMNRequestHistories_FromActivityId
                    FOREIGN KEY REFERENCES BPMNActivities(id),
            toActivityId            int                                 NOT NULL
                CONSTRAINT FK_BPMNRequestHistories_ToActivityId
                    FOREIGN KEY REFERENCES BPMNActivities(id),
            fromUserId              bigint                              NULL
                CONSTRAINT FK_BPMNRequestHistories_FormUserId
                    FOREIGN KEY REFERENCES Users(id),
            fromOrganizationId      int                                 NULL
                CONSTRAINT FK_BPMNRequestHistories_FromOrganizationId
                    FOREIGN KEY REFERENCES BPMNOrganizations(id),
            fromRoleId              int                                 NULL
                CONSTRAINT FK_BPMNRequestHistoreis_FromRoleId
                    FOREIGN KEY REFERENCES Roles(id),
            toUserId                bigint                              NULL 
                CONSTRAINT FK_BPMNRequestHistories_ToUserId
                    FOREIGN KEY REFERENCES Users(id),
            toRoleId                int                                 NULL
                CONSTRAINT FK_BPMNRequestHistories_ToRoleId
                    FOREIGN KEY REFERENCES Roles(id),
            toOrganizationId        int                                 NULL
                CONSTRAINT FK_BPMNRequestHistories_ToOrganizationId
                    FOREIGN KEY REFERENCES BPMNOrganizations(id),
            description             nvarchar(2048)                      NULL,
            executeBundle           nvarchar(56)                        NULL,
            [createdAt]				datetimeoffset			            NOT NULL,
            [updatedAt]				datetimeoffset			            NOT NULL,
            CONSTRAINT PK_BPMNRequestHistories PRIMARY KEY CLUSTERED(requestId, id)
        )        
        
        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-requesthistories-v1', GETDATE(), GETDATE()
    END

GO

IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-organizationusers-v1'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        CREATE TABLE BPMNOrganizationUsers
        (
            organizationId          int                                 NOT NULL
                CONSTRAINT FK_BPMNOrganizationUsers_OrganizationId
                    FOREIGN KEY REFERENCES BPMNOrganizations(id),
            userId                  bigint                              NOT NULL
                CONSTRAINT FK_BPMNOrganizationUsers_UserId
                    FOREIGN KEY REFERENCES Users(id),
            [createdAt]				datetimeoffset			            NOT NULL,
            [updatedAt]				datetimeoffset			            NOT NULL,
            CONSTRAINT PK_BPMNOrganizationUsers_OrganizationId_UserId
                PRIMARY KEY CLUSTERED (organizationId, userId)
        )

        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-organizationusers-v1', GETDATE(), GETDATE()
    END

GO


IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'bpmn-organizationusers-v2'
)
    AND EXISTS (
        SELECT 1 FROM Settings
        WHERE ([key] = 'SITE_NAME' AND [value] IN ('BPMN'))
    )
    BEGIN

        ALTER TABLE BPMNOrganizationUsers
            DROP CONSTRAINT PK_BPMNOrganizationUsers_OrganizationId_UserId

        ALTER TABLE BPMNOrganizationUsers
            ADD roleId int NULL
                CONSTRAINT FK_BPMNOrganizationUsers_RoleId
                    FOREIGN KEY REFERENCES Roles(id)

        ALTER TABLE BPMNOrganizationUsers
            ADD id bigint identity(1,1) NOT NULL
        

        ALTER TABLE BPMNOrganizationUsers
            ADD CONSTRAINT PK_BPMNOrganizationUsers_OrganizationId_UserId_Id 
                PRIMARY KEY CLUSTERED(organizationId, userId, id)

        
        INSERT INTO Migrations(version, createdAt, updatedAt)
        SELECT 'bpmn-organizationusers-v2', GETDATE(), GETDATE()
    END

GO


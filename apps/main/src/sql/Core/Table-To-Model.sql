declare @Result nvarchar(max) = ''
declare @TableName nvarchar(max) = 'ECScheduleSendingTypes'

SELECT @Result = @Result +
  '@AutoMap()' + CHAR(13)+CHAR(10) +
  '@Column({' 
  + CHAR(13)+CHAR(10) + 'type: '
  +  SequelizeColumnType
  + IIF(IsIdentity = 0, '', ',' + CHAR(13)+CHAR(10) + 'autoIncrement: true')
  + IIF(SeuqelizeNullable = 0, '', ',' + CHAR(13)+CHAR(10) + 'allowNull: true')
  + IIF(isPrimaryKey = 0, '', ',' + CHAR(13)+CHAR(10) + 'primaryKey: true')
  + CHAR(13)+CHAR(10)
  + ' })' + CHAR(13)+CHAR(10)
  + ColumnName + NestNullable + ': '+ (CASE WHEN ColumnName = 'RowVersion' THEN 'byte[]' ELSE NestType END) + ';' +  CHAR(13)+CHAR(10)   
FROM        
  (        
	SELECT DISTINCT        
	replace(col.name, ' ', '_') ColumnName,        
	column_id ColumnId,        
	case typ.name         
		when 'bigint' then 'DataType.BIGINT'        
		when 'binary' then 'DataType.STRING.BINARY'        
		when 'bit' then 'DataType.BOOLEAN'        
		when 'char' then 'DataType.STRING'        
		when 'date' then 'DataType.DATE'        
		when 'datetime' then 'DataType.DATE'        
		when 'datetime2' then 'DataType.DATE'        
		when 'datetimeoffset' then 'DataType.DATE'        
		when 'decimal' then 'number'        
		when 'float' then 'DataType.FLOAT'        
		when 'image' then 'DataType.STRING.BINARY'        
		when 'int' then 'DataType.INTEGER'        
		when 'money' then 'number'        
		when 'nchar' then 'DataType.CHAR'        
		when 'ntext' then 'DataType.STRING'        
		when 'numeric' then 'number'        
		when 'nvarchar' then 'DataType.STRING'        
		when 'real' then 'DataType.REAL'        
		when 'smalldatetime' then 'DataType.DATE'        
		when 'smallint' then 'DataType.INTEGER'        
		when 'smallmoney' then 'number'        
		when 'text' then 'DataType.STRING'        
		when 'time' then 'DataType.TIME'        
		when 'timestamp' then 'DataType.DATE'        
		when 'rowversion' then 'byte[]'        
		when 'tinyint' then 'DataType.INTEGER'        
		when 'uniqueidentifier' then 'DataType.UUID'        
		when 'varbinary' then 'byte[]'        
		when 'varchar' then 'DataType.STRING'        
		else 'UNKNOWN_' + typ.name        
	end SequelizeColumnType,
	case typ.name         
		when 'bigint' then 'bigint'        
		when 'binary' then 'number'        
		when 'bit' then 'boolean'        
		when 'char' then 'string'        
		when 'date' then 'Date'        
		when 'datetime' then 'Date'        
		when 'datetime2' then 'Date'        
		when 'datetimeoffset' then 'Date'        
		when 'decimal' then 'number'        
		when 'float' then 'number'        
		when 'image' then 'number'        
		when 'int' then 'number'        
		when 'money' then 'number'        
		when 'nchar' then 'string'        
		when 'ntext' then 'string'        
		when 'numeric' then 'number'        
		when 'nvarchar' then 'string'        
		when 'real' then 'number'        
		when 'smalldatetime' then 'date'        
		when 'smallint' then 'number'        
		when 'smallmoney' then 'number'        
		when 'text' then 'string'        
		when 'time' then 'Date'        
		when 'timestamp' then 'Date'        
		when 'rowversion' then 'byte[]'        
		when 'tinyint' then 'number'        
		when 'uniqueidentifier' then 'string'        
		when 'varbinary' then 'byte[]'        
		when 'varchar' then 'string'        
		else 'UNKNOWN_' + typ.name        
	end NestType,
	case 
	when isnull(col.is_nullable, 0) = 0 then ''
	when isnull(col.is_nullable, 0) = 1 then '?'
	end NestNullable,
	case 
	when isnull(col.is_nullable, 0) = 0 then 0
	when isnull(col.is_nullable, 0) = 1 then 1
	end SeuqelizeNullable,

	col.is_identity IsIdentity,
	case when constraint_column_usage.COLUMN_NAME is not null then 1 else 0 end as isPrimaryKey
    
	FROM sys.columns col        
	JOIN sys.types typ
	ON col.system_type_id = typ.system_type_id 
		AND col.user_type_id = typ.user_type_id
	LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS table_constraint
	ON table_constraint.TABLE_NAME = @TableName
		AND table_constraint.Constraint_Type = 'PRIMARY KEY'
	LEFT JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE constraint_column_usage
	ON constraint_column_usage.TABLE_NAME = table_constraint.TABLE_NAME
		AND constraint_column_usage.CONSTRAINT_NAME = table_constraint.CONSTRAINT_NAME
		AND constraint_column_usage.COLUMN_NAME = col.name
	WHERE object_id = object_id(@TableName)
		AND col.name NOT IN ('createdAt', 'updatedAt')       
  ) T        
  ORDER BY ColumnId  


  print(@Result)
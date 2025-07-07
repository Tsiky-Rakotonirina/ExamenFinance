-- Create a new database
CREATE DATABASE database_name;

-- Drop an existing database
DROP DATABASE database_name;

-- Use a specific database
USE database_name;

-- Create a new table
CREATE TABLE table_name (
    column1 datatype PRIMARY KEY auto_increment,
    column2 datatype,
    column3 datatype,
    foreign key (column3) references table_name(column5)
);

-- Drop an existing table
DROP TABLE table_name;

-- Create a view
CREATE VIEW view_name AS
SELECT column1, column2
FROM table_name
WHERE condition;

-- Drop a view
DROP VIEW view_name;

-- Insert data into a table
INSERT INTO table_name (column1, column2, column3)
VALUES (value1, value2, value3),(value4, value5, value6);

-- Update data in a table
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;

-- Delete data from a table
DELETE FROM table_name
WHERE condition;

-- Create an index
CREATE INDEX index_name ON table_name (column_name);

-- Drop an index
DROP INDEX index_name ON table_name;

-- Add a column to an existing table
ALTER TABLE table_name ADD column_name datatype;

-- Drop a column from an existing table
ALTER TABLE table_name DROP COLUMN column_name;

-- Rename a column in an existing table
ALTER TABLE table_name RENAME COLUMN old_name TO new_name;

-- Rename a table
RENAME TABLE old_table_name TO new_table_name;

-- Intelligent insertion example
CREATE PROCEDURE intelligent_insert(
    IN param1 datatype,
    IN param2 datatype,
    IN param3 datatype
)
BEGIN
    DECLARE existing_id INT;

    -- Check if the record already exists
    SELECT id INTO existing_id
    FROM table_name
    WHERE column1 = param1 AND column2 = param2;

    -- If the record does not exist, insert it
    IF existing_id IS NULL THEN
        INSERT INTO table_name (column1, column2, column3)
        VALUES (param1, param2, param3);
    ELSE
        -- Optionally, update the existing record
        UPDATE table_name
        SET column3 = param3
        WHERE id = existing_id;
    END IF;
END

-- Call the intelligent insertion procedure
CALL intelligent_insert(value1, value2, value3);

-- Créer un trigger qui s'exécute avant une insertion
CREATE TRIGGER trigger_name
BEFORE(AFTER) INSERT(UPDATE,DELETE) ON table_name
FOR EACH ROW
BEGIN
    -- Actions à exécuter
END;

CREATE FUNCTION function_name (param1 datatype)
RETURNS datatype
BEGIN
    RETURN value;
END;

-- Operations within BEGIN...END blocks

-- Declare variables
DECLARE var_name datatype DEFAULT default_value;

-- Set variable values
SET var_name = value;

-- Conditional statements
IF condition THEN
ELSEIF condition THEN
ELSE
END IF;

-- Loop statements
WHILE condition DO
END WHILE;

-- Repeat loop
REPEAT
UNTIL condition
END REPEAT;

-- Loop with a counter
FOR counter_variable IN start_value..end_value DO
END FOR;

-- Case statements
CASE
    WHEN condition THEN
    WHEN condition THEN
    ELSE
END CASE;

--Operation in select

-- Select data from a table
SELECT column1, column2
FROM table_name
WHERE condition;

-- Select all columns from a table
SELECT * FROM table_name;

-- Select specific columns from a table
SELECT column1, column2 FROM table_name;

-- Select distinct values
SELECT DISTINCT column1 FROM table_name;

-- Select with an alias
SELECT column1 AS alias_name FROM table_name;

-- Select with a WHERE clause
SELECT column1, column2 FROM table_name WHERE condition;

-- Select with an ORDER BY clause
SELECT column1, column2 FROM table_name ORDER BY column1 ASC; -- or DESC

-- Select with a LIMIT clause
SELECT column1, column2 FROM table_name LIMIT 10;

-- Select with a GROUP BY clause
SELECT column1, COUNT(*) FROM table_name GROUP BY column1;

-- Select with a HAVING clause
SELECT column1, COUNT(*) FROM table_name GROUP BY column1 HAVING COUNT(*) > 1;

-- Aggregate functions
SELECT SUM(column_name) FROM table_name; -- Sum of values in column_name
SELECT AVG(column_name) FROM table_name; -- Average of values in column_name
SELECT MAX(column_name) FROM table_name; -- Maximum value in column_name
SELECT MIN(column_name) FROM table_name; -- Minimum value in column_name
SELECT GROUP_CONCAT(column_name) FROM table_name; -- Concatenate values in column_name into a single string
SELECT VARIANCE(column_name) FROM table_name; -- Variance of values in column_name
SELECT STDDEV(column_name) FROM table_name; -- Standard deviation of values in column_name
SELECT BIT_AND(column_name) FROM table_name; -- Bitwise AND of all values in column_name
SELECT BIT_OR(column_name) FROM table_name; -- Bitwise OR of all values in column_name
SELECT BIT_XOR(column_name) FROM table_name; -- Bitwise XOR of all values in column_name

-- Mathematical operations
SELECT MOD(column_name, divisor) FROM table_name; -- Remainder of column_name divided by divisor
SELECT column1 / column2 AS result FROM table_name;
SELECT ABS(column_name) FROM table_name; -- Absolute value of column_name
SELECT CEIL(column_name) FROM table_name; -- Smallest integer value not less than column_name
SELECT FLOOR(column_name) FROM table_name; -- Largest integer value not greater than column_name
SELECT ROUND(column_name, decimals) FROM table_name; -- Round column_name to the specified number of decimal places
SELECT SQRT(column_name) FROM table_name; -- Square root of column_name
SELECT POWER(column_name, exponent) FROM table_name; -- column_name raised to the power of exponent
SELECT EXP(column_name) FROM table_name; -- Exponential value of column_name
SELECT LOG(column_name) FROM table_name; -- Natural logarithm of column_name
SELECT LEAST(value1, value2) AS smallest_value;
SELECT GREATEST(value1, value2) AS largest_value;

--String operation
SELECT CONCAT(string1, string2) FROM table_name;
SELECT UPPER(column_name) FROM table_name;
SELECT LOWER(column_name) FROM table_name;
SELECT TRIM(column_name) FROM table_name;//remove leading and trailing spaces

-- Select with a REPLACE clause
SELECT REPLACE(column_name, 'old', 'new') FROM table_name;

-- Select with a JOIN
SELECT a.column1, b.column2
FROM table1 a
JOIN table2 b ON a.common_column = b.common_column;

-- Select with a LEFT JOIN
SELECT a.column1, b.column2
FROM table1 a
LEFT JOIN table2 b ON a.common_column = b.common_column;

-- Select with a FULL OUTER JOIN
SELECT a.column1, b.column2
FROM table1 a
FULL OUTER JOIN table2 b ON a.common_column = b.common_column;

-- Select with a UNION
SELECT column1, column2 FROM table1
UNION
SELECT column1, column2 FROM table2;

-- Select with a subquery (INTERSECTS)
SELECT column1, column2
FROM table_name
WHERE column3 IN (SELECT column3 FROM another_table WHERE condition);

-- Select with a CASE statement
SELECT column1,
    CASE
        WHEN condition1 THEN result1
        WHEN condition2 THEN result2
        ELSE result3
    END AS alias_name
FROM table_name;

--CTE
WITH cte_name AS (
    SELECT column1, column2
    FROM table_name
    WHERE condition
)
SELECT column1, column2
FROM cte_name
WHERE another_condition;

--WITH NOT POSSIBILTY 
-- Select with a WHERE IN clause
SELECT column1, column2
FROM table_name
WHERE column1 IN (value1, value2, value3);

-- Select with a WHERE BETWEEN clause
SELECT column1, column2
FROM table_name
WHERE column1 BETWEEN value1 AND value2;

-- Select with a WHERE IS NULL clause
SELECT column1, column2
FROM table_name
WHERE column1 IS NULL;

-- Select with a WHERE EXISTS clause
SELECT column1, column2
FROM table_name
WHERE EXISTS (SELECT 1 FROM another_table WHERE condition);

-- Select with a WHERE ALL clause // all values of column1 in table_name must be in column1 of another_table
SELECT column1, column2
FROM table_name
WHERE column1 = ALL (SELECT column1 FROM another_table WHERE condition);


-- Obtenir la date actuelle
SELECT CURRENT_DATE;

-- Obtenir l'heure actuelle
SELECT CURRENT_TIME;

-- Obtenir la date et l'heure actuelles
SELECT NOW();

-- Ajouter des jours à une date
SELECT DATE_ADD(date_column, INTERVAL 7 DAY) FROM table_name;

-- Soustraire des jours d'une date
SELECT DATE_SUB(date_column, INTERVAL 7 DAY) FROM table_name;

-- Différence entre deux dates en jours
SELECT DATEDIFF(date1, date2) FROM table_name;

-- Extraire l'année d'une date
SELECT YEAR(date_column) FROM table_name;

-- Extraire le mois d'une date
SELECT MONTH(date_column) FROM table_name;

-- Extraire le jour d'une date
SELECT DAY(date_column) FROM table_name;

-- Formater une date
SELECT DATE_FORMAT(date_column, '%Y-%m-%d') FROM table_name;
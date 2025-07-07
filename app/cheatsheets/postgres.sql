-- Create a new database
CREATE DATABASE database_name;

-- Drop an existing database
DROP DATABASE database_name;

-- Connect to a specific database
\c database_name;

-- Create a new table
CREATE TABLE table_name (
    column1 datatype PRIMARY KEY,
    column2 datatype,
    column3 datatype
);

-- Drop an existing table
DROP TABLE table_name;

-- Insert data into a table
INSERT INTO table_name (column1, column2, column3)
VALUES (value1, value2, value3);

-- Select data from a table
SELECT column1, column2
FROM table_name
WHERE condition;

-- Update data in a table
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;

-- Delete data from a table
DELETE FROM table_name
WHERE condition;

-- Create a new user
CREATE USER username WITH PASSWORD 'password';

-- Grant privileges to a user
GRANT ALL PRIVILEGES ON DATABASE database_name TO username;

-- Revoke privileges from a user
REVOKE ALL PRIVILEGES ON DATABASE database_name FROM username;

-- Show all databases
\l

-- Show all tables in a database
\dt

-- Show the structure of a table
\d table_name;

-- Show all users
\du

-- Change a user's password
ALTER USER username WITH PASSWORD 'new_password';

-- Drop a user
DROP USER username;

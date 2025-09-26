-- Initialize the Rehome Platform database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The database and user are already created by the postgres environment variables
-- This file can be extended with initial data or schema as needed
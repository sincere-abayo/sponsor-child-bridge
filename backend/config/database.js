const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const config = require('./config');

// Create a connection pool
const pool = mysql.createPool(config.database);

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Create tables from schema file
async function createTablesIfNotExist() {
  try {
    const connection = await pool.getConnection();
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '../database_schema.sql');
    const schemaContent = await fs.readFile(schemaPath, 'utf8');
    
    // Split the schema into individual CREATE TABLE statements
    const statements = schemaContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && stmt.toUpperCase().includes('CREATE TABLE'));
    
    console.log('Creating tables if they don\'t exist...');
    
    for (const statement of statements) {
      try {
        // Add IF NOT EXISTS to each CREATE TABLE statement
        const modifiedStatement = statement.replace(
          /CREATE TABLE\s+(\w+)/i,
          'CREATE TABLE IF NOT EXISTS $1'
        );
        
        await connection.execute(modifiedStatement);
        
        // Extract table name for logging
        const tableNameMatch = statement.match(/CREATE TABLE\s+(\w+)/i);
        const tableName = tableNameMatch ? tableNameMatch[1] : 'unknown';
        console.log(`✓ Table '${tableName}' ready`);
        
      } catch (error) {
        console.error('Error creating table:', error.message);
      }
    }
    
    console.log('Database schema initialization completed');
    connection.release();
    return true;
    
  } catch (error) {
    console.error('Error initializing database schema:', error);
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
  createTablesIfNotExist
};

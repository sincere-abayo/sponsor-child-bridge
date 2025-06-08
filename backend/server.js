const app = require('./app');
const http = require('http');
const database = require('./config/database');
const socket = require('./utils/socket');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize socket.io
const io = socket.init(server);

// Test database connection and create tables
async function initializeDatabase() {
  try {
    console.log('Testing database connection...');
    const connectionSuccess = await database.testConnection();
    
    if (!connectionSuccess) {
      throw new Error('Database connection failed');
    }
    
    console.log('Creating tables if they don\'t exist...');
    const tablesCreated = await database.createTablesIfNotExist();
    
    if (!tablesCreated) {
      throw new Error('Failed to create database tables');
    }
    
    console.log('Database initialization completed successfully!');
    return true;
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

// Start server
async function startServer() {
  const dbInitialized = await initializeDatabase();
  
  if (dbInitialized) {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Database and server are ready!');
    });
  } else {
    console.error('Server not started due to database initialization failure');
    process.exit(1);
  }
}

startServer();

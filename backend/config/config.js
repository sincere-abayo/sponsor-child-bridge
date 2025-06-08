module.exports = {
  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sponsor_child_bridge',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  
  // Server configuration
  port: process.env.PORT || 5000,
  
  // Client URL for CORS
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  
  // File upload limits
  uploadLimits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['.jpg', '.jpeg', '.png', '.gif']
  }
};

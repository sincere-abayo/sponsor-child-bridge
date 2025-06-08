const { initializeDatabase } = require('../config/database');

async function main() {
  console.log('Starting database initialization...');
  
  const success = await initializeDatabase();
  
  if (success) {
    console.log('Database initialization completed successfully!');
    process.exit(0);
  } else {
    console.error('Database initialization failed!');
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { main };
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

async function createAdminUser() {
  try {
    const email = 'admin@sponsor-child-bridge.com';
    const password = 'Admin123!';
    const firstName = 'System';
    const lastName = 'Administrator';
    const role = 'admin';

    // Check if admin already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ? OR role = ?',
      [email, 'admin']
    );

    if (existingUsers.length > 0) {
      console.log('Admin user already exists!');
      console.log('Email:', existingUsers[0].email);
      return;
    }

    // Hash password using the same method as authController
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert admin user
    const [result] = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, role]
    );

    console.log('✓ Admin user created successfully!');
    console.log('Admin Details:');
    console.log('- Email:', email);
    console.log('- Password:', password);
    console.log('- User ID:', result.insertId);
    console.log('- Role:', role);
    console.log('\n⚠️  Please change the default password after first login!');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
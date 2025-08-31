const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ 
      username: process.env.DEFAULT_ADMIN_USERNAME,
      role: 'admin'
    });
    
    if (!adminExists) {
      // Create default admin
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);
      
      const adminUser = new User({
        username: process.env.DEFAULT_ADMIN_USERNAME,
        password: hashedPassword,
        email: process.env.DEFAULT_ADMIN_EMAIL,
        full_name: process.env.DEFAULT_ADMIN_FULLNAME,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Default admin created successfully');
      console.log(`Username: ${process.env.DEFAULT_ADMIN_USERNAME}`);
      console.log(`Password: ${process.env.DEFAULT_ADMIN_PASSWORD}`);
    } else {
      console.log('Default admin already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
    throw error;
  }
};

module.exports = createDefaultAdmin;
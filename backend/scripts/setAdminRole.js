import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const email = process.argv[2];
const role = process.argv[3] || 'admin';

if (!email) {
  console.log('Usage: node scripts/setAdminRole.js <email> [role]');
  console.log('Example: node scripts/setAdminRole.js admin@example.com admin');
  console.log('Example to demote: node scripts/setAdminRole.js user@example.com user');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      console.error(`User with email "${email}" not found.`);
      process.exit(1);
    }

    user.role = role;
    await user.save();
    console.log(`Successfully updated user "${user.email}" role to "${user.role}".`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating user role:', error.message);
    process.exit(1);
  }
};

run();

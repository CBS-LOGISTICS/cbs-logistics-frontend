import dbConnect from './mongodb';
import { User, UserRole, UserStatus } from '../models/User';

const seedUsers = [
  {
    email: 'superadmin@cbslogistics.com',
    password: 'SuperAdmin123!',
    firstName: 'Super',
    lastName: 'Administrator',
    phone: '+1234567890',
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.APPROVED,
  },
  {
    email: 'admin@cbslogistics.com',
    password: 'Admin123!',
    firstName: 'System',
    lastName: 'Administrator',
    phone: '+1234567891',
    role: UserRole.ADMIN,
    status: UserStatus.APPROVED,
  },
];

export async function seedDatabase() {
  try {
    await dbConnect();
    console.log('🌱 Starting database seeding...');

    for (const userData of seedUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      const user = new User({
        ...userData,
        approvedBy: null, // Self-approved
        approvedAt: new Date(),
      });

      await user.save();
      console.log(`✅ Created ${userData.role}: ${userData.email}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    
    // Log created users
    const createdUsers = await User.find({
      role: { $in: [UserRole.SUPER_ADMIN, UserRole.ADMIN] }
    }).select('email firstName lastName role status');
    
    console.log('\n📋 Created Admin Users:');
    createdUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - ${user.status}`);
    });

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Run seeder if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
} 
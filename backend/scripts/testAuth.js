require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const testAuth = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-hiring-system');
    console.log('✅ Connected to MongoDB');

    // Test user creation
    const testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'job_seeker',
      skills: ['JavaScript', 'React', 'Node.js'],
      experience: 'mid'
    });

    console.log('✅ User created successfully:', testUser.email);

    // Test password comparison
    const isMatch = await testUser.comparePassword('password123');
    console.log('✅ Password comparison:', isMatch);

    // Test profile method
    const profile = testUser.getProfile();
    console.log('✅ Profile method works:', profile.email);

    // Clean up
    await User.deleteOne({ email: 'test@example.com' });
    console.log('✅ Test user cleaned up');

    console.log('\n🎉 All authentication tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
};

testAuth();

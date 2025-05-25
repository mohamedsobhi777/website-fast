#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Setting up WebsiteFast database...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const fs = require('fs');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('📝 Please create .env.local file with your DATABASE_URL');
  console.log('💡 Copy env.example to .env.local and update the DATABASE_URL');
  process.exit(1);
}

try {
  console.log('1. ✅ Found .env.local file');
  
  console.log('2. 📦 Pushing database schema...');
  execSync('npm run db:push', { stdio: 'inherit' });
  
  console.log('\n3. ✅ Database setup complete!');
  console.log('🎉 You can now start the application with: npm run dev');
  
} catch (error) {
  console.error('\n❌ Database setup failed!');
  console.error('💡 Make sure your DATABASE_URL is correct and the database is accessible');
  console.error('🔗 Check the README.md for database setup instructions');
  process.exit(1);
} 
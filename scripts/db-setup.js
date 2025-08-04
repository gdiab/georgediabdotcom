#!/usr/bin/env node

/**
 * Database setup script
 * This script helps with database initialization and health checks
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { exec } = require('child_process');
const path = require('path');

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    log(`\n🔄 ${description}...`, 'blue');
    
    exec(command, { cwd: path.resolve(__dirname, '..') }, (error, stdout, stderr) => {
      if (error) {
        log(`❌ ${description} failed:`, 'red');
        console.error(stderr || error.message);
        reject(error);
      } else {
        log(`✅ ${description} completed successfully`, 'green');
        if (stdout) console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

async function main() {
  const command = process.argv[2];
  
  // Safety check for production environment
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    if (command === 'setup' || command === 'migrate') {
      log('\n⚠️  WARNING: Running in production environment!', 'yellow');
      log('Make sure you really want to run migrations in production.', 'yellow');
      
      // Add a small delay to give user time to cancel
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  try {
    switch (command) {
      case 'generate':
        await runCommand('npm run db:generate', 'Generating database migrations');
        break;
        
      case 'migrate':
        await runCommand('npm run db:migrate', 'Running database migrations');
        break;
        
      case 'studio':
        log('\n🚀 Opening Drizzle Studio...', 'blue');
        await runCommand('npm run db:studio', 'Starting Drizzle Studio');
        break;
        
      case 'setup':
        log('\n🏗️  Setting up database...', 'blue');
        await runCommand('npm run db:generate', 'Generating migrations');
        await runCommand('npm run db:migrate', 'Running migrations');
        log('\n🎉 Database setup completed!', 'green');
        break;
        
      default:
        log('\n📖 Database Setup Script', 'blue');
        log('Usage: node scripts/db-setup.js <command>', 'yellow');
        log('\nAvailable commands:', 'yellow');
        log('  generate  - Generate database migrations');
        log('  migrate   - Run database migrations');
        log('  studio    - Open Drizzle Studio');
        log('  setup     - Complete database setup (generate + migrate)');
        break;
    }
  } catch (error) {
    log(`\n❌ Operation failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
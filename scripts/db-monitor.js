#!/usr/bin/env node

/**
 * Database monitoring and management script
 * Provides real-time database performance monitoring and management tools
 */

const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Add the project root to the module path
const projectRoot = path.resolve(__dirname, '..');
require('module').globalPaths.push(path.join(projectRoot, 'node_modules'));

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatTime(ms) {
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
}

async function displayMetrics() {
  try {
    // Dynamically import the monitoring module
    const { monitoringQueries } = await import('../src/lib/db/monitoring.js');
    
    const metrics = await monitoringQueries.getDatabaseMetrics();
    
    console.clear();
    log('📊 Database Performance Metrics', 'bold');
    log('═'.repeat(50), 'cyan');
    
    // Connection Statistics
    log('\n🔗 Connection Statistics:', 'blue');
    log(`Total Connections: ${metrics.connectionCount}`, 'cyan');
    log(`Active Connections: ${metrics.activeConnections}`, 'green');
    log(`Idle Connections: ${metrics.idleConnections}`, 'yellow');
    
    // Database Size
    log('\n💽 Database Size:', 'blue');
    log(`Total Size: ${metrics.databaseSize}`, 'cyan');
    
    // Table Statistics
    log('\n📋 Table Statistics:', 'blue');
    if (metrics.tableStats.length > 0) {
      console.table(metrics.tableStats.map(table => ({
        Table: table.tableName,
        Rows: table.rowCount.toLocaleString(),
        'Table Size': table.tableSize,
        'Index Size': table.indexSize,
        'Total Size': table.totalSize,
      })));
    } else {
      log('No table statistics available', 'yellow');
    }
    
    // Slow Queries
    log('\n🐌 Slow Queries:', 'blue');
    if (metrics.slowQueries.length > 0) {
      console.table(metrics.slowQueries.map(query => ({
        Query: query.query.substring(0, 50) + '...',
        Calls: query.calls,
        'Avg Time': formatTime(query.meanTime),
        'Max Time': formatTime(query.maxTime),
        'Total Time': formatTime(query.totalTime),
      })));
    } else {
      log('No slow query data available (pg_stat_statements not enabled)', 'yellow');
    }
    
    // Index Usage
    log('\n📊 Index Usage (Top 10):', 'blue');
    if (metrics.indexUsage.length > 0) {
      const topIndexes = metrics.indexUsage.slice(0, 10);
      console.table(topIndexes.map(index => ({
        Table: index.tableName,
        Index: index.indexName,
        'Usage %': `${index.indexUsage}%`,
        Scans: index.indexScans.toLocaleString(),
        'Tuple Reads': index.tupleReads.toLocaleString(),
      })));
    } else {
      log('No index usage statistics available', 'yellow');
    }
    
    log(`\n⏰ Last updated: ${new Date().toLocaleTimeString()}`, 'reset');
    log('Press Ctrl+C to exit', 'yellow');
    
  } catch (error) {
    log(`❌ Failed to fetch metrics: ${error.message}`, 'red');
    console.error(error);
  }
}

async function healthCheck() {
  try {
    const { monitoringQueries } = await import('../src/lib/db/monitoring.js');
    
    log('🏥 Database Health Check', 'bold');
    log('═'.repeat(30), 'cyan');
    
    const health = await monitoringQueries.getDatabaseHealth();
    
    if (health.isHealthy) {
      log('\n✅ Database is healthy!', 'green');
    } else {
      log('\n⚠️ Database health issues detected:', 'yellow');
      
      log('\n🚨 Issues:', 'red');
      health.issues.forEach((issue, index) => {
        log(`  ${index + 1}. ${issue}`, 'red');
      });
      
      log('\n💡 Recommendations:', 'blue');
      health.recommendations.forEach((rec, index) => {
        log(`  ${index + 1}. ${rec}`, 'blue');
      });
    }
    
  } catch (error) {
    log(`❌ Health check failed: ${error.message}`, 'red');
    console.error(error);
  }
}

async function testConnection() {
  try {
    const { testConnection } = await import('../src/lib/db/connection.js');
    
    log('🔌 Testing database connection...', 'blue');
    
    const isConnected = await testConnection();
    
    if (isConnected) {
      log('✅ Database connection successful!', 'green');
    } else {
      log('❌ Database connection failed!', 'red');
    }
    
  } catch (error) {
    log(`❌ Connection test error: ${error.message}`, 'red');
  }
}

async function seedDatabase() {
  try {
    const { seedDatabase } = await import('../src/lib/db/seed.js');
    
    log('🌱 Seeding database with sample data...', 'blue');
    
    const result = await seedDatabase();
    
    log('\n✅ Database seeded successfully!', 'green');
    log(`Created:`, 'cyan');
    log(`  - ${result.users} users`, 'reset');
    log(`  - ${result.categories} categories`, 'reset');
    log(`  - ${result.tags} tags`, 'reset');
    log(`  - ${result.posts} posts`, 'reset');
    log(`  - ${result.postCategories} post-category relationships`, 'reset');
    log(`  - ${result.postTags} post-tag relationships`, 'reset');
    
  } catch (error) {
    log(`❌ Database seeding failed: ${error.message}`, 'red');
    console.error(error);
  }
}

async function clearDatabase() {
  try {
    const { clearDatabase } = await import('../src/lib/db/seed.js');
    
    log('🧹 Clearing all database data...', 'yellow');
    
    await clearDatabase();
    
    log('✅ Database cleared successfully!', 'green');
    
  } catch (error) {
    log(`❌ Database clearing failed: ${error.message}`, 'red');
    console.error(error);
  }
}

async function watchMetrics() {
  log('👀 Starting database monitoring (updates every 30 seconds)...', 'blue');
  log('Press Ctrl+C to stop\n', 'yellow');
  
  // Initial display
  await displayMetrics();
  
  // Update every 30 seconds
  const interval = setInterval(displayMetrics, 30000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    clearInterval(interval);
    log('\n\n👋 Monitoring stopped', 'yellow');
    process.exit(0);
  });
}

async function main() {
  const command = process.argv[2];
  
  // Check for required environment variables
  if (!process.env.DATABASE_URL) {
    log('❌ DATABASE_URL environment variable is required', 'red');
    process.exit(1);
  }
  
  try {
    switch (command) {
      case 'metrics':
        await displayMetrics();
        break;
        
      case 'health':
        await healthCheck();
        break;
        
      case 'test':
        await testConnection();
        break;
        
      case 'seed':
        await seedDatabase();
        break;
        
      case 'clear':
        log('⚠️  This will permanently delete all data!', 'yellow');
        log('Type "yes" to confirm: ', 'red');
        
        const readline = require('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        rl.question('', async (answer) => {
          if (answer.toLowerCase() === 'yes') {
            await clearDatabase();
          } else {
            log('Operation cancelled', 'yellow');
          }
          rl.close();
        });
        break;
        
      case 'watch':
        await watchMetrics();
        break;
        
      default:
        log('\n📊 Database Monitoring & Management Tool', 'blue');
        log('\nUsage: node scripts/db-monitor.js <command>', 'yellow');
        log('\nCommands:', 'yellow');
        log('  metrics     - Show current database metrics');
        log('  health      - Run database health check');
        log('  test        - Test database connection');
        log('  seed        - Seed database with sample data');
        log('  clear       - Clear all database data (destructive!)');
        log('  watch       - Monitor metrics in real-time');
        log('\nExamples:', 'yellow');
        log('  node scripts/db-monitor.js metrics');
        log('  node scripts/db-monitor.js health');
        log('  node scripts/db-monitor.js watch');
        break;
    }
  } catch (error) {
    log(`\n❌ Operation failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  main();
}
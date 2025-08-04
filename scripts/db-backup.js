#!/usr/bin/env node

/**
 * Database backup and restore script
 * Provides utilities for backing up and restoring PostgreSQL databases
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function parseConnectionString(connectionString) {
  const url = new URL(connectionString);
  return {
    host: url.hostname,
    port: url.port || 5432,
    database: url.pathname.slice(1),
    username: url.username,
    password: url.password,
  };
}

function getBackupDirectory() {
  const backupDir = path.resolve(__dirname, '..', 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  return backupDir;
}

function generateBackupFilename(prefix = 'backup') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${prefix}-${timestamp}.sql`;
}

async function createBackup(connectionString, options = {}) {
  const { 
    filename = generateBackupFilename('ai-blog-backup'),
    compress = true,
    dataOnly = false,
    schemaOnly = false,
  } = options;

  const dbConfig = parseConnectionString(connectionString);
  const backupDir = getBackupDirectory();
  const backupPath = path.join(backupDir, filename);

  log(`\n📦 Creating database backup...`, 'blue');
  log(`Host: ${dbConfig.host}:${dbConfig.port}`, 'cyan');
  log(`Database: ${dbConfig.database}`, 'cyan');
  log(`Output: ${backupPath}`, 'cyan');

  const pgDumpArgs = [
    '--host', dbConfig.host,
    '--port', dbConfig.port,
    '--username', dbConfig.username,
    '--dbname', dbConfig.database,
    '--no-password',
    '--verbose',
    '--file', backupPath,
  ];

  if (dataOnly) {
    pgDumpArgs.push('--data-only');
  } else if (schemaOnly) {
    pgDumpArgs.push('--schema-only');
  }

  if (compress) {
    pgDumpArgs.push('--format', 'custom', '--compress', '9');
    // Change extension for compressed format
    const compressedPath = backupPath.replace('.sql', '.dump');
    pgDumpArgs[pgDumpArgs.indexOf(backupPath)] = compressedPath;
  }

  return new Promise((resolve, reject) => {
    const pgDump = spawn('pg_dump', pgDumpArgs, {
      env: {
        ...process.env,
        PGPASSWORD: dbConfig.password,
      },
    });

    let stderr = '';

    pgDump.stderr.on('data', (data) => {
      stderr += data.toString();
      // pg_dump writes progress to stderr, so we show it
      if (data.toString().includes('dumping')) {
        process.stdout.write('.');
      }
    });

    pgDump.on('close', (code) => {
      console.log(); // New line after progress dots
      
      if (code === 0) {
        const finalPath = compress ? backupPath.replace('.sql', '.dump') : backupPath;
        const stats = fs.statSync(finalPath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        log(`✅ Backup created successfully!`, 'green');
        log(`File: ${finalPath}`, 'green');
        log(`Size: ${sizeInMB} MB`, 'green');
        
        resolve({
          success: true,
          filePath: finalPath,
          size: stats.size,
        });
      } else {
        log(`❌ Backup failed with exit code ${code}`, 'red');
        log(`Error: ${stderr}`, 'red');
        reject(new Error(`pg_dump failed with exit code ${code}`));
      }
    });

    pgDump.on('error', (error) => {
      log(`❌ Backup failed: ${error.message}`, 'red');
      reject(error);
    });
  });
}

async function restoreBackup(connectionString, backupFilePath, options = {}) {
  const {
    clean = false,
    dataOnly = false,
    schemaOnly = false,
  } = options;

  if (!fs.existsSync(backupFilePath)) {
    throw new Error(`Backup file not found: ${backupFilePath}`);
  }

  const dbConfig = parseConnectionString(connectionString);
  const isCompressed = path.extname(backupFilePath) === '.dump';

  log(`\n🔄 Restoring database backup...`, 'blue');
  log(`Host: ${dbConfig.host}:${dbConfig.port}`, 'cyan');
  log(`Database: ${dbConfig.database}`, 'cyan');
  log(`Backup: ${backupFilePath}`, 'cyan');

  const restoreArgs = [
    '--host', dbConfig.host,
    '--port', dbConfig.port,
    '--username', dbConfig.username,
    '--dbname', dbConfig.database,
    '--no-password',
    '--verbose',
  ];

  if (clean) {
    restoreArgs.push('--clean');
  }

  if (dataOnly) {
    restoreArgs.push('--data-only');
  } else if (schemaOnly) {
    restoreArgs.push('--schema-only');
  }

  if (isCompressed) {
    restoreArgs.push('--format', 'custom');
  }

  restoreArgs.push(backupFilePath);

  const command = isCompressed ? 'pg_restore' : 'psql';
  const args = isCompressed ? restoreArgs : [
    ...restoreArgs.slice(0, -1), // Remove file path for psql
    '--file', backupFilePath,
  ];

  return new Promise((resolve, reject) => {
    const restore = spawn(command, args, {
      env: {
        ...process.env,
        PGPASSWORD: dbConfig.password,
      },
    });

    let stderr = '';
    let stdout = '';

    restore.stdout.on('data', (data) => {
      stdout += data.toString();
      process.stdout.write('.');
    });

    restore.stderr.on('data', (data) => {
      stderr += data.toString();
      // Show progress
      if (data.toString().includes('processing')) {
        process.stdout.write('.');
      }
    });

    restore.on('close', (code) => {
      console.log(); // New line after progress dots
      
      if (code === 0) {
        log(`✅ Database restored successfully!`, 'green');
        resolve({
          success: true,
          output: stdout,
        });
      } else {
        log(`❌ Restore failed with exit code ${code}`, 'red');
        log(`Error: ${stderr}`, 'red');
        reject(new Error(`${command} failed with exit code ${code}`));
      }
    });

    restore.on('error', (error) => {
      log(`❌ Restore failed: ${error.message}`, 'red');
      reject(error);
    });
  });
}

async function listBackups() {
  const backupDir = getBackupDirectory();
  const files = fs.readdirSync(backupDir)
    .filter(file => file.endsWith('.sql') || file.endsWith('.dump'))
    .map(file => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        path: filePath,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
      };
    })
    .sort((a, b) => b.created - a.created);

  return files;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function main() {
  const command = process.argv[2];
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    log('❌ DATABASE_URL environment variable is required', 'red');
    process.exit(1);
  }

  try {
    switch (command) {
      case 'backup':
        const backupOptions = {
          compress: !process.argv.includes('--no-compress'),
          dataOnly: process.argv.includes('--data-only'),
          schemaOnly: process.argv.includes('--schema-only'),
        };
        
        if (process.argv.includes('--filename')) {
          const filenameIndex = process.argv.indexOf('--filename');
          backupOptions.filename = process.argv[filenameIndex + 1];
        }

        await createBackup(connectionString, backupOptions);
        break;

      case 'restore':
        const backupFile = process.argv[3];
        if (!backupFile) {
          log('❌ Backup file path is required for restore', 'red');
          log('Usage: node scripts/db-backup.js restore <backup-file-path>', 'yellow');
          process.exit(1);
        }

        const restoreOptions = {
          clean: process.argv.includes('--clean'),
          dataOnly: process.argv.includes('--data-only'),
          schemaOnly: process.argv.includes('--schema-only'),
        };

        await restoreBackup(connectionString, backupFile, restoreOptions);
        break;

      case 'list':
        const backups = await listBackups();
        
        if (backups.length === 0) {
          log('📭 No backups found', 'yellow');
        } else {
          log(`\n📋 Available backups (${backups.length}):`, 'blue');
          console.log();
          
          backups.forEach((backup, index) => {
            log(`${index + 1}. ${backup.name}`, 'cyan');
            log(`   Size: ${formatBytes(backup.size)}`, 'reset');
            log(`   Created: ${backup.created.toLocaleString()}`, 'reset');
            log(`   Path: ${backup.path}`, 'reset');
            console.log();
          });
        }
        break;

      case 'cleanup':
        const daysToKeep = parseInt(process.argv[3]) || 30;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        const allBackups = await listBackups();
        const oldBackups = allBackups.filter(backup => backup.created < cutoffDate);
        
        if (oldBackups.length === 0) {
          log(`📭 No backups older than ${daysToKeep} days found`, 'yellow');
        } else {
          log(`\n🧹 Cleaning up ${oldBackups.length} backups older than ${daysToKeep} days...`, 'blue');
          
          for (const backup of oldBackups) {
            try {
              fs.unlinkSync(backup.path);
              log(`✅ Deleted: ${backup.name}`, 'green');
            } catch (error) {
              log(`❌ Failed to delete ${backup.name}: ${error.message}`, 'red');
            }
          }
          
          log(`\n🎉 Cleanup completed!`, 'green');
        }
        break;

      default:
        log('\n📖 Database Backup & Restore Tool', 'blue');
        log('\nUsage: node scripts/db-backup.js <command> [options]', 'yellow');
        log('\nCommands:', 'yellow');
        log('  backup              - Create a database backup');
        log('  restore <file>      - Restore from a backup file');
        log('  list                - List available backups');
        log('  cleanup [days]      - Delete backups older than N days (default: 30)');
        log('\nBackup Options:', 'yellow'); 
        log('  --filename <name>   - Custom backup filename');
        log('  --no-compress       - Create uncompressed backup');
        log('  --data-only         - Backup data only (no schema)');
        log('  --schema-only       - Backup schema only (no data)');
        log('\nRestore Options:', 'yellow');
        log('  --clean             - Drop existing objects before restore');
        log('  --data-only         - Restore data only');
        log('  --schema-only       - Restore schema only');
        log('\nExamples:', 'yellow');
        log('  node scripts/db-backup.js backup');
        log('  node scripts/db-backup.js backup --filename my-backup.sql');
        log('  node scripts/db-backup.js restore backups/backup-2025-01-31.dump');
        log('  node scripts/db-backup.js list');
        log('  node scripts/db-backup.js cleanup 7');
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

module.exports = {
  createBackup,
  restoreBackup,
  listBackups,
};
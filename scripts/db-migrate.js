#!/usr/bin/env node

/**
 * Database Migration Script
 * 
 * This script automates Prisma migrations and initial setup.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Print a styled message to console
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Execute a command and return its output
 */
function execute(command) {
  try {
    log(`Executing: ${command}`, colors.blue);
    const output = execSync(command, { encoding: 'utf8' });
    return output;
  } catch (error) {
    log(`Error executing: ${command}`, colors.red);
    log(error.message, colors.red);
    throw error;
  }
}

/**
 * Main function to run migrations
 */
async function runMigrations() {
  try {
    // Check if Docker is running
    log('Checking if Docker is running...', colors.yellow);
    try {
      execute('docker ps');
      log('Docker is running', colors.green);
    } catch (error) {
      log('Docker is not running. Please start Docker and try again.', colors.red);
      process.exit(1);
    }

    // Check if database container is running
    log('Checking if database container is running...', colors.yellow);
    const containersOutput = execute('docker ps');
    if (!containersOutput.includes('drammen_booking_db')) {
      log('Database container is not running. Starting database with Docker Compose...', colors.yellow);
      execute('docker-compose up -d');
      log('Waiting for database to be ready...', colors.yellow);
      // Wait a bit for the database to be ready
      await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
      log('Database container is already running', colors.green);
    }

    // Generate Prisma client
    log('Generating Prisma client...', colors.yellow);
    execute('npx prisma generate');
    log('Prisma client generated', colors.green);

    // Create migration
    const migrationName = process.argv[2] || 'initial-migration';
    log(`Creating migration: ${migrationName}...`, colors.yellow);
    
    try {
      execute(`npx prisma migrate dev --name=${migrationName}`);
    } catch (error) {
      log('Failed to create migration automatically. You might need to handle this manually.', colors.red);
      log('Trying to push schema directly...', colors.yellow);
      execute('npx prisma db push');
    }
    
    log('Database migration complete!', colors.green);
  } catch (error) {
    log('Migration failed', colors.red);
    process.exit(1);
  }
}

// Run the migration
runMigrations().catch(error => {
  log('Unhandled error during migration', colors.red);
  log(error, colors.red);
  process.exit(1);
});

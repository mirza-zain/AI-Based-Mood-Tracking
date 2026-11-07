#!/usr/bin/env node

/**
 * Neon Database Schema Synchronizer
 * Automatically detects any Neon or Vercel Postgres environment variable,
 * normalizes SSL/pooler settings, and pushes the Prisma schema to the database.
 */

const { execSync } = require('child_process');

function normalizeDatabaseUrl(url) {
  if (!url) return undefined;
  let u = url.trim();

  // Strip surrounding quotes if present in environment variable
  if ((u.startsWith('"') && u.endsWith('"')) || (u.startsWith("'") && u.endsWith("'"))) {
    u = u.slice(1, -1).trim();
  }

  // Ensure postgresql:// scheme
  if (u.startsWith('postgres://')) {
    u = u.replace(/^postgres:\/\//, 'postgresql://');
  }

  // Neon pooled connection handling
  if (u.includes('-pooler')) {
    if (!u.includes('sslmode=')) {
      u += u.includes('?') ? '&sslmode=require' : '?sslmode=require';
    }
    if (!u.includes('pgbouncer=')) {
      u += u.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true';
    }
  } else if (!u.includes('sslmode=')) {
    u += u.includes('?') ? '&sslmode=require' : '?sslmode=require';
  }

  return u;
}

const rawUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.NEON_URL ||
  process.env.NEON_KEY ||
  process.env.DATABASE_POSTGRES_URL;

const dbUrl = normalizeDatabaseUrl(rawUrl);

if (dbUrl) {
  process.env.DATABASE_URL = dbUrl;
  console.log('🔄 Neon database connection string detected.');
  console.log('🔄 Pushing Prisma schema to Neon database...');
  try {
    execSync('npx prisma db push --accept-data-loss', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
    console.log('✅ Neon database schema successfully synced!');
  } catch (err) {
    console.warn(
      '⚠️ Warning: prisma db push failed during build (tables will be verified/created at runtime):',
      err.message
    );
  }
} else {
  console.log(
    'ℹ️ No database connection string detected at build time. Runtime will connect dynamically.'
  );
}


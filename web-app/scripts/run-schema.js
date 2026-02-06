/**
 * Run the Supabase schema SQL
 * Usage: node scripts/run-schema.js
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSchema() {
  // Session Pooler connection (IPv4 compatible)
  const connectionString = 'postgresql://postgres.fofpgrfluuhoqwygdwhi:tettem-fuvvy7-tazWon@aws-1-ap-south-1.pooler.supabase.com:5432/postgres';

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Supabase PostgreSQL via Session Pooler...');
    await client.connect();
    console.log('Connected!');

    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running schema SQL...');
    await client.query(schemaSql);
    console.log('Schema created successfully!');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSchema();

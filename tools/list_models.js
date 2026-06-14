#!/usr/bin/env node
// Simple helper to call ModelService.ListModels using Application Default Credentials
// Reads GOOGLE_APPLICATION_CREDENTIALS or accepts a path as the first arg.
const fs = require('fs');
const path = require('path');
const { GoogleAuth } = require('google-auth-library');

async function main() {
  const credPath = process.argv[2] || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath) {
    console.error('Provide a service-account JSON path as arg or set GOOGLE_APPLICATION_CREDENTIALS');
    process.exit(2);
  }
  if (!fs.existsSync(credPath)) {
    console.error('Service account JSON not found at', credPath);
    process.exit(2);
  }

  const auth = new GoogleAuth({ keyFilename: credPath, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token = tokenResponse && tokenResponse.token ? tokenResponse.token : tokenResponse;

  const fetch = globalThis.fetch || (await import('node-fetch')).default;
  const url = 'https://generativelanguage.googleapis.com/v1/models';
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const json = await resp.json();
  console.log(JSON.stringify(json, null, 2));
}

main().catch((err) => {
  console.error('Failed to list models:', err);
  process.exit(1);
});

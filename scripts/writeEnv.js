const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envFilePath = path.join(__dirname, '..', 'env', '.env.dev');
const envOutputPath = path.join(__dirname, '..', 'env','.env.local');

// Load environment variables from .env.dev
const envConfig = dotenv.parse(fs.readFileSync(envFilePath));

// Select specific variables to write
const selectedVars = {
  LNBITS_NODE_URL: envConfig.LNBITS_NODE_URL,
  LNBITS_USERNAME: envConfig.LNBITS_USERNAME,
  LNBITS_PASSWORD: envConfig.LNBITS_PASSWORD,
  LNBITS_ADMINKEY: envConfig.LNBITS_ADMINKEY,
};

// Append selected variables to the appropriate environment files
const appendEnvFile = (filePath, vars) => {
  const envFileContent = '\n' + Object.entries(vars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n') + '\n';

  fs.appendFileSync(filePath, envFileContent, 'utf8');
  console.log(`${filePath} appended successfully.`);
};

// Append to .env.local
appendEnvFile(envOutputPath, {
  LNBITS_NODE_URL: selectedVars.LNBITS_NODE_URL,
  LNBITS_USERNAME: selectedVars.LNBITS_USERNAME,
  LNBITS_PASSWORD: selectedVars.LNBITS_PASSWORD,
  LNBITS_ADMINKEY: selectedVars.LNBITS_ADMINKEY,
});
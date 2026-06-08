const path = require('path');
const { loadEnv } = require('./pm2-env.cjs');

const appDir = "/var/www/nuwaira-web";

const { ORIGIN: _ignoredOrigin, ...envVars } = loadEnv(path.join(appDir, '.env'));

module.exports = {
  apps: [
    {
      name: 'nuwaira-web',
      script: 'build/index.js',
      cwd: appDir,
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        ...envVars,
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: 4173,
        BODY_SIZE_LIMIT: '4194304'
      }
    }
  ]
};

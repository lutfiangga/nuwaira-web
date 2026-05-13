module.exports = {
  apps: [
    {
      name: 'nuwaira-web',
      script: 'bun',
      args: 'run preview -- --host 0.0.0.0 --port 4173 --strictPort',
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      }
    }
  ]
};

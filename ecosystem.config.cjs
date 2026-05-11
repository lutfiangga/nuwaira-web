module.exports = {
  apps: [
    {
      name: 'nuwaira-web',
      script: 'bun',
      args: 'run preview',
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3030
      }
    }
  ]
};
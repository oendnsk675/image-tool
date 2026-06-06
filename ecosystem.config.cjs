module.exports = {
  apps: [
    {
      name: 'image-tool',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
      },
    },
  ],
}

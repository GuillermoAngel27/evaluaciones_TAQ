module.exports = {
  apps: [{
    name: 'api-backend',
    script: 'start_backend.js',
    cwd: '/home/taqrocom/public_html/subdominios/api',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/taqrocom/.pm2/logs/api-backend-error.log',
    out_file: '/home/taqrocom/.pm2/logs/api-backend-out.log',
    log_file: '/home/taqrocom/.pm2/logs/api-backend-combined.log',
    time: true
  }]
};
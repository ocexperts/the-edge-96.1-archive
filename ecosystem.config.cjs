// pm2 config — used by setup.sh
module.exports = {
  apps: [
    {
      name: "cada",
      script: "node_modules/vite/bin/vite.js",
      args: "preview --host 0.0.0.0 --port 3000 --strictPort",
      env: {
        NODE_ENV: "production",
        HOST: process.env.HOST || "0.0.0.0",
        PORT: process.env.PORT || 3000,
      },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "512M",
    },
  ],
};

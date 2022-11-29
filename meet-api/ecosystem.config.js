module.exports = {
    apps : [{
      name: "meat-api",
      script: "./dist/main.js",
      instances: 0,
      exec_mode: "cluster",
      //watch: true,
      merge_logs: true,
      env: {
          SERVER_PORT: 5000,
          SERVER_PORT_TESTE: 5001,
          DB_URL: 'mongodb://localhost/meat-api',
          DB_URL_TESTE: 'mongodb://localhost/meat-api-test-db',
          NODE_ENV: "production"
      }
    }]
}
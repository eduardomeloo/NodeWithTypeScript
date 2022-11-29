export const environment = {
    server : { port: process.env.SERVER_PORT || 3000 },
    db: { 
            url: process.env.DB_URL || 'localhost:27017/meat-api',
            DB_URL_TESTE: 'mongodb://localhost/meat-api-test-db',
        },
    security: { 
        saltRounds: process.env.SALT_ROUNDS || 10,
        apiSecret: process.env.API_SECRET || 'meat-api-secret',
        enableHTTPS: process.env.ENABLE_HTTPS || false,
        certificate: process.env.CERT_FILE || '../security/keys/cert.pem',
        key: process.env.CERT_KEY_FILE || '../security/keys/key.pem',
    },
    log: {
        level: process.env.LOG_LEVEL || 'debug',
        name: 'meat-api-logger'
    }
}
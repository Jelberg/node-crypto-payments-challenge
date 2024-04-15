export const env_postgress = {
    port: parseInt(process.env.POSTGRESS_PORT) || 5432,
    host: process.env.POSTGRESS_HOST || 'postgres-db',
    password: process.env.POSTGRESS_PASSWORDS || '1234',
    username: process.env.POSTGRESS_USERNAME || 'postgres',
    database: process.env.POSTGRESS_DATABASE || 'cryptopayments',
}

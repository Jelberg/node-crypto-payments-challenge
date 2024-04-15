import 'dotenv/config'

export const env_postgress = {
    port: parseInt(process.env.POSTGRES_PORT),
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD || '1234',
    username: process.env.POSTGRES_USERNAME,
    database: process.env.POSTGRES_DATABASE,
}

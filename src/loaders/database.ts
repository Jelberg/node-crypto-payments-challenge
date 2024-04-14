import 'reflect-metadata'
import { DataSource } from 'typeorm'
import pc from 'picocolors'
import { env_postgress } from '../config'

const AppDataSource = new DataSource({
    type: 'postgres',
    host: env_postgress.host,
    port: env_postgress.port,
    username: env_postgress.username,
    password: env_postgress.password,
    database: env_postgress.database,
    //entities: [Photo],
    synchronize: true,
    logging: false,
})

export const inicializeDB = async () => {
    await AppDataSource.initialize()
        .then(() => {
            console.log(pc.green('✌️ DB loaded and connected!'))
        })
        .catch((error) => console.log(pc.red(error)))
}

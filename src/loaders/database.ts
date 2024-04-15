import 'reflect-metadata'
import { DataSource } from 'typeorm'
import pc from 'picocolors'
import { entities, File, Transaction, Users } from '../entity'
import { env_postgress } from '../config'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: env_postgress.host,
    port: env_postgress.port,
    username: env_postgress.username,
    password: env_postgress.password,
    database: env_postgress.database,
    entities: [...entities],
    synchronize: true,
    logging: false,
})

export const inicializeDB = async () => {
    await AppDataSource.initialize()
        .then(() => {
            console.log(pc.green('✌️ Postgres - loaded and connected!'))
        })
        .catch((error) => console.log(pc.red(error)))
}

const getRepository = (entity: { new () }) => {
    return AppDataSource.getRepository(entity)
}

const filesRepository = getRepository(File)
const transactionsRepository = getRepository(Transaction)
const usersRepository = getRepository(Users)

export const repository = {
    filesRepository,
    transactionsRepository,
    usersRepository,
}

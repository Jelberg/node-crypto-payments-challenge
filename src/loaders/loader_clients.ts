import fs from 'fs'
import pc from 'picocolors'
import { Users } from '../entity'
import { AppDataSource } from './database'
import { environments } from '../config'

const filePath = environments.path_users

export const loadClients = async () => {
    try {
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'))

        jsonData.forEach(async (user) => {
            const users = new Users()
            Object.assign(users, user)
            const transactionsRepository = AppDataSource.getRepository(Users)
            await transactionsRepository
                .findOneBy({ address: users.address })
                .then(async (user) => {
                    if (!user) {
                        await transactionsRepository.save(users)
                    }
                })
        })
        console.log(pc.green('🦾 Usuarios almacenados en Postgres'))
    } catch (error) {
        console.error('Error:', error)
    }
}

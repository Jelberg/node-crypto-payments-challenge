import 'dotenv/config'

export const environments = {
    path_users: 'src/data/clients.json',
    path_deposits: process.env.PATH_TRANSACTIONS,
}

import expressLoader from './express'
import pc from 'picocolors'
import express from 'express'
import { inicializeDB } from './database'
import { loadTransaction } from './loader_transactions'
import { loadClients } from './loader_clients'

export const app = express()
//Adds Express Static Middleware
app.use(express.static('public'))

export default async () => {
    app.listen(8010, () => {
        try {
            console.log(
                pc.white(`
        ################################################
        🛡️  Server listening on port: 8081 🛡️ 
        ################################################
      `)
            )
        } catch (err) {
            pc.red(err)
            process.exit(1)
        }
    })

    await inicializeDB()
    await loadTransaction()
    await loadClients()

    /**
     * Laods express essentials
     */
    //await expressLoader({ app })
    //console.log(pc.white('Express Loader has initalized successfully! ✅'))
}

import expressLoader from './express'
import pc from 'picocolors'
import express from 'express'
import { inicializeDB } from './database'

export const app = express()
//Adds Express Static Middleware
app.use(express.static('public'))

export default async () => {
    /**
     * Port loader
     */
    app.listen(8010, () => {
        try {
            /**
             * Consul Register
             */

            //consul.register;
            console.log(
                pc.green(`
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

    /**
     * Laods express essentials
     */
    await expressLoader({ app })
    console.log(pc.white('Express Loader has initalized successfully! ✅'))
}

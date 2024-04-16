import pc from 'picocolors'
import express from 'express'
import { inicializeDB } from './database'

export const app = express()
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
}

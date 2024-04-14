// API routes
//import routes from '../bootstrap/Post.express.routes'
import cors from 'cors'
import bodyParser from 'body-parser'
import pc from 'picocolors'

export default async ({ app }) => {
    /**
     * Once the petition is received it
     * will be parsed into a Json object.
     */
    app.use(bodyParser.json())

    // The magic package that prevents frontend developers going nuts
    // Alternate description:
    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(
        cors({
            origin: '*',
        })
    )

    /**
     * SERVERS
     */
    //app.use(routes)
    console.log(pc.white('Express Loader has initalized successfully! ✅'))
}

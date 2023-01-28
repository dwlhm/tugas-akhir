import 
    express, 
    { Express, Request, Response } 
    from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 5123

app.get('/', (_, res: Response) => {
    res.status(200).json({
        code: 200,
        body: {
            msg: 'success',
        },
    })
})

app.listen(port, () => {
    console.info(`[server]: started at localhost:${port}`)
})

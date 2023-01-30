import 
    express, 
    { Express, Request, Response } 
    from 'express'
import dotenv from 'dotenv'

import User from './user'
import Sq_Start from 'database'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 5123

Sq_Start()

app.use('/user', User)
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

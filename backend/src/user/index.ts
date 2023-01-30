import { Router, Response, Request } from "express";

const router: Router = Router()

router.get('/', (_,res: Response) => {
    return res.status(200)
        .json({
            code: 200,
            body: {
                msg: 'hello'
            }
        })
})

router.post('/login', (req: Request, res: Response) => {
    
    let authorization = req.headers.authorization
    let [method,str] = authorization.split(" ")

    if (method === 'Basic') authorization = str
    else return res.status(401).json({
        code: 401,
        message: 'prohibited!'
    })

    const extract_str = Buffer.from(authorization, 'base64')
    let [username, password] = extract_str.toString().split(":")

    if (username === process.env.ROOT_USERNAME &&
            password === process.env.ROOT_PASSWORD) {
        
        return res.status(200)
            .json({
                code: 200,
                body: {
                    authorization,
                    username,
                    password
                }
            })
    
    } else {
        return res.status(401)
            .json({
                code: 401,
                message: 'wrong username/password'
            })
    }

})

export default router

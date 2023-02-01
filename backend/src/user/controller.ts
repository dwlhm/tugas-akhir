import { User } from "database/models/user";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { readFileSync } from "fs";
import { sign } from 'jsonwebtoken'
import path from "path";

const register = async (req: Request, res: Response) => {

    try {
        let password = bcrypt.hashSync(req.body.password, 10)
        const user = await User.create({...req.body, password: password})
        return res.status(200).json({
            code: 200,
            body: {
                ...user.dataValues,
                id: undefined,
                updatedAt: undefined,
                password: undefined
            }
        })
   } catch (error) {
        console.log(error.toString())

        let errors: string[] = [] 
        if (error.message.lastIndexOf('notNull Violation') > -1) {
            errors = error.message.replace(/notNull Violation: User./gi, 'Field ').split(',\n')
        }
        if (error.toString().lastIndexOf('SequelizeUniqueConstraintError') > -1) {
            errors.push('duplicate email acount')
        }
        
        return res.status(400)
            .json({
                code: 400,
                error: errors
            })
    }
    
}

const login = async (req: Request, res: Response) => {
    
    try {
        let authorization = req.headers.authorization
        let [method,str] = authorization.split(" ")

        if (method === 'Basic') authorization = str
        else throw new Error('401')

        const extract_str = Buffer.from(authorization, 'base64')
        let [username, password] = extract_str.toString().split(":")

        let user = await User.findOne({ where: {
            email: username
        }})

        if (user == null) throw new Error('404')

        const compare_password = bcrypt.compareSync(password, user.dataValues.password)

        if (!compare_password) throw new Error('404#1')

        const private_key = readFileSync(path.join(__dirname, '../../secret/private.pem'), 'utf8')

        const payload = {
                ...user.dataValues,
                id: undefined,
                createdAt: undefined,
                password: undefined,
            }

        const options = {
            issuer: 'dwlhm',
            subject: 'report@dwlhm.space',
            audience: 'localhost',
            expiresIn: '1h',
            algorithm: 'RS256'
        }

        let token = sign(payload , private_key, options)

        return res.status(202).json({
            code: 202,
            body: {
                ...payload,
                authentication_token: token
            }
        })

    } catch(error) {
        console.log('[login]', error)

        let errors: string[] = []
        
        if (error.message === '401') errors.push('authorization token not found')
        
        if (error.message === '404') errors.push('email not registered')
        if (error.message === '404#1') errors.push('wrong password')
        return res.status(400)
            .json({
                code: 400,
                error: errors
            })
    }
}

export { register, login }

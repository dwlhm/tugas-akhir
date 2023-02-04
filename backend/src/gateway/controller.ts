import { Gateway } from 'database/models/gateway'
import {
    Request,
    Response,
    NextFunction
} from 'express'

const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const gateway = await Gateway.create(req.body)

        return res.status(201).json({
            code: 201,
            body: {
                ...gateway.dataValues,
                updatedAt: undefined
            }
        })
    } catch(err) {
        console.log('[Gateway Register] ',err.message)
        let errors: string[] = [] 
        if (err.message.lastIndexOf('notNull Violation') > -1) {
            errors = err.message
                .replace(/notNull Violation: Gateway./gi, 'Field ')
                .split(',\n')
            return res.status(400)
                .json({
                    code: 400,
                    error: errors
                })

        }
        next(err)
    }
}

export {
    register
}

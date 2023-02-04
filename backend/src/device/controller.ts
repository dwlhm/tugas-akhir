import { Device } from 'database/models/device'
import {
    Request, Response, NextFunction
} from 'express'

const register = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const device = await Device.create({
            ...req.body,
            maintainer: req.user.id
        }) 
        
        return res.status(200).json({
            code: 200,
            body: {
                ...device.dataValues,
                id: undefined,
                updatedAt: undefined
            }
        })
    } catch(error) {
        console.error('[device_register] ', error)

        let errors: string[] = [] 
        if (error.message.lastIndexOf('notNull Violation') > -1) {
            errors = error.message
                .replace(/notNull Violation: Device./gi, 'Field ')
                .split(',\n')
            return res.status(400)
                .json({
                    code: 400,
                    error: errors
                })

        }

        next(error)
    }
}

export {
    register
}

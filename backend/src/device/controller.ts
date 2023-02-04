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

const profil = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    
    try {
       const device_id: number = req.params['id'] as unknown as number

       const device = await Device.findByPk(device_id)

       if (!device) throw new Error('404#device')

       return res.status(200).json({
           code: 200,
           body: device
       })
    } catch(err) {
        console.log('[Device Profil] ', err.message)

        next(err)
    }
}

const destroy = async (
    req: Request, 
    res: Response,
    next: NextFunction
) => {
    
    try {
        const device_id = req.params['id']

        const destroying = await Device.destroy({
            where: {
                id: device_id
            }
        })

        if (!destroying) throw new Error('404#device')

        return res.status(200).json({
            code: 200,
            body: {
                status: 'success'
            }
        })
    } catch(err) {
        console.log('[Device Delete] ',err.message)

        next(err)
    }
}


export {
    register,
    profil,
    destroy
}

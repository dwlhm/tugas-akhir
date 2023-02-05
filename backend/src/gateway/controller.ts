import { Gateway } from 'database/models/gateway'
import { Gateway_Mqtt } from 'database/models/gateway-mqtt'
import {
    Request,
    Response,
    NextFunction
} from 'express'
import crypto from 'node:crypto'

const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const client_id: string = crypto.randomBytes(4).toString('hex')
        const client_username: string = crypto.randomBytes(4).toString('hex')
        const client_password: string = crypto.randomBytes(8).toString('hex')

        const gateway = await Gateway.create({
            ...req.body,
            id: client_id,
        })

        await Gateway_Mqtt.create({
            credential: Buffer.from(`${client_username}:${client_password}`).toString('base64'),
            topic_data: `node/${client_id}/prod/data`,
            topic_action: `node/${client_id}/prod/action`,
            gateway_id: client_id
        })

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

const profil = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {
        const gateway_id: string = req.params['id']
        const gateway = await Gateway.findByPk(gateway_id)

        if (!gateway) throw new Error('404#gateway')

        return res.status(200).json({
            code: 200,
            body: gateway
        })
    } catch(err) {
        console.error('[Gateway Profil] ',err.message)

        next(err)
    }
}
export {
    register,
    profil
}

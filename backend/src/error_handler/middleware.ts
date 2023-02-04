import {
    Request,
    Response,
    NextFunction
} from 'express'
import {
    label as Error_Label
} from './label'

const middleware = async (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    console.log(err)
    const error = Error_Label[err.message] 
        ? Error_Label[err.message]
        : {
            code: 500,
            error: ['unidentified error']
          }

    return res.status(error.code)
    .json(error)
}

export { middleware } 

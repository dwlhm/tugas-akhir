export class Custom_Error extends Error {
    errorCode = 4

    constructor(message: string) {
        super(message)

        Object.setPrototypeOf(this, Custom_Error.prototype)
    }

}

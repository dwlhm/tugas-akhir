const label = {
    '400#email': {
        code: 404,
        error: ['email not found']
    },
    '400#password': {
        code: 400,
        error: ['password not match']
    },
    '409#login': {
        code: 409,
        error: ['has been login before']
    },
    '401#notbasic': {
        code: 401,
        error: ['wrong authentication method']
    }
}

export { label }

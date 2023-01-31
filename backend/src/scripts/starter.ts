import database from 'database'
import { User } from 'database/models/user'
import bcrypt from 'bcrypt'

database()
.then(() => {
    let password = bcrypt.hashSync('password', 10)
    User.create({
        id: 1,
        name: 'admin',
        email: 'admin@dwlhm.space',
        password: password,
        isAdmin: true
    })
    .catch(err => console.error(err.message))
    .finally(() => console.info('[User] superuser created!'))
    
})

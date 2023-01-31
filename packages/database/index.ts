import sq_connection from "./config"

async function Sq_Start() : Promise<void> {
    try {
       await sq_connection.authenticate()
            .then(() => {
                console.info('[sequelize] authenticate!')
            })
            .finally(() => {
                console.info('[sequelize] authenticated!')
            })
        await sq_connection.sync({ force: true })
            .then(() => {
                console.info('[sequelize] sync!')
            })
            .finally(() => {
                console.info('[sequelize] sync completed!')
            })
    } catch(err) {
        console.error(err)
    }
}

export default Sq_Start

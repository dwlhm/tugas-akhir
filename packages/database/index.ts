import sq_connection from "./config";

async function Sq_Start(force: boolean = false): Promise<void> {
    await sq_connection
      .authenticate()
      .then(() => {
        console.info("[sequelize] authenticate!");
      })
      .finally(() => {
        console.info("[sequelize] authenticated!");
      });
    /*await sq_connection
      .sync({ force: force })
      .then(() => {
        console.info("[sequelize] sync!");
      })
      .finally(() => {
        console.info("[sequelize] sync completed!");
      });*/
}

export default Sq_Start;

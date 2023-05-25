import Sq_Start from "database";
import dotenv from "dotenv";
import { update_list } from "./updateList";
import { HistoryListScheduler } from "./HistoryListScheduler";

dotenv.config();

(
    async () => {

        await Sq_Start();

        await update_list();

        const historyListScheduler = new HistoryListScheduler();
        historyListScheduler.taskInitializer();

    }
)()

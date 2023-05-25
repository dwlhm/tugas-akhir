import Sq_Start from "database";
import { Csv_List } from "database/models/Csv_List";
import { Device } from "database/models/device";
import dotenv from "dotenv";
import fs from "fs";
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

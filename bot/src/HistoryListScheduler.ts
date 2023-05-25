import { IScheduler, Scheduler } from "./Scheduler";
import { update_list } from "./updateList";

export class HistoryListScheduler extends Scheduler {

    constructor() {
        super("0 0 0 1 * *");
    }

    private updateHistoryList(): Promise<IScheduler> {
        return new Promise(( resolve, reject ) => {
            update_list().then(res => {
                const success_message: IScheduler = {
                    success: true,
                    error: new Error(undefined)
                }
                resolve(success_message)
            }).catch(err => {
                const error_message: IScheduler = {
                    success: false,
                    error: err
                }
                reject(error_message)
            })
        })
    }

    executejob(): Promise<IScheduler> {
        return new Promise(( resolve, reject ) => {
            const updateHistoryList = this.updateHistoryList();
            resolve(updateHistoryList)
        })
    }
}
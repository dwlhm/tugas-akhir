import fs from "fs";
import { Device } from "database/models/device";
import { Csv_List } from "database/models/Csv_List";

export async function update_list() {
    const get_devices = await Device.findAll();

    get_devices.forEach(async (v,i) => {
        console.log("id: ", v.id);
        const curr_date = new Date();
        const curr_month = curr_date.getMonth();
        const curr_year = curr_date.getFullYear();
        fs.open(`../backend/public/${v.id}-${curr_month}-${curr_year}.csv`, 'r', (err, res) => {
            if (res == undefined) fs.writeFileSync(`../backend/public/${v.id}-${curr_month}-${curr_year}.csv`, "")
        });
        const csv_list_db = await Csv_List.findByPk(v.id)
        if (csv_list_db == null) Csv_List.create({
            id: v.id,
            list: `${v.id}-${curr_month}-${curr_year}`
        })
        else {
            const csv_list: String = csv_list_db.dataValues.list;
            const list_arr = csv_list.split(",")
            if (list_arr[0] !== `${v.id}-${curr_month}-${curr_year}`) {
                let new_list = [`${v.id}-${curr_month}-${curr_year}`];
                
                csv_list_db.update({
                    list: list_arr.length >= 2
                        ? new_list.concat(list_arr.slice(0, -1)).join(",") 
                        : new_list.concat(list_arr).join(",")
                })
            }
        }
    })
}
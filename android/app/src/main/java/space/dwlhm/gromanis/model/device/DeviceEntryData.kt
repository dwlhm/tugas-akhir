package space.dwlhm.gromanis.model.device

import com.github.mikephil.charting.data.Entry

data class DeviceEntryData(
    var pm1: Entry,
    var pm25: Entry,
    var pm10: Entry
)

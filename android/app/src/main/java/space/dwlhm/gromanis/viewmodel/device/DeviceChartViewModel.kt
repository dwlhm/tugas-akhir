package space.dwlhm.gromanis.viewmodel.device

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineDataSet

class DeviceChartViewModel: ViewModel() {

    private val PM1_CHART_LABEL = "PM 1.0"
    private val PM25_CHART_LABEL = "PM 2.5"
    private val PM10_CHART_LABEL = "PM 10"

    private val entryDataPm1 = mutableListOf<Entry>()
    private val _pm1Dataset = MutableLiveData(LineDataSet(entryDataPm1, PM1_CHART_LABEL))
    val pm1DataSet: LiveData<LineDataSet> = _pm1Dataset

    fun insertPm1(entry: Entry) {
        entryDataPm1.add(entry)

        if (entryDataPm1.size > 20) entryDataPm1.removeAt(0)

        _pm1Dataset.value = LineDataSet(entryDataPm1, PM1_CHART_LABEL)
    }

}
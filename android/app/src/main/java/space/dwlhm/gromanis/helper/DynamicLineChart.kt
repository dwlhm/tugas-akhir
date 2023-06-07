package space.dwlhm.gromanis.helper

import android.content.Context
import android.graphics.Color
import android.util.Log
import androidx.core.content.ContextCompat
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.components.YAxis.AxisDependency
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.formatter.ValueFormatter
import space.dwlhm.gromanis.R


class DynamicLineChart(val chart: LineChart, val context: Context) {

    init {
        chart.apply {
            axisRight.isEnabled = false

            xAxis.apply {
                valueFormatter = TimeFormatter()
                isGranularityEnabled = true
                granularity = 10f
                setDrawGridLines(false)
                setDrawAxisLine(false)
                position = XAxis.XAxisPosition.BOTTOM
                isEnabled = true
            }

            setTouchEnabled(true)
            isDragEnabled = true
            setScaleEnabled(false)
            setPinchZoom(false)
            description = null
            legend.isEnabled = false
        }
    }

    class TimeFormatter : ValueFormatter() {
        override fun getFormattedValue(value: Float): String {
            val str = value.toString()
            val hour = str.slice(1..2)
            val minute = str.slice(3..4)
            val second = str.slice(5..6)
            return "$hour:$minute:$second"
        }
    }

    fun addEntry(entry: Entry) {
        if (chart.data == null) chart.data = LineData()
        val data = chart.data
        var set = data.getDataSetByIndex(0)

        if (set == null) {
            set = createSet()
            data.addDataSet(set)
        }

        set.addEntry(entry)

        data.notifyDataChanged()
        chart.notifyDataSetChanged()
        chart.setVisibleXRangeMaximum(10F)

        chart.moveViewToX(data.xMax - 9f)
//        chart.invalidate()
    }

//    private fun removeLastEntry() {
//        val data: LineData = chart.getData()
//        if (data != null) {
//            val set = data.getDataSetByIndex(0)
//            if (set != null) {
//                val e: Map.Entry<*, *> =
//                    set.getEntryForXValue((set.entryCount - 1).toFloat(), Float.NaN)
//                data.removeEntry(e, 0)
//                // or remove by index
//                // mData.removeEntryByXValue(xIndex, dataSetIndex);
//                data.notifyDataChanged()
//                chart.notifyDataSetChanged()
//                chart.invalidate()
//            }
//        }
//    }

    private fun createSet(): LineDataSet {
        return LineDataSet(null, "DataSet 1").apply {
            lineWidth = 2.5f
            circleRadius = 4.5f
            color = Color.rgb(240, 99, 99)
            setCircleColor(Color.rgb(240, 99, 99))
            highLightColor = Color.rgb(190, 190, 190)
            valueTextSize = 10f
            mode = LineDataSet.Mode.CUBIC_BEZIER
            setDrawFilled(true)
            fillColor = ContextCompat.getColor(context, R.color.red)
        }
    }
}
package space.dwlhm.gromanis.view.home

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.data.Entry
import com.google.gson.Gson
import kotlinx.coroutines.*
import space.dwlhm.gromanis.R
import space.dwlhm.gromanis.helper.DynamicLineChart
import space.dwlhm.gromanis.model.device.DeviceDataValueSetterGetter
import space.dwlhm.gromanis.model.device.DeviceSetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.view.menu.MenuActivity
import space.dwlhm.gromanis.viewmodel.device.DeviceConfigurationViewModel
import space.dwlhm.gromanis.viewmodel.device.DeviceHistoryAdapter
import space.dwlhm.gromanis.viewmodel.device.DeviceHistoryViewModel
import space.dwlhm.gromanis.viewmodel.device.DeviceValueViewModel
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.concurrent.TimeUnit

class HomeActivity : AppCompatActivity(), AdapterView.OnItemSelectedListener {

    private lateinit var deviceConfigurationViewModel: DeviceConfigurationViewModel
    private lateinit var deviceValueViewModel: DeviceValueViewModel
    private lateinit var deviceSelector: Spinner
    private lateinit var arrayAdapter: ArrayAdapter<String>
    private lateinit var pmCardReader: RelativeLayout

    private lateinit var pm1Card: LinearLayout
    private lateinit var pm25Card: LinearLayout
    private lateinit var pm10Card: LinearLayout
    private lateinit var pm100Card: LinearLayout
    private lateinit var arahAnginCard: LinearLayout
    private lateinit var kecAngingCard: LinearLayout
    private lateinit var tempCard: LinearLayout
    private lateinit var humCard: LinearLayout

    private lateinit var valueKecepatanangin: TextView
    private lateinit var valueArahangin: TextView
    private lateinit var valueHumidity: TextView
    private lateinit var valueTemperature: TextView
    private lateinit var valuePm1: TextView
    private lateinit var valuePm2: TextView
    private lateinit var valuePm10: TextView
    private lateinit var valuePm100: TextView
    private lateinit var timestamp: TextView

    private lateinit var mainViewHome: ScrollView
    private lateinit var noData: TextView
    private lateinit var loadingViewHome: TextView
    private lateinit var rvHistory: RecyclerView
    private lateinit var deviceHistoryViewModel: DeviceHistoryViewModel
    private lateinit var panelNoHistory: TextView

    private lateinit var pmCardChart: LinearLayout
    private lateinit var pmCardText: LinearLayout
    private lateinit var chartPm1: DynamicLineChart
    private lateinit var chartPm25: DynamicLineChart
    private lateinit var chartPm10: DynamicLineChart
    private lateinit var chartPm100: DynamicLineChart
    private var dataUpdateTime: Float = 0.0f

    var active = false

    lateinit var loopSystem: Job

    lateinit var prefs: Prefs
    var listDevices = ArrayList<DeviceSetterGetter>()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)
        prefs = Prefs(this)

        findViewById<ImageButton>(R.id.btn_menu).setOnClickListener {
            active = false
            startActivity(Intent(this, MenuActivity::class.java).putExtra("from", "home"))
        }

        pm1Card = findViewById(R.id.pm1_card)
        pm25Card = findViewById(R.id.pm25_card)
        pm10Card = findViewById(R.id.pm10_card)
        pm100Card = findViewById(R.id.pm100_card)
        arahAnginCard = findViewById(R.id.arah_wrap)
        kecAngingCard = findViewById(R.id.kecepatan_wrap)
        tempCard = findViewById(R.id.temp_wrap)
        humCard = findViewById(R.id.hum_wrap)

        pmCardReader = findViewById(R.id.pm_card_reader)
        valueKecepatanangin = findViewById(R.id.kecepatanangin_value)
        valueArahangin = findViewById(R.id.arahangin_value)
        valueHumidity = findViewById(R.id.humidity_value)
        valueTemperature = findViewById(R.id.temperature_value)
        valuePm1 = findViewById(R.id.pm1_value)
        valuePm2 = findViewById(R.id.pm25_value)
        valuePm10 = findViewById(R.id.pm10_value)
        valuePm100 = findViewById(R.id.pm100_value)
        timestamp = findViewById(R.id.timestamp)

        noData = findViewById(R.id.no_data)
        mainViewHome = findViewById(R.id.main_view_home)
        loadingViewHome = findViewById(R.id.loading_view_home)

        deviceSelector = findViewById(R.id.device_selector_home)
        deviceSelector.onItemSelectedListener = this

        deviceConfigurationViewModel = ViewModelProvider(this)[DeviceConfigurationViewModel::class.java]
        listingDevice()
        deviceValueViewModel = ViewModelProvider(this)[DeviceValueViewModel::class.java]
        deviceHistoryViewModel = ViewModelProvider(this)[DeviceHistoryViewModel::class.java]

        panelNoHistory = findViewById(R.id.panel_no_history)
        rvHistory = findViewById(R.id.rv_history)
        rvHistory.layoutManager = LinearLayoutManager(this)
        generateHistory()

        pmCardChart = findViewById(R.id.pm_card_chart)
        pmCardText = findViewById(R.id.pm_card_text)

        chartPm1 = DynamicLineChart(findViewById(R.id.chart_pm1), this)
        chartPm25 = DynamicLineChart(findViewById(R.id.chart_pm25), this)
        chartPm10 = DynamicLineChart(findViewById(R.id.chart_pm10), this)
        chartPm100 = DynamicLineChart(findViewById(R.id.chart_pm100), this)

    }



    override fun onStart() {
        super.onStart()

        active = true

        updateValue()
    }

    override fun onPause() {
        super.onPause()

        active = false

        loopSystem.cancel()
    }

    override fun onItemSelected(p0: AdapterView<*>?, p1: View?, p2: Int, p3: Long) {
        prefs.deviceInfoPref = listDevices[p2]

        active = false

        loopSystem.cancel()

        active = true
        loopSystem = CoroutineScope(Dispatchers.IO).launchPeriodic(TimeUnit.SECONDS.toMillis(2)) {

            if (prefs.deviceInfoPref != null)
                deviceValueViewModel.getLatestDeviceValue(this, prefs.deviceInfoPref!!.id)
        }
    }

    override fun onNothingSelected(p0: AdapterView<*>?) {
        TODO("Not yet implemented")
    }

    private fun generateHistory() {
        val deviceId = prefs.deviceInfoPref?.id
        if (deviceId != null) {
            deviceHistoryViewModel
                .getHistoryDevices(this, deviceId)!!.observe(this) {
                    val body = it.body

                    if (body != null) {
                        if (body.list.isEmpty()) {
                            rvHistory.visibility = View.GONE
                            panelNoHistory.visibility = View.VISIBLE
                        }
                        else {
                            rvHistory.visibility = View.VISIBLE
                            panelNoHistory.visibility = View.GONE
                            rvHistory.adapter = DeviceHistoryAdapter(body.list, this)
                            rvHistory.invalidate()
                        }
                    } else {
                        rvHistory.visibility = View.GONE
                        panelNoHistory.visibility = View.VISIBLE
                    }
                }
        }
    }
    private fun listingDevice() {
        deviceConfigurationViewModel
            .getAllDevices(this)!!.observe(this) {
                val body = it.body
                if (body != null) {
                    val localListName = ArrayList<String>()
                    val localListDevice = ArrayList<DeviceSetterGetter>()
                    var position = 0
                    for ((i, device) in body.withIndex()) {
                        localListName.add(device.name)
                        localListDevice.add(device)

                        if (device.id == prefs.deviceInfoPref?.id) position = i
                    }

                    listDevices = localListDevice
                    if (prefs.deviceInfoPref == null)
                        prefs.deviceInfoPref = listDevices[position]

                    arrayAdapter = ArrayAdapter(this, R.layout.spinner_text, localListName)
                    arrayAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                    deviceSelector.adapter = arrayAdapter
                    deviceSelector.setSelection(position)
                    loopSystem = CoroutineScope(Dispatchers.IO).launchPeriodic(TimeUnit.SECONDS.toMillis(5)) {

                        if (prefs.deviceInfoPref != null)
                            deviceValueViewModel.getLatestDeviceValue(this, prefs.deviceInfoPref!!.id)
                    }

                }
            }
    }

    private fun updateValue() {

        if (prefs.deviceInfoPref != null) {
            val deviceId = prefs.deviceInfoPref!!.id

            deviceValueViewModel.getLatestDeviceValue(this, deviceId)

            deviceValueViewModel.deviceValue.observe(this) {
                if (it != null) {
                    if (it.code == 200 && it.body != null) {
                        mainViewHome.visibility = View.VISIBLE
                        noData.visibility = View.GONE
                        loadingViewHome.visibility = View.GONE

                        val gson = Gson()
                        val bodyJson = gson.fromJson(it.body.value, DeviceDataValueSetterGetter::class.java)

                        val (dataHeader, dataBody) = bodyJson.data.split("|")

                        val sensorValue = dataBody.split(",")
                        val lengthValue = sensorValue.size - 2

                        val localDate = ZonedDateTime.parse(it.body.updatedAt).withZoneSameInstant(
                            ZoneId.systemDefault())
                        val dateString = localDate.format(
                            DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"))
                        val chartTime = localDate.format(DateTimeFormatter.ofPattern("1HHmmss")).toFloat()

                        for ((i, element) in dataHeader.withIndex()) {
                            if (element == 'v') {
                                showDevice(kecAngingCard)
                                if (i > lengthValue) deviceOffline(valueKecepatanangin)
                                else deviceOnline(valueKecepatanangin, sensorValue[i])
                            }
                            if (element == 'a') {
                                showDevice(arahAnginCard)
                                if (i > lengthValue) deviceOffline(valueArahangin)
                                else deviceOnline(valueArahangin, sensorValue[i])
                            }
                            if (element == 'h') {
                                showDevice(humCard)
                                if (i > lengthValue) deviceOffline(valueHumidity)
                                else deviceOnline(valueHumidity, sensorValue[i])
                            }
                            if (element == 't') {
                                showDevice(tempCard)
                                if (i > lengthValue) deviceOffline(valueTemperature)
                                else deviceOnline(valueTemperature, sensorValue[i])
                            }
                            if (element == '1') {
                                showDevice(pm1Card)
                                showChart(findViewById(R.id.chart_pm1_title), findViewById(R.id.chart_pm1))
                                if (i > lengthValue) deviceOffline(valuePm1)
                                else {
                                    deviceOnline(valuePm1, sensorValue[i])
                                    if (dataUpdateTime != chartTime) {
                                        chartPm1.addEntry(
                                            Entry(
                                                chartTime, sensorValue[i].toFloat()
                                            )
                                        )
                                    }
                                }
                            }
                            if (element == '2') {
                                showDevice(pm25Card)
                                showChart(findViewById(R.id.chart_pm25_title), findViewById(R.id.chart_pm25))
                                if (i > lengthValue) deviceOffline(valuePm2)
                                else {
                                    deviceOnline(valuePm2, sensorValue[i])
                                    if (dataUpdateTime != chartTime) {
                                        chartPm25.addEntry(
                                            Entry(
                                                chartTime, sensorValue[i].toFloat()
                                            )
                                        )
                                    }
                                }
                            }
                            if (element == '0') {
                                showDevice(pm10Card)
                                showChart(findViewById(R.id.chart_pm10_title), findViewById(R.id.chart_pm10))
                                if (i > lengthValue) deviceOffline(valuePm10)
                                else {
                                    deviceOnline(valuePm10, sensorValue[i])
                                    if (dataUpdateTime != chartTime) {
                                        chartPm10.addEntry(
                                            Entry(
                                                chartTime, sensorValue[i].toFloat()
                                            )
                                        )
                                    }
                                }
                            }
                            if (element == '3') {
                                showDevice(pm100Card)
                                showChart(findViewById(R.id.chart_pm100_title), findViewById(R.id.chart_pm100))
                                if (i > lengthValue) deviceOffline(valuePm100)
                                else {
                                    deviceOnline(valuePm100, sensorValue[i])
                                    if (dataUpdateTime != chartTime) {
                                        chartPm100.addEntry(
                                            Entry(
                                                chartTime, sensorValue[i].toFloat()
                                            )
                                        )
                                    }
                                }
                            }
                        }

                        if (dataUpdateTime != chartTime) dataUpdateTime = chartTime

                        timestamp.text = "terakhir diupdate: ${dateString}"

                    } else {
                        mainViewHome.visibility = View.GONE
                        noData.visibility = View.VISIBLE
                        loadingViewHome.visibility = View.GONE
                    }
                } else {
                    mainViewHome.visibility = View.GONE
                    noData.visibility = View.VISIBLE
                    loadingViewHome.visibility = View.GONE
                }
            }
        }

    }

    private fun showChart(title: TextView, chart: LineChart) {
        title.visibility = View.VISIBLE
        chart.visibility = View.VISIBLE
    }
    private fun showDevice(layout: LinearLayout) {
        layout.visibility = View.VISIBLE
    }
    private fun hideDevice(layout: LinearLayout) {
        layout.visibility = View.GONE
    }
    private fun deviceOffline(textView: TextView) {
        textView.text = "offline!"
        textView.setTextColor(getColor(R.color.red))
    }
    private fun deviceOnline(textView: TextView, value: String) {
        textView.text = value
        textView.setTextColor(getColor(R.color.white))
    }
    private fun CoroutineScope.launchPeriodic(repeatMillis: Long, action: () -> Unit) : Job {
        return launch {
            while (active) {
                action()
                delay(repeatMillis)
            }
        }
    }
}


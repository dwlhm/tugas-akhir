package space.dwlhm.gromanis.view.home

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.*
import androidx.core.view.setPadding
import androidx.core.view.updatePadding
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import kotlinx.coroutines.*
import org.w3c.dom.Text
import space.dwlhm.gromanis.R
import space.dwlhm.gromanis.model.device.DeviceDataPacketSetterGetter
import space.dwlhm.gromanis.model.device.DeviceDataValueSetterGetter
import space.dwlhm.gromanis.model.device.DeviceSetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.repository.device.DeviceValueRepository
import space.dwlhm.gromanis.view.menu.MenuActivity
import space.dwlhm.gromanis.viewmodel.device.DeviceConfigurationViewModel
import space.dwlhm.gromanis.viewmodel.device.DeviceHistoryAdapter
import space.dwlhm.gromanis.viewmodel.device.DeviceHistoryViewModel
import space.dwlhm.gromanis.viewmodel.device.DeviceValueViewModel
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.concurrent.TimeUnit

class HomeActivity : AppCompatActivity(), AdapterView.OnItemSelectedListener {

    private lateinit var deviceConfigurationViewModel: DeviceConfigurationViewModel
    private lateinit var deviceValueViewModel: DeviceValueViewModel
    private lateinit var deviceSelector: Spinner
    private lateinit var arrayAdapter: ArrayAdapter<String>

    private lateinit var valueKecepatanangin: TextView
    private lateinit var valueArahangin: TextView
    private lateinit var valueHumidity: TextView
    private lateinit var valueTemperature: TextView
    private lateinit var valuePm1: TextView
    private lateinit var valuePm2: TextView
    private lateinit var valuePm10: TextView
    private lateinit var timestamp: TextView

    private lateinit var mainViewHome: ScrollView
    private lateinit var noData: TextView
    private lateinit var loadingViewHome: TextView
    private lateinit var rvHistory: RecyclerView
    private lateinit var deviceHistoryViewModel: DeviceHistoryViewModel
    private lateinit var panelNoHistory: TextView

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
        valueKecepatanangin = findViewById(R.id.kecepatanangin_value)
        valueArahangin = findViewById(R.id.arahangin_value)
        valueHumidity = findViewById(R.id.humidity_value)
        valueTemperature = findViewById(R.id.temperature_value)
        valuePm1 = findViewById(R.id.pm1_value)
        valuePm2 = findViewById(R.id.pm25_value)
        valuePm10 = findViewById(R.id.pm10_value)
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
        loopSystem = CoroutineScope(Dispatchers.IO).launchPeriodic(TimeUnit.SECONDS.toMillis(5)) {

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

                        for ((i, element) in dataHeader.withIndex()) {
                            if (element == 'v') {
                                if (i > lengthValue) deviceOffline(valueKecepatanangin)
                                else valueKecepatanangin.text = sensorValue[i]
                            }
                            if (element == 'a') {
                                if (i > lengthValue) deviceOffline(valueArahangin)
                                else valueArahangin.text = sensorValue[i]
                            }
                            if (element == 'h') {
                                if (i > lengthValue) deviceOffline(valueHumidity)
                                else valueHumidity.text = sensorValue[i]
                            }
                            if (element == 't') {
                                if (i > lengthValue) deviceOffline(valueTemperature)
                                else valueTemperature.text = sensorValue[i]
                            }
                            if (element == '1') {
                                if (i > lengthValue) deviceOffline(valuePm1)
                                else valuePm1.text = sensorValue[i]
                            }
                            if (element == '2') {
                                if (i > lengthValue) deviceOffline(valuePm2)
                                else valuePm2.text = sensorValue[i]
                            }
                            if (element == '0') {
                                if (i > lengthValue) deviceOffline(valuePm10)
                                else valuePm10.text = sensorValue[i]
                            }
                        }

                        val dateString = LocalDateTime.parse(it.body.updatedAt.substring(0,22)).atOffset(ZoneOffset.UTC).format(
                            DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"))

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

    private fun deviceOffline(textView: TextView) {
        textView.text = "offline!"
        textView.setTextColor(getColor(R.color.red))
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
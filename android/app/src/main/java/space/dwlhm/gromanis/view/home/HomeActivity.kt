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
import com.google.gson.Gson
import kotlinx.coroutines.*
import org.w3c.dom.Text
import space.dwlhm.gromanis.R
import space.dwlhm.gromanis.model.device.DeviceDataPacketSetterGetter
import space.dwlhm.gromanis.model.device.DeviceSetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.repository.device.DeviceValueRepository
import space.dwlhm.gromanis.view.menu.MenuActivity
import space.dwlhm.gromanis.viewmodel.device.DeviceConfigurationViewModel
import space.dwlhm.gromanis.viewmodel.device.DeviceValueViewModel
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

    private lateinit var mainViewHome: ScrollView
    private lateinit var noData: TextView

    var active = false

    lateinit var loopSystem: Job

    lateinit var prefs: Prefs
    var listDevices = ArrayList<DeviceSetterGetter>()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

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

        noData = findViewById(R.id.no_data)
        mainViewHome = findViewById(R.id.main_view_home)

        deviceSelector = findViewById(R.id.device_selector_home)
        deviceSelector.onItemSelectedListener = this

        prefs = Prefs(this)

        deviceConfigurationViewModel = ViewModelProvider(this)[DeviceConfigurationViewModel::class.java]
        listingDevice()
        deviceValueViewModel = ViewModelProvider(this)[DeviceValueViewModel::class.java]

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
        loopSystem.start()
    }

    override fun onNothingSelected(p0: AdapterView<*>?) {
        TODO("Not yet implemented")
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
                    val body = it.body
                    if (it.body != null) {
                        val gson = Gson()
                        val value = gson.fromJson(body!!.value, DeviceDataPacketSetterGetter::class.java)
                        if (value != null) {
                            mainViewHome.visibility = View.VISIBLE
                            noData.visibility = View.GONE
                            val data = value.device.data
                            val (dataHeader, dataBody) = data.split("|")
                            var position = 0
                            for ((i, element) in dataHeader.withIndex()) {
                                position = (i + 1) * 5
                                Log.v("Position : ", position.toString())
                                if (element == 'v') valueKecepatanangin.text =
                                    dataBody.slice(IntRange(position - 5, position - 1))
                                if (element == 'a') valueArahangin.text =
                                    dataBody.slice(IntRange(position - 5, position - 1))
                                if (element == 'h') valueHumidity.text =
                                    dataBody.slice(IntRange(position - 5, position - 1))
                                if (element == 't') valueTemperature.text =
                                    dataBody.slice(IntRange(position - 5, position - 1))
                                if (element == '1') valuePm1.text =
                                    dataBody.slice(IntRange(position - 5, position - 1))
                                if (element == '2') valuePm2.text =
                                    dataBody.slice(IntRange(position - 5, position - 1))
                                if (element == '0') valuePm10.text =
                                    dataBody.slice(IntRange(position - 5, position - 1))
                            }
                            if (!dataHeader.contains('v')) deviceOffline(valueKecepatanangin)
                            if (!dataHeader.contains('a')) deviceOffline(valueArahangin)
                            if (!dataHeader.contains('h')) deviceOffline(valueHumidity)
                            if (!dataHeader.contains('t')) deviceOffline(valueTemperature)
                            if (!dataHeader.contains('1')) deviceOffline(valuePm1)
                            if (!dataHeader.contains('2')) deviceOffline(valuePm2)
                            if (!dataHeader.contains('0')) deviceOffline(valuePm10)
                            Log.v("Data : ", dataHeader)
                        } else {
                            mainViewHome.visibility = View.GONE
                            noData.visibility = View.VISIBLE
                        }
                    }
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
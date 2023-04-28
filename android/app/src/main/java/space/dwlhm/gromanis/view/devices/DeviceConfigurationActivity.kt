package space.dwlhm.gromanis.view.devices

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.*
import android.widget.AdapterView.OnItemSelectedListener
import androidx.appcompat.app.AlertDialog
import androidx.lifecycle.ViewModelProvider
import space.dwlhm.gromanis.R
import space.dwlhm.gromanis.model.device.DeviceSetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.view.menu.MenuActivity
import space.dwlhm.gromanis.viewmodel.device.DeviceConfigurationViewModel
import space.dwlhm.gromanis.viewmodel.gateway.GatewayConfigurationViewModel
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

class DeviceConfigurationActivity : AppCompatActivity(), OnItemSelectedListener {

    private lateinit var deviceConfigurationViewModel: DeviceConfigurationViewModel
    private lateinit var deviceSelector: Spinner
    private lateinit var arrayAdapter: ArrayAdapter<String>
    lateinit var btnDelete: Button
    lateinit var txtId: TextView
    lateinit var txtName: TextView
    lateinit var txtAddress: TextView
    lateinit var txtMaintainerId: TextView
    lateinit var txtCreatedAt: TextView
    lateinit var prefs: Prefs
    var listDevices = ArrayList<DeviceSetterGetter>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_device_configuration)

        findViewById<ImageButton>(R.id.btn_menu).setOnClickListener {
            startActivity(
                Intent(this, MenuActivity::class.java)
                    .putExtra("from", "deviceConfiguration")
            )
        }

        deviceSelector = findViewById(R.id.device_selector)
        btnDelete = findViewById(R.id.btn_delete_device)
        txtId = findViewById(R.id.device_id)
        txtName = findViewById(R.id.device_name)
        txtAddress = findViewById(R.id.device_alamat)
        txtMaintainerId = findViewById(R.id.device_maintainer)
        txtCreatedAt = findViewById(R.id.device_createdat)

        prefs = Prefs(this)

        deviceSelector.onItemSelectedListener = this

        deviceConfigurationViewModel = ViewModelProvider(this)[DeviceConfigurationViewModel::class.java]

        listingDevices()

        btnDelete.setOnClickListener {
            if (prefs.deviceInfoPref != null)
                showDeleteDeviceDialog(
                    prefs.deviceInfoPref!!.name,
                    prefs.deviceInfoPref!!.id
                )
        }

    }

    private fun listingDevices() {
        deviceConfigurationViewModel
            .getAllDevices(this)!!.observe(this) {
                val body = it.body

                if (body != null) {
                    if (body.isEmpty()) {
                        findViewById<LinearLayout>(R.id.device_details).visibility = View.GONE
                        findViewById<TextView>(R.id.no_device).visibility = View.VISIBLE
                    } else {
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
                    }
                }
            }
    }

    override fun onItemSelected(p0: AdapterView<*>?, p1: View?, p2: Int, p3: Long) {
        prefs.deviceInfoPref = listDevices[p2]

        deviceConfigurationViewModel.getDevice(
            this, listDevices[p2].id
        )!!.observe(this) {
            val body = it.body

            if (body != null) {
                txtId.text = body.id
                txtName.text = body.name
                txtAddress.text = body.address
                txtMaintainerId.text = "${body.user.name}/${body.user.email}"
                val date = ZonedDateTime.parse(body.createdAt)
                    .withZoneSameInstant(ZoneId.systemDefault())
                    .format(DateTimeFormatter.ofPattern("dd-MM-uuuu hh:mm a"))
                txtCreatedAt.text = date
            }
        }
    }

    override fun onNothingSelected(p0: AdapterView<*>?) {
        TODO("Not yet implemented")
    }

    private fun showDeleteDeviceDialog(name: String, id: String) {
        val alertDialog = AlertDialog.Builder(this)

        alertDialog.apply {
            setTitle("Delete Device")
            setMessage("Yakin menghapus device '${name}' dari server?")
            setPositiveButton("Tidak") { _,_ ->
                Log.v("Hapus? ", "Tidak Jadi")
            }
            setNegativeButton("Yakin") {_,_ ->
                deviceConfigurationViewModel
                    .deleteDevice(this@DeviceConfigurationActivity, id)!!.observe(this@DeviceConfigurationActivity) {

                    if (it.body != null) {
                        prefs.deviceInfoPref = null
                        listingDevices()
                    } else Toast.makeText(
                        this@DeviceConfigurationActivity,
                        it.errors?.get(0) ?: "Delete Device Gagal!",
                        Toast.LENGTH_SHORT
                    ).show()
                }

            }
        }.create().show()
    }
}
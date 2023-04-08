package space.dwlhm.gromanis.view.gateway

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.AdapterView.OnItemSelectedListener
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import space.dwlhm.gromanis.R
import space.dwlhm.gromanis.model.gateway.GatewaySetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.view.home.HomeActivity
import space.dwlhm.gromanis.view.menu.MenuActivity
import space.dwlhm.gromanis.viewmodel.gateway.GatewayConfigurationViewModel
import java.time.ZoneId
import java.time.ZonedDateTime
import kotlin.collections.ArrayList

class GatewayConfigurationActivity : AppCompatActivity(), OnItemSelectedListener {

    private lateinit var gatewayConfigurationViewModel: GatewayConfigurationViewModel
    private lateinit var gatewaySelector: Spinner
    private lateinit var arrayAdapter: ArrayAdapter<String>
    lateinit var btnMqtt: Button
    lateinit var btnDelete: Button
    lateinit var txtId: TextView
    lateinit var txtName: TextView
    lateinit var txtAddress: TextView
    lateinit var txtMaintainerId: TextView
    lateinit var txtCreatedAt: TextView
    lateinit var prefs: Prefs
    var listGateways = ArrayList<GatewaySetterGetter>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_gateway_configuration)

        findViewById<ImageButton>(R.id.btn_menu).setOnClickListener {
            startActivity(Intent(this, MenuActivity::class.java).putExtra("from", "gatewayConfiguration"))
        }
        btnMqtt = findViewById(R.id.btn_mqtt)
        btnDelete = findViewById(R.id.btn_delete_gateway)
        txtId = findViewById(R.id.gateway_id)
        txtName = findViewById(R.id.gateway_name)
        txtAddress = findViewById(R.id.gateway_alamat)
        txtMaintainerId = findViewById(R.id.gateway_maintainer)
        txtCreatedAt = findViewById(R.id.gateway_createdat)

        prefs = Prefs(this)

        gatewaySelector = findViewById(R.id.gateway_selector)
        gatewaySelector.onItemSelectedListener = this

        gatewayConfigurationViewModel = ViewModelProvider(this)[GatewayConfigurationViewModel::class.java]

        listingGateway()

        btnMqtt.setOnClickListener {

            if (prefs.gatewayInfoPref != null)
                startActivity(Intent(this, MqttGatewayActivity::class.java).putExtra("gatewayId", prefs.gatewayInfoPref!!.id))
        }
        btnDelete.setOnClickListener {
            if (prefs.gatewayInfoPref != null)
                showDeleteGatewayDialog(prefs.gatewayInfoPref!!.name, prefs.gatewayInfoPref!!.id)
        }

    }

    override fun onStart() {
        super.onStart()

        listingGateway()
    }

    override fun onItemSelected(p0: AdapterView<*>?, p1: View?, p2: Int, p3: Long) {
        prefs.gatewayInfoPref = listGateways[p2]

        gatewayConfigurationViewModel.getGateway(this, listGateways[p2].id)!!.observe(this, Observer {
            val body = it.body

            if (body != null) {
                txtId.text = body.id
                txtName.text = body.name
                txtAddress.text = body.address
                txtMaintainerId.text = body.maintainer.toString()
                val date = ZonedDateTime.parse(body.createdAt).withZoneSameLocal(ZoneId.systemDefault()).toLocalDate()
                txtCreatedAt.text = date.toString()
            }
        })
    }

    override fun onNothingSelected(p0: AdapterView<*>?) {
        TODO("Not yet implemented")
    }

    private fun listingGateway() {
        gatewayConfigurationViewModel.getAllGateways(this)!!.observe(this, Observer {

            val body = it.body

            if (body != null) {
                if (body.isEmpty()) {
                    findViewById<LinearLayout>(R.id.gateway_details).visibility = View.GONE
                    findViewById<TextView>(R.id.no_gateway).visibility = View.VISIBLE
                } else {
                    val localListGatewayName = ArrayList<String>()
                    val localListGateways = ArrayList<GatewaySetterGetter>()
                    var position = 0
                    for ((i, gateway) in body.withIndex()) {
                        localListGatewayName.add(gateway.name)
                        localListGateways.add(gateway)

                        if (gateway.id == prefs.gatewayInfoPref?.id) position = i
                    }

                    listGateways = localListGateways
                    if (prefs.gatewayInfoPref == null) prefs.gatewayInfoPref = listGateways[0]

                    arrayAdapter = ArrayAdapter(this, R.layout.spinner_text, localListGatewayName)
                    arrayAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                    gatewaySelector.adapter = arrayAdapter
                    gatewaySelector.setSelection(position)
                }
            }

        })
    }

    private fun showDeleteGatewayDialog(name: String, id: String) {
        val alertDialog = AlertDialog.Builder(this)

        alertDialog.apply {
            setTitle("Delete Gateway")
            setMessage("Yakin menghapus gateway '${name}' dari server?")
            setPositiveButton("Tidak") { _,_ ->
                Log.v("Hapus? ", "Tidak Jadi")
            }
            setNegativeButton("Yakin") {_,_ ->
                gatewayConfigurationViewModel.deleteGateway(this@GatewayConfigurationActivity, id)!!.observe(this@GatewayConfigurationActivity) {

                    if (it.body != null) {
                        prefs.gatewayInfoPref = null
                        listingGateway()
                    } else Toast.makeText(
                        this@GatewayConfigurationActivity,
                        it.errors?.get(0) ?: "Delete Gateway Gagal!",
                        Toast.LENGTH_SHORT
                    ).show()
                }

            }
        }.create().show()
    }
}
package space.dwlhm.gromanis.view.gateway

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import space.dwlhm.gromanis.R
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.view.login.LoginActivity
import space.dwlhm.gromanis.viewmodel.gateway.MqttGatewayViweModel

class MqttGatewayActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_mqtt_gateway)

        findViewById<ImageButton>(R.id.btn_menu).setOnClickListener {
            finish()
        }

        val gatewayId = intent.getStringExtra("gatewayId")

        if (gatewayId == null) {
            Toast.makeText(this, "Gateway tidak dipilih", Toast.LENGTH_SHORT).show()
            finish()
        } else {

            val mqttGatewayViweModel = ViewModelProvider(this)[MqttGatewayViweModel::class.java]
            mqttGatewayViweModel.getMqttGatewayCredentials(
                this,
                gatewayId
            )!!.observe(this, Observer {

                val body = it.body

                if (body != null) {
                    findViewById<TextView>(R.id.mqtt_username).text = body.credential[0]
                    findViewById<TextView>(R.id.mqtt_password).text = body.credential[1]
                } else Toast.makeText(this, it.errors?.get(0) ?: "Logout Gagal! Kesalahan Server", Toast.LENGTH_LONG).show()
            })

        }
    }
}
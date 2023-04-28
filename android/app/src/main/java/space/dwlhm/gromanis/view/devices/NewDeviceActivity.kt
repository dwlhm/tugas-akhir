package space.dwlhm.gromanis.view.devices

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Toast
import androidx.lifecycle.ViewModelProvider
import space.dwlhm.gromanis.R
import space.dwlhm.gromanis.model.device.RegisterDeviceBody
import space.dwlhm.gromanis.view.menu.MenuActivity
import space.dwlhm.gromanis.viewmodel.device.RegisterDeviceViewModel

class NewDeviceActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_new_device)

        findViewById<ImageButton>(R.id.btn_menu).setOnClickListener {
            startActivity(Intent(this, MenuActivity::class.java).putExtra("from", "registerDevice"))
        }

        val deviceName = findViewById<EditText>(R.id.input_device_name)
        val deviceAddress = findViewById<EditText>(R.id.input_device_address)
        val deviceGateway = findViewById<EditText>(R.id.input_device_gateway)
        val registerDeviceViewModel = ViewModelProvider(this)[RegisterDeviceViewModel::class.java]

        findViewById<Button>(R.id.btn_new_device).setOnClickListener {

            var errors = false
            if (deviceName.text.trim().isEmpty()) {
                errors = true
                deviceName.background = getDrawable(R.drawable.bg_input_error)
            } else deviceName.background = getDrawable(R.drawable.bg_input)
            if (deviceAddress.text.trim().isEmpty()) {
                errors = true
                deviceAddress.background = getDrawable(R.drawable.bg_input_error)
            } else deviceAddress.background = getDrawable(R.drawable.bg_input)
            if (deviceGateway.text.trim().isEmpty()) {
                errors = true
                deviceGateway.background = getDrawable(R.drawable.bg_input_error)
            } else deviceGateway.background = getDrawable(R.drawable.bg_input)

            if (!errors) registerDeviceViewModel.doDeviceRegistration(
                this,
                RegisterDeviceBody(
                    deviceName.text.toString(),
                    deviceAddress.text.toString(),
                    deviceGateway.text.toString()
                )
            )!!.observe(this) {
                if (it.errors != null) Toast.makeText(this, it.errors[0], Toast.LENGTH_SHORT).show()
                else {
                    val body = it.body
                    Toast.makeText(this, "Registrasi Device berhasil!", Toast.LENGTH_SHORT).show()
                }
            }

        }
    }
}
package space.dwlhm.gromanis.view.gateway

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.Toast
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import space.dwlhm.gromanis.R
import space.dwlhm.gromanis.model.gateway.RegisterGatewayBody
import space.dwlhm.gromanis.view.menu.MenuActivity
import space.dwlhm.gromanis.viewmodel.gateway.RegisterGatewayViewModel

class RegisterGatewayActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_gateway)

        findViewById<ImageButton>(R.id.btn_menu).setOnClickListener {
            startActivity(Intent(this, MenuActivity::class.java).putExtra("from", "registerGateway"))
        }

        val inputName: EditText = findViewById(R.id.input_gateway_name)
        val inputAddress: EditText = findViewById(R.id.input_gateway_address)
        val btnRegister: Button = findViewById(R.id.btn_new_gateway)
        val registerGatewayViewModel = ViewModelProvider(this)[RegisterGatewayViewModel::class.java]

        btnRegister.setOnClickListener {

            var error = false
            if (inputName.text.trim().isEmpty()) {
                error = true
                inputName.background = getDrawable(R.drawable.bg_input_error)
            } else inputName.background = getDrawable(R.drawable.bg_input)
            if (inputAddress.text.trim().isEmpty()) {
                error = true
                inputAddress.background = getDrawable(R.drawable.bg_input_error)
            } else inputAddress.background = getDrawable(R.drawable.bg_input)

            if (!error) registerGatewayViewModel.doGatewayRegistration(
                this,
                RegisterGatewayBody(
                    inputName.text.toString(),
                    inputAddress.text.toString()
                )
            )!!.observe(this, Observer {
                if (it.errors != null) Toast.makeText(this, it.errors[0], Toast.LENGTH_SHORT).show()
                else {
                    val body = it.body
                    Toast.makeText(this, "Registrasi Gateway berhasil!", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }
}
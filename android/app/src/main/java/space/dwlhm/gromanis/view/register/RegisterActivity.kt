package space.dwlhm.gromanis.view.register

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
import space.dwlhm.gromanis.model.user.RegisterBody
import space.dwlhm.gromanis.view.menu.MenuActivity
import space.dwlhm.gromanis.viewmodel.ProfileActivityViewModel
import space.dwlhm.gromanis.viewmodel.RegisterActivityViewModel

class RegisterActivity : AppCompatActivity() {

    lateinit var registerActivityViewModel: RegisterActivityViewModel
    lateinit var inputName: EditText
    lateinit var inputEmail: EditText
    lateinit var inputPassword: EditText
    lateinit var btnRegister: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        findViewById<ImageButton>(R.id.btn_menu).setOnClickListener {
            startActivity(Intent(this, MenuActivity::class.java).putExtra("from", "register"))
        }

        inputName = findViewById(R.id.register_name)
        inputEmail = findViewById(R.id.register_email)
        inputPassword = findViewById(R.id.register_password)
        btnRegister = findViewById(R.id.btn_register)

        registerActivityViewModel = ViewModelProvider(this)[RegisterActivityViewModel::class.java]

        btnRegister.setOnClickListener {

            var error = false
            if (inputName.text.trim().isEmpty()) {
                error = true
                inputName.background = getDrawable(R.drawable.bg_input_error)
            } else inputName.background = getDrawable(R.drawable.bg_input)

            if (inputEmail.text.trim().isEmpty()) {
                error = true
                inputEmail.background = getDrawable(R.drawable.bg_input_error)
            } else inputEmail.background = getDrawable(R.drawable.bg_input)

            if (inputPassword.text.trim().isEmpty()) {
                error = true
                inputPassword.background = getDrawable(R.drawable.bg_input_error)
            } else inputPassword.background = getDrawable(R.drawable.bg_input)

            if (!error) registerActivityViewModel.doRegistration(
                this,
                RegisterBody(
                    inputName.text.toString(),
                    inputEmail.text.toString(),
                    inputPassword.text.toString()
                )
            )!!.observe(this, Observer {
                if (it.errors != null) Toast.makeText(this, it.errors[0], Toast.LENGTH_LONG).show()
                else {
                    val body = it.body
                    Toast.makeText(this, "Registrasi berhasil!", Toast.LENGTH_LONG).show()
                }
            })
        }
    }
}
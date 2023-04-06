package space.dwlhm.gromanis.view.login

import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import space.dwlhm.gromanis.R
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.view.home.HomeActivity
import space.dwlhm.gromanis.viewmodel.LoginActivityViewModel
import java.util.Base64

class LoginActivity : AppCompatActivity() {

    lateinit var context: Context
    lateinit var prefs: Prefs
    lateinit var loginActivityViewModel: LoginActivityViewModel
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        context = this
        prefs = Prefs(context)
        loginActivityViewModel = ViewModelProvider(this)[LoginActivityViewModel::class.java]

        if (prefs.loginInfoPref != null) {
            startActivity(Intent(context, HomeActivity::class.java))
            overridePendingTransition(0,0)
        }

        findViewById<Button>(R.id.btn_login).setOnClickListener {

            var error = false
            val email: EditText = findViewById(R.id.input_username)
            val password: EditText = findViewById(R.id.input_password)

            if (email.text.toString().trim().isEmpty()) {
                error = true
                email.background = getDrawable(R.drawable.bg_input_error)
            } else {
                email.background = getDrawable(R.drawable.bg_input)
            }
            if (password.text.toString().trim().isEmpty()) {
                error = true
                password.background = getDrawable(R.drawable.bg_input_error)
            } else {
                password.background = getDrawable(R.drawable.bg_input)
            }

            if (!error) loginActivityViewModel.loginUser(
                "Basic " + Base64.getEncoder().encodeToString(
                    (email.text.toString() + ":" + password.text.toString()).toByteArray()
                )
            )!!.observe(this, Observer {
                if (it.errors != null) Toast.makeText(context, it.errors[0], Toast.LENGTH_LONG).show()
                else {
                    val body = it.body
                    prefs.loginInfoPref = body
                    Toast.makeText(context, "Login berhasil!", Toast.LENGTH_LONG).show()
                }


            })
        }
    }
}
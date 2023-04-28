package space.dwlhm.gromanis.view.profile

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.get
import space.dwlhm.gromanis.R
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.repository.user.LogoutRepository
import space.dwlhm.gromanis.view.login.LoginActivity
import space.dwlhm.gromanis.view.menu.MenuActivity
import space.dwlhm.gromanis.viewmodel.ProfileActivityViewModel

class ProfileActivity : AppCompatActivity() {

    lateinit var profileActivityViewModel: ProfileActivityViewModel
    lateinit var txtName: TextView
    lateinit var txtEmail: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        findViewById<ImageButton>(R.id.btn_menu).setOnClickListener {
            startActivity(Intent(this, MenuActivity::class.java).putExtra("from", "profil"))
        }

        txtName = findViewById(R.id.txt_name)
        txtEmail = findViewById(R.id.txt_email)

        profileActivityViewModel = ViewModelProvider(this)[ProfileActivityViewModel::class.java]

        profileActivityViewModel.profileUser(this)!!.observe(this, Observer {

            val body = it.body

            txtName.text = body?.name
            txtEmail.text = body?.email
        })

        findViewById<Button>(R.id.btn_logout).setOnClickListener {

            profileActivityViewModel.doLogout(this)!!.observe(this, Observer {

                val body = it.body

                if (body != null) {
                    val prefs = Prefs(this)
                    prefs.delete()
                    startActivity(Intent(this, LoginActivity::class.java))
                    finish()
                } else Toast.makeText(this, "Logout Gagal! Kesalahan Server", Toast.LENGTH_LONG).show()
            })

        }

    }
}
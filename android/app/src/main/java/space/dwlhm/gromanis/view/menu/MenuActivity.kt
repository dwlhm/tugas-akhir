package space.dwlhm.gromanis.view.menu

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.ImageButton
import space.dwlhm.gromanis.R
import space.dwlhm.gromanis.view.devices.NewDeviceActivity
import space.dwlhm.gromanis.view.gateway.GatewayConfigurationActivity
import space.dwlhm.gromanis.view.gateway.RegisterGatewayActivity
import space.dwlhm.gromanis.view.home.HomeActivity
import space.dwlhm.gromanis.view.profile.ProfileActivity
import space.dwlhm.gromanis.view.register.RegisterActivity

class MenuActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_menu)

        val from = intent.getStringExtra("from")

        findViewById<ImageButton>(R.id.btn_back).setOnClickListener {
            finish()
        }

        findViewById<Button>(R.id.btn_to_home).setOnClickListener {
            if (from == "home") finish()
            else {
                startActivity(Intent(this, HomeActivity::class.java))
                finish()
            }
        }

        findViewById<Button>(R.id.btn_to_profile).setOnClickListener {
            if (from == "profile") finish()
            else {
                startActivity(Intent(this, ProfileActivity::class.java))
                finish()
            }
        }

        findViewById<Button>(R.id.btn_to_register).setOnClickListener {
            if (from == "register") finish()
            else {
                startActivity(Intent(this, RegisterActivity::class.java))
                finish()
            }
        }

        findViewById<Button>(R.id.btn_to_new_gateway).setOnClickListener {
            if (from == "registerGateway") finish()
            else {
                startActivity(Intent(this, RegisterGatewayActivity::class.java))
                finish()
            }
        }

        findViewById<Button>(R.id.btn_to_new_device).setOnClickListener {
            if (from == "registerDevice") finish()
            else {
                startActivity(Intent(this, NewDeviceActivity::class.java))
                finish()
            }
        }

        findViewById<Button>(R.id.btn_to_gateway).setOnClickListener {
            if (from == "gatewayConfiguration") finish()
            else {
                startActivity(Intent(this, GatewayConfigurationActivity::class.java))
                finish()
            }
        }


    }
}
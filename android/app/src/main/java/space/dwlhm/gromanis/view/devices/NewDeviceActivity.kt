package space.dwlhm.gromanis.view.devices

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ImageButton
import space.dwlhm.gromanis.R
import space.dwlhm.gromanis.view.menu.MenuActivity

class NewDeviceActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_new_device)

        findViewById<ImageButton>(R.id.btn_menu).setOnClickListener {
            startActivity(Intent(this, MenuActivity::class.java).putExtra("from", "registerDevice"))
        }
    }
}
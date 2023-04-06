package space.dwlhm.gromanis.preferences

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import space.dwlhm.gromanis.model.user.LoginSetterGetter

class Prefs(context: Context) {

    private val appPref = "gromanisePref"
    private val appPrefLoginInfo = "loginInfoPref"
    private val preferences: SharedPreferences = context.getSharedPreferences(appPref, Context.MODE_PRIVATE)
    private val gson = Gson()

    var loginInfoPref: LoginSetterGetter?
        get() {
            val data = preferences.getString(appPrefLoginInfo, null)
            if (data.isNullOrEmpty()) return null
            return gson.fromJson(data, LoginSetterGetter::class.java)
        }
        set(value) {
            val data = gson.toJson(value).toString()
            return preferences
                    .edit()
                    .putString(appPrefLoginInfo, data)
                    .apply()
        }
}
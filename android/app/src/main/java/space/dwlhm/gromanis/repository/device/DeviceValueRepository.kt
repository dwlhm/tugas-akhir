package space.dwlhm.gromanis.repository.device

import android.content.Context
import android.util.Log
import androidx.lifecycle.MutableLiveData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import space.dwlhm.gromanis.helper.HttpResponse
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.device.DeviceValueSetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.retrofit.RetrofitClient

object DeviceValueRepository {

    private var deviceValueSetterGetter: ServicesSetterGetter<DeviceValueSetterGetter>? = null

    fun getLatestDeviceValue(
        context: Context,
        id: String
    ) : ServicesSetterGetter<DeviceValueSetterGetter>? {

        val prefs = Prefs(context)
        val loginInfo = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.deviceInterface.getLatestDeviceValue(
            "Bearer ${loginInfo.authentication_token}",
            id
        )

        call.enqueue(object : Callback<ServicesSetterGetter<DeviceValueSetterGetter>> {
            override fun onResponse(
                call: Call<ServicesSetterGetter<DeviceValueSetterGetter>>,
                response: Response<ServicesSetterGetter<DeviceValueSetterGetter>>
            ) {
                Log.v("DEBUG : ", response.body().toString())

                if (response.isSuccessful) {
                    val data = response.body()
                    val body = data!!.body
                    val error = null
                    val code = data.code

                    deviceValueSetterGetter = ServicesSetterGetter(
                        code,
                        body,
                        error
                    )
                } else {
                    deviceValueSetterGetter = ServicesSetterGetter(
                        response.code(),
                        null,
                        arrayOf("error server")
                    )
                }
            }

            override fun onFailure(
                call: Call<ServicesSetterGetter<DeviceValueSetterGetter>>,
                t: Throwable
            ) {
                Log.v("DEBUG : ", t.message.toString())
            }

        })

        return deviceValueSetterGetter

    }

}
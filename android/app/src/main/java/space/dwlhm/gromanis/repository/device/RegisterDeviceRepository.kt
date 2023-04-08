package space.dwlhm.gromanis.repository.device

import android.content.Context
import androidx.lifecycle.MutableLiveData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import space.dwlhm.gromanis.helper.HttpResponse
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.device.DeviceSetterGetter
import space.dwlhm.gromanis.model.device.RegisterDeviceBody
import space.dwlhm.gromanis.model.gateway.RegisterGatewayBody
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.retrofit.RetrofitClient

object RegisterDeviceRepository {

    val registerDeviceSetterGetter = MutableLiveData<ServicesSetterGetter<DeviceSetterGetter>>()

    fun doRegistrationDeviceApiCall(
        context: Context,
        body: RegisterDeviceBody
    ) : MutableLiveData<ServicesSetterGetter<DeviceSetterGetter>>? {

        val prefs = Prefs(context)
        val loginInfo = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.deviceInterface.registerDevice(
            "Bearer ${loginInfo.authentication_token}",
            body
        )

        call.enqueue(HttpResponse(registerDeviceSetterGetter))

        return registerDeviceSetterGetter

    }
}
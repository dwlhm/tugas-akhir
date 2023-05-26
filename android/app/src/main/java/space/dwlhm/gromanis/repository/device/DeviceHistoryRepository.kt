package space.dwlhm.gromanis.repository.device

import android.content.Context
import androidx.lifecycle.MutableLiveData
import space.dwlhm.gromanis.helper.HttpResponse
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.device.DeviceHistorySetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.retrofit.RetrofitClient

object DeviceHistoryRepository {

    private val historyDevice = MutableLiveData<ServicesSetterGetter<DeviceHistorySetterGetter>>()

    fun getHistoryDevice(
        context: Context,
        id: String
    ) : MutableLiveData<ServicesSetterGetter<DeviceHistorySetterGetter>>? {

        val prefs = Prefs(context)
        val loginInfo = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.deviceInterface.getHistoryDevice(
            "Bearer ${loginInfo.authentication_token}",
            id
        )

        call.enqueue(HttpResponse(historyDevice))

        return historyDevice
    }
}
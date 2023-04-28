package space.dwlhm.gromanis.repository.device

import android.content.Context
import androidx.lifecycle.MutableLiveData
import space.dwlhm.gromanis.helper.HttpResponse
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.StatusSetterGetter
import space.dwlhm.gromanis.model.device.DeviceProfileSetterGetter
import space.dwlhm.gromanis.model.device.DeviceSetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.retrofit.RetrofitClient

object DeviceConfigurationRepository {

    private val allDevicesSetterGetter = MutableLiveData<ServicesSetterGetter<Array<DeviceSetterGetter>>>()
    private val deviceSetterGetter = MutableLiveData<ServicesSetterGetter<DeviceProfileSetterGetter>>()
    private val deleteDeviceSetterGetter = MutableLiveData<ServicesSetterGetter<StatusSetterGetter>>()

    fun getAllDevicesApiCall(
        context: Context
    ) : MutableLiveData<ServicesSetterGetter<Array<DeviceSetterGetter>>>? {

        val prefs = Prefs(context)
        val loginInfo = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.deviceInterface.getAllDevices(
            "Bearer ${loginInfo.authentication_token}"
        )

        call.enqueue(HttpResponse(allDevicesSetterGetter))

        return allDevicesSetterGetter
    }

    fun getDeviceApiCall(
        context: Context,
        id: String
    ) : MutableLiveData<ServicesSetterGetter<DeviceProfileSetterGetter>>? {

        val prefs = Prefs(context)
        val loginInfo = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.deviceInterface.getDevice(
            "Bearer ${loginInfo.authentication_token}",
            id
        )

        call.enqueue(HttpResponse(deviceSetterGetter))

        return deviceSetterGetter
    }

    fun deleteDeviceApiCall(
        context: Context,
        id: String
    ) : MutableLiveData<ServicesSetterGetter<StatusSetterGetter>>? {

        val prefs = Prefs(context)
        val loginInfo = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.deviceInterface.deleteDevice(
            "Bearer ${loginInfo.authentication_token}",
            id
        )

        call.enqueue(HttpResponse(deleteDeviceSetterGetter))

        return deleteDeviceSetterGetter
    }
}
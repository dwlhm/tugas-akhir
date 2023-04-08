package space.dwlhm.gromanis.viewmodel.device

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.device.DeviceSetterGetter
import space.dwlhm.gromanis.model.device.RegisterDeviceBody
import space.dwlhm.gromanis.repository.device.RegisterDeviceRepository

class RegisterDeviceViewModel : ViewModel() {

    var registerDeviceLiveData: MutableLiveData<ServicesSetterGetter<DeviceSetterGetter>>? = null

    fun doDeviceRegistration(
        context: Context,
        body: RegisterDeviceBody
    ) : LiveData<ServicesSetterGetter<DeviceSetterGetter>>? {
        registerDeviceLiveData = RegisterDeviceRepository.doRegistrationDeviceApiCall(
            context, body
        )
        return registerDeviceLiveData
    }
}
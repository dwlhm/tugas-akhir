package space.dwlhm.gromanis.viewmodel.device

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.StatusSetterGetter
import space.dwlhm.gromanis.model.device.DeviceProfileSetterGetter
import space.dwlhm.gromanis.model.device.DeviceSetterGetter
import space.dwlhm.gromanis.repository.device.DeviceConfigurationRepository

class DeviceConfigurationViewModel : ViewModel() {

    var allDevicesLiveData: MutableLiveData<ServicesSetterGetter<Array<DeviceSetterGetter>>>? = null
    var deviceLiveData: MutableLiveData<ServicesSetterGetter<DeviceProfileSetterGetter>>? = null
    var deleteDeviceLiveData: MutableLiveData<ServicesSetterGetter<StatusSetterGetter>>? = null

    fun getAllDevices(
        context: Context
    ) : LiveData<ServicesSetterGetter<Array<DeviceSetterGetter>>>? {
        allDevicesLiveData = DeviceConfigurationRepository.getAllDevicesApiCall(
            context
        )
        return allDevicesLiveData
    }

    fun getDevice(
        context: Context,
        id: String
    ) : LiveData<ServicesSetterGetter<DeviceProfileSetterGetter>>? {
        deviceLiveData = DeviceConfigurationRepository.getDeviceApiCall(
            context, id
        )
        return deviceLiveData
    }

    fun deleteDevice(
        context: Context,
        id: String
    ) : LiveData<ServicesSetterGetter<StatusSetterGetter>>? {
        deleteDeviceLiveData = DeviceConfigurationRepository.deleteDeviceApiCall(
            context, id
        )
        return deleteDeviceLiveData
    }

}
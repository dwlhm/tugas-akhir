package space.dwlhm.gromanis.viewmodel.device

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.device.DeviceHistorySetterGetter
import space.dwlhm.gromanis.repository.device.DeviceHistoryRepository

class DeviceHistoryViewModel: ViewModel() {

    var historyDeviceLiveData: MutableLiveData<ServicesSetterGetter<DeviceHistorySetterGetter>>? = null

    fun getHistoryDevices(
        context: Context,
        id: String
    ) : LiveData<ServicesSetterGetter<DeviceHistorySetterGetter>>? {
        historyDeviceLiveData = DeviceHistoryRepository.getHistoryDevice(
            context, id
        )

        return historyDeviceLiveData
    }
}
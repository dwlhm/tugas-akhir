package space.dwlhm.gromanis.viewmodel.device

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import kotlinx.coroutines.*
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.device.DeviceValueSetterGetter
import space.dwlhm.gromanis.repository.device.DeviceValueRepository
import java.util.concurrent.TimeUnit

class DeviceValueViewModel : ViewModel() {

    private val _deviceValueViewModel = MutableLiveData<ServicesSetterGetter<DeviceValueSetterGetter>>()
    val deviceValue: LiveData<ServicesSetterGetter<DeviceValueSetterGetter>>
        get() = _deviceValueViewModel

    fun getLatestDeviceValue(
        context: Context,
        id: String
    ) {
        _deviceValueViewModel.postValue(DeviceValueRepository.getLatestDeviceValue(
            context, id
        ))
    }
}
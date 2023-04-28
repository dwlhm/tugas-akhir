package space.dwlhm.gromanis.viewmodel

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.user.RegisterBody
import space.dwlhm.gromanis.model.user.RegisterSetterGetter
import space.dwlhm.gromanis.repository.user.RegisterRepository

class RegisterActivityViewModel : ViewModel() {

    var registerLiveData: MutableLiveData<ServicesSetterGetter<RegisterSetterGetter>>? = null

    fun doRegistration(
        context: Context,
        body: RegisterBody
    ) : LiveData<ServicesSetterGetter<RegisterSetterGetter>>? {
        registerLiveData = RegisterRepository.doRegistrationApiCall(context, body)
        return registerLiveData
    }
}
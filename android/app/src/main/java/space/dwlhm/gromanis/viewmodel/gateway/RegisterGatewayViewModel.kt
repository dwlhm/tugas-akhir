package space.dwlhm.gromanis.viewmodel.gateway

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.gateway.GatewaySetterGetter
import space.dwlhm.gromanis.model.gateway.RegisterGatewayBody
import space.dwlhm.gromanis.repository.gateway.RegisterGatewayRepository

class RegisterGatewayViewModel : ViewModel() {

    var registerGatewayLiveData: MutableLiveData<ServicesSetterGetter<GatewaySetterGetter>>? = null

    fun doGatewayRegistration(
        context: Context,
        body: RegisterGatewayBody
    ) : LiveData<ServicesSetterGetter<GatewaySetterGetter>>? {
        registerGatewayLiveData = RegisterGatewayRepository.doRegistrationApiCall(
            context, body
        )
        return  registerGatewayLiveData
    }
}
package space.dwlhm.gromanis.viewmodel.gateway

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.gateway.MqttGatewaySetterGetter
import space.dwlhm.gromanis.repository.gateway.MqttCredentialsRepository

class MqttGatewayViweModel : ViewModel() {

    var mqttGatewayLiveData: MutableLiveData<ServicesSetterGetter<MqttGatewaySetterGetter>>? = null

    fun getMqttGatewayCredentials(
        context: Context,
        id: String
    ) : LiveData<ServicesSetterGetter<MqttGatewaySetterGetter>>? {
        mqttGatewayLiveData = MqttCredentialsRepository.getMqttGatewayApiCall(
            context, id
        )
        return mqttGatewayLiveData
    }
}
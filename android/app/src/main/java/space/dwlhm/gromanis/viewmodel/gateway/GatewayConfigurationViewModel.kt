package space.dwlhm.gromanis.viewmodel.gateway

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.StatusSetterGetter
import space.dwlhm.gromanis.model.gateway.GatewayProfileSetterGetter
import space.dwlhm.gromanis.model.gateway.GatewaySetterGetter
import space.dwlhm.gromanis.repository.gateway.GatewayRepository

class GatewayConfigurationViewModel : ViewModel() {

    private var allGatewaysLiveData: MutableLiveData<ServicesSetterGetter<Array<GatewaySetterGetter>>> ? = null
    private var gatewayLiveData: MutableLiveData<ServicesSetterGetter<GatewayProfileSetterGetter>>? = null
    private var deleteGatewayLiveData: MutableLiveData<ServicesSetterGetter<StatusSetterGetter>>? = null

    fun getAllGateways(
        context: Context
    ) : LiveData<ServicesSetterGetter<Array<GatewaySetterGetter>>>? {
        allGatewaysLiveData = GatewayRepository.getAllGatewaysApiCall(context)
        return allGatewaysLiveData
    }

    fun getGateway(
        context: Context,
        id: String
    ) : LiveData<ServicesSetterGetter<GatewayProfileSetterGetter>>? {
        gatewayLiveData = GatewayRepository.getGatewayApiCall(context, id)
        return gatewayLiveData
    }

    fun deleteGateway(
        context: Context,
        id: String
    ) : LiveData<ServicesSetterGetter<StatusSetterGetter>>? {
        deleteGatewayLiveData = GatewayRepository.deleteGateway(context, id)
        return deleteGatewayLiveData
    }
}
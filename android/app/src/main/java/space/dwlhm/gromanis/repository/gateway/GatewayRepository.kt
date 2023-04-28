package space.dwlhm.gromanis.repository.gateway

import android.content.Context
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import space.dwlhm.gromanis.helper.HttpResponse
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.StatusSetterGetter
import space.dwlhm.gromanis.model.gateway.GatewayProfileSetterGetter
import space.dwlhm.gromanis.model.gateway.GatewaySetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.retrofit.RetrofitClient

object GatewayRepository {

    private val allGatewaySetterGetter = MutableLiveData<ServicesSetterGetter<Array<GatewaySetterGetter>>>()
    val gatewaySetterGetter = MutableLiveData<ServicesSetterGetter<GatewayProfileSetterGetter>>()
    val deleteGatewaySetterGetter = MutableLiveData<ServicesSetterGetter<StatusSetterGetter>>()

    fun getAllGatewaysApiCall(
        context: Context
    ): MutableLiveData<ServicesSetterGetter<Array<GatewaySetterGetter>>>? {

        val prefs = Prefs(context)
        val loginPrefs = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.gatewayInterace.getAllGateway(
            "Bearer ${loginPrefs.authentication_token}"
        )

        call.enqueue(HttpResponse(allGatewaySetterGetter))

        return allGatewaySetterGetter
    }

    fun getGatewayApiCall(
        context: Context,
        gatewayId: String
    ): MutableLiveData<ServicesSetterGetter<GatewayProfileSetterGetter>>? {

        val prefs = Prefs(context)
        val loginPrefs = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.gatewayInterace.getGateway(
            "Bearer ${loginPrefs.authentication_token}",
            gatewayId
        )

        call.enqueue(HttpResponse(gatewaySetterGetter))

        return gatewaySetterGetter
    }

    fun deleteGateway(
        context: Context,
        id: String
    ): MutableLiveData<ServicesSetterGetter<StatusSetterGetter>>? {
        val prefs = Prefs(context)
        val loginPrefs = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.gatewayInterace.deleteGateway(
            "Bearer ${loginPrefs.authentication_token}",
            id
        )

        call.enqueue(HttpResponse(deleteGatewaySetterGetter))

        return deleteGatewaySetterGetter
    }
}
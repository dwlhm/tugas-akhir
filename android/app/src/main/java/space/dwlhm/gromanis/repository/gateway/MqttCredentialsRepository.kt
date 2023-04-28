package space.dwlhm.gromanis.repository.gateway

import android.content.Context
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.gateway.MqttGatewaySetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.retrofit.RetrofitClient

object MqttCredentialsRepository {

    val mqttGatewaySetterGetter = MutableLiveData<ServicesSetterGetter<MqttGatewaySetterGetter>>()

    fun getMqttGatewayApiCall(
        context: Context,
        id: String
    ): MutableLiveData<ServicesSetterGetter<MqttGatewaySetterGetter>>? {

        val prefs = Prefs(context)
        val loginInfo = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.gatewayInterace.getMqttGateway(
            "Bearer ${loginInfo.authentication_token}",
            id
        )

        call.enqueue(object : Callback<ServicesSetterGetter<MqttGatewaySetterGetter>> {
            override fun onResponse(
                call: Call<ServicesSetterGetter<MqttGatewaySetterGetter>>,
                response: Response<ServicesSetterGetter<MqttGatewaySetterGetter>>
            ) {

                Log.v("DEBUG : ", response.body().toString())

                if (response.isSuccessful) {
                    val data = response.body()
                    val body = data!!.body
                    val error = null
                    val code = data.code

                    mqttGatewaySetterGetter.value = ServicesSetterGetter(
                        code,
                        body,
                        error
                    )
                } else {
                    mqttGatewaySetterGetter.value = ServicesSetterGetter(
                        response.code(),
                        null,
                        arrayOf("error server")
                    )
                }
            }

            override fun onFailure(
                call: Call<ServicesSetterGetter<MqttGatewaySetterGetter>>,
                t: Throwable
            ) {
                Log.v("DEBUG : ", t.message.toString())
            }

        })

        return mqttGatewaySetterGetter
    }
}
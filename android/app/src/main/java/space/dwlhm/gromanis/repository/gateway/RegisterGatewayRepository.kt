package space.dwlhm.gromanis.repository.gateway

import android.content.Context
import android.util.Log
import androidx.lifecycle.MutableLiveData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.gateway.GatewaySetterGetter
import space.dwlhm.gromanis.model.gateway.RegisterGatewayBody
import space.dwlhm.gromanis.model.user.RegisterBody
import space.dwlhm.gromanis.model.user.RegisterSetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.retrofit.RetrofitClient

object RegisterGatewayRepository {

    val registerGatewaySetterGetter = MutableLiveData<ServicesSetterGetter<GatewaySetterGetter>>()

    fun doRegistrationApiCall(
        context: Context,
        body: RegisterGatewayBody
    ): MutableLiveData<ServicesSetterGetter<GatewaySetterGetter>>? {

        val prefs = Prefs(context)
        val loginPrefs = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.gatewayInterace.registerGateway(
            "Bearer ${loginPrefs.authentication_token}",
            body
        )

        call.enqueue(object : Callback<ServicesSetterGetter<GatewaySetterGetter>> {
            override fun onResponse(
                call: Call<ServicesSetterGetter<GatewaySetterGetter>>,
                response: Response<ServicesSetterGetter<GatewaySetterGetter>>
            ) {

                Log.v("DEBUG : ", response.body().toString())

                if (response.isSuccessful) {
                    val data = response.body()
                    val body = data!!.body
                    val error = null
                    val code = data.code

                    registerGatewaySetterGetter.value = ServicesSetterGetter(
                        code,
                        body,
                        error
                    )
                } else {
                    registerGatewaySetterGetter.value = ServicesSetterGetter(
                        response.code(),
                        null,
                        arrayOf("error server")
                    )
                }

            }

            override fun onFailure(
                call: Call<ServicesSetterGetter<GatewaySetterGetter>>,
                t: Throwable
            ) {
                Log.v("DEBUG : ", t.message.toString())
            }

        })

        return registerGatewaySetterGetter
    }
}
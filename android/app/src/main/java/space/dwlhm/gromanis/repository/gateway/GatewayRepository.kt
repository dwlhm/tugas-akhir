package space.dwlhm.gromanis.repository.gateway

import android.content.Context
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.StatusSetterGetter
import space.dwlhm.gromanis.model.gateway.GatewaySetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.retrofit.RetrofitClient

object GatewayRepository {

    val allGatewaySetterGetter = MutableLiveData<ServicesSetterGetter<Array<GatewaySetterGetter>>>()
    val gatewaySetterGetter = MutableLiveData<ServicesSetterGetter<GatewaySetterGetter>>()
    val deleteGatewaySetterGetter = MutableLiveData<ServicesSetterGetter<StatusSetterGetter>>()

    fun getAllGatewaysApiCall(
        context: Context
    ): MutableLiveData<ServicesSetterGetter<Array<GatewaySetterGetter>>>? {

        val prefs = Prefs(context)
        val loginPrefs = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.gatewayInterace.getAllGateway(
            "Bearer ${loginPrefs.authentication_token}"
        )

        call.enqueue(object : Callback<ServicesSetterGetter<Array<GatewaySetterGetter>>> {
            override fun onResponse(
                call: Call<ServicesSetterGetter<Array<GatewaySetterGetter>>>,
                response: Response<ServicesSetterGetter<Array<GatewaySetterGetter>>>
            ) {

                Log.v("DEBUG : ", response.body().toString())

                if (response.isSuccessful) {
                    val data = response.body()
                    val body = data!!.body
                    val error = null
                    val code = data.code

                    allGatewaySetterGetter.value = ServicesSetterGetter(
                        code,
                        body,
                        error
                    )
                } else {
                    allGatewaySetterGetter.value = ServicesSetterGetter(
                        response.code(),
                        null,
                        arrayOf("error server")
                    )
                }
            }

            override fun onFailure(
                call: Call<ServicesSetterGetter<Array<GatewaySetterGetter>>>,
                t: Throwable
            ) {
                Log.v("DEBUG : ", t.message.toString())
            }

        })

        return allGatewaySetterGetter
    }

    fun getGatewayApiCall(
        context: Context,
        gatewayId: String
    ): MutableLiveData<ServicesSetterGetter<GatewaySetterGetter>>? {

        val prefs = Prefs(context)
        val loginPrefs = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.gatewayInterace.getGateway(
            "Bearer ${loginPrefs.authentication_token}",
            gatewayId
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

                    gatewaySetterGetter.value = ServicesSetterGetter(
                        code,
                        body,
                        error
                    )
                } else {
                    gatewaySetterGetter.value = ServicesSetterGetter(
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

        call.enqueue(object : Callback<ServicesSetterGetter<StatusSetterGetter>> {
            override fun onResponse(
                call: Call<ServicesSetterGetter<StatusSetterGetter>>,
                response: Response<ServicesSetterGetter<StatusSetterGetter>>
            ) {
                Log.v("DEBUG : ", response.body().toString())

                if (response.isSuccessful) {
                    val data = response.body()
                    val body = data!!.body
                    val error = null
                    val code = data.code

                    deleteGatewaySetterGetter.value = ServicesSetterGetter(
                        code,
                        body,
                        error
                    )
                } else {
                    deleteGatewaySetterGetter.value = ServicesSetterGetter(
                        response.code(),
                        null,
                        arrayOf("error server")
                    )
                }
            }

            override fun onFailure(
                call: Call<ServicesSetterGetter<StatusSetterGetter>>,
                t: Throwable
            ) {
                Log.v("DEBUG : ", t.message.toString())
            }

        })

        return deleteGatewaySetterGetter
    }
}
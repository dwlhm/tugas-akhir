package space.dwlhm.gromanis.repository.user

import android.content.Context
import android.util.Log
import androidx.lifecycle.MutableLiveData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.user.RegisterBody
import space.dwlhm.gromanis.model.user.RegisterSetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.retrofit.RetrofitClient

object RegisterRepository {

    val registerSetterGetter = MutableLiveData<ServicesSetterGetter<RegisterSetterGetter>>()

    fun doRegistrationApiCall(
        context: Context,
        body: RegisterBody
    ): MutableLiveData<ServicesSetterGetter<RegisterSetterGetter>>? {

        val prefs = Prefs(context)
        val loginPrefs = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.userInterface.postRegister(
            "Bearer ${loginPrefs.authentication_token}",
            body
        )

        call.enqueue(object : Callback<ServicesSetterGetter<RegisterSetterGetter>> {
            override fun onResponse(
                call: Call<ServicesSetterGetter<RegisterSetterGetter>>,
                response: Response<ServicesSetterGetter<RegisterSetterGetter>>
            ) {

                Log.v("DEBUG : ", response.body().toString())

                if (response.isSuccessful) {
                    val data = response.body()
                    val body = data!!.body
                    val error = null
                    val code = data.code

                    registerSetterGetter.value = ServicesSetterGetter(
                        code,
                        body,
                        error
                    )
                } else {
                    registerSetterGetter.value = ServicesSetterGetter(
                        response.code(),
                        null,
                        arrayOf("error server")
                    )
                }

            }

            override fun onFailure(
                call: Call<ServicesSetterGetter<RegisterSetterGetter>>,
                t: Throwable
            ) {
                Log.v("DEBUG : ", t.message.toString())
            }

        })

        return registerSetterGetter
    }
}
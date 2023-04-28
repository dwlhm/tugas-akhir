package space.dwlhm.gromanis.repository.user

import android.content.Context
import android.util.Log
import androidx.lifecycle.MutableLiveData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.StatusSetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.retrofit.RetrofitClient

object LogoutRepository {

    val userLogoutSetterGetter = MutableLiveData<ServicesSetterGetter<StatusSetterGetter>>()

    fun postUserLogoutApiCall(
        context: Context
    ): MutableLiveData<ServicesSetterGetter<StatusSetterGetter>>? {

        val prefs = Prefs(context)
        val loginPref = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.userInterface.postLogout("Bearer ${loginPref.authentication_token}")

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

                    userLogoutSetterGetter.value = ServicesSetterGetter(
                        code,
                        body,
                        error
                    )
                } else {
                    userLogoutSetterGetter.value = ServicesSetterGetter(
                        response.code(),
                        null,
                        arrayOf("account email/password not match")
                    )
                }
            }

            override fun onFailure(
                call: Call<ServicesSetterGetter<StatusSetterGetter>>,
                t: Throwable
            ) {
                Log.v("DEBUG ERROR: ", t.message.toString())
            }

        })

        return userLogoutSetterGetter
    }
}
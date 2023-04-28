package space.dwlhm.gromanis.repository.user

import android.content.Context
import android.util.Log
import androidx.lifecycle.MutableLiveData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.user.ProfilSetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.retrofit.RetrofitClient

object ProfileRepository {

    val userProfileSetterGetter = MutableLiveData<ServicesSetterGetter<ProfilSetterGetter>>()

    fun getUserProfileApiCall(
        context: Context
    ): MutableLiveData<ServicesSetterGetter<ProfilSetterGetter>>? {
        val prefs = Prefs(context)
        val loginPref = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.userInterface.getProfil("Bearer ${loginPref.authentication_token}")

        call.enqueue(object : Callback<ServicesSetterGetter<ProfilSetterGetter>> {
            override fun onResponse(
                call: Call<ServicesSetterGetter<ProfilSetterGetter>>,
                response: Response<ServicesSetterGetter<ProfilSetterGetter>>
            ) {

                Log.v("DEBUG : ", response.body().toString())

                if (response.isSuccessful) {
                    val data = response.body()
                    val body = data!!.body
                    val error = null
                    val code = data.code

                    userProfileSetterGetter.value = ServicesSetterGetter(
                        code,
                        body,
                        error
                    )
                } else {
                    userProfileSetterGetter.value = ServicesSetterGetter(
                        response.code(),
                        null,
                        arrayOf("cannot get the account profile")
                    )
                }

            }

            override fun onFailure(
                call: Call<ServicesSetterGetter<ProfilSetterGetter>>,
                t: Throwable
            ) {
                Log.v("DEBUG : ", t.message.toString())
            }

        })

        return userProfileSetterGetter
    }
}
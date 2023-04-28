package space.dwlhm.gromanis.repository.user

import android.content.Context
import android.util.Log
import androidx.lifecycle.MutableLiveData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.user.LoginSetterGetter
import space.dwlhm.gromanis.model.user.ProfilSetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.retrofit.RetrofitClient

object LoginRepository {

    val userLoginSetterGetter = MutableLiveData<ServicesSetterGetter<LoginSetterGetter>>()

    fun postUserLoginApiCall(
        authorization: String
    ): MutableLiveData<ServicesSetterGetter<LoginSetterGetter>> {

        val call = RetrofitClient.userInterface.postLogin(authorization)

        call.enqueue(object : Callback<ServicesSetterGetter<LoginSetterGetter>> {
            override fun onResponse(
                call: Call<ServicesSetterGetter<LoginSetterGetter>>,
                response: Response<ServicesSetterGetter<LoginSetterGetter>>
            ) {

                Log.v("DEBUG : ", response.body().toString())

                if (response.isSuccessful) {
                    val data = response.body()
                    val body = data!!.body
                    val error = null
                    val code = data.code

                    userLoginSetterGetter.value = ServicesSetterGetter(
                        code,
                        body,
                        error
                    )
                } else {
                    userLoginSetterGetter.value = ServicesSetterGetter(
                        response.code(),
                        null,
                        arrayOf("account email/password not match")
                    )
                }
            }

            override fun onFailure(
                call: Call<ServicesSetterGetter<LoginSetterGetter>>,
                t: Throwable
            ) {
                Log.v("DEBUG ERROR: ", t.message.toString())
            }

        })

        return userLoginSetterGetter
    }

}
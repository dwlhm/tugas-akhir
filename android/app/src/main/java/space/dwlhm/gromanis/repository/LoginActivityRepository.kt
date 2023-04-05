package space.dwlhm.gromanis.repository

import android.content.Context
import android.util.Log
import android.widget.Toast
import androidx.lifecycle.MutableLiveData
import com.google.gson.Gson
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.user.LoginSetterGetter
import space.dwlhm.gromanis.model.user.ProfilSetterGetter
import space.dwlhm.gromanis.preferences.Prefs
import space.dwlhm.gromanis.retrofit.RetrofitClient

object LoginActivityRepository {

    val userProfilSetterGetter = MutableLiveData<ServicesSetterGetter<ProfilSetterGetter>>()
    val userLoginSetterGetter = MutableLiveData<ServicesSetterGetter<LoginSetterGetter>>()

    fun getUserProfilApiCall(
        context: Context
        ): MutableLiveData<ServicesSetterGetter<ProfilSetterGetter>>? {
        val prefs = Prefs(context)
        val loginPref = prefs.loginInfoPref ?: return null

        val call = RetrofitClient.userInterface.getProfil(loginPref.authentication_token)

        call.enqueue(object : Callback<ServicesSetterGetter<ProfilSetterGetter>> {
            override fun onResponse(
                call: Call<ServicesSetterGetter<ProfilSetterGetter>>,
                response: Response<ServicesSetterGetter<ProfilSetterGetter>>
            ) {

                Log.v("DEBUG : ", response.body().toString())

                val data = response.body()
                val code = data!!.code
                val body = data.body
                val error = data.errors

                userProfilSetterGetter.value = ServicesSetterGetter(
                    code,
                    body,
                    error
                )

            }

            override fun onFailure(
                call: Call<ServicesSetterGetter<ProfilSetterGetter>>,
                t: Throwable
            ) {
                Log.v("DEBUG : ", t.message.toString())
            }

        })

        return userProfilSetterGetter
    }


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
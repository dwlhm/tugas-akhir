package space.dwlhm.gromanis.repository

import android.util.Log
import androidx.lifecycle.MutableLiveData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.user.LoginSetterGetter
import space.dwlhm.gromanis.model.user.ProfilSetterGetter
import space.dwlhm.gromanis.retrofit.RetrofitClient

object LoginActivityRepository {

    val userProfilSetterGetter = MutableLiveData<ServicesSetterGetter<ProfilSetterGetter>>()
    val userLoginSetterGetter = MutableLiveData<ServicesSetterGetter<LoginSetterGetter>>()

    fun getUserProfilApiCall(): MutableLiveData<ServicesSetterGetter<ProfilSetterGetter>> {

        val call = RetrofitClient.userInterface.getProfil()

        call.enqueue(object : Callback<ServicesSetterGetter<ProfilSetterGetter>> {
            override fun onResponse(
                call: Call<ServicesSetterGetter<ProfilSetterGetter>>,
                response: Response<ServicesSetterGetter<ProfilSetterGetter>>
            ) {

                Log.v("DEBUG : ", response.body().toString())

                val data = response.body()
                val code = data!!.code
                val body = data.body
                val error = data.error

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


    fun postUserLoginApiCall(): MutableLiveData<ServicesSetterGetter<LoginSetterGetter>> {

        val call = RetrofitClient.userInterface.postLogin()

        call.enqueue(object : Callback<ServicesSetterGetter<LoginSetterGetter>> {
            override fun onResponse(
                call: Call<ServicesSetterGetter<LoginSetterGetter>>,
                response: Response<ServicesSetterGetter<LoginSetterGetter>>
            ) {

                Log.v("DEBUG : ", response.body().toString())

                val data = response.body()
                val code = data!!.code
                val body = data.body
                val error = data.error

                userLoginSetterGetter.value = ServicesSetterGetter(
                    code,
                    body,
                    error
                )

            }

            override fun onFailure(
                call: Call<ServicesSetterGetter<LoginSetterGetter>>,
                t: Throwable
            ) {
                Log.v("DEBUG : ", t.message.toString())
            }

        })

        return userLoginSetterGetter
    }

}
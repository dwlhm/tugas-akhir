package space.dwlhm.gromanis.helper

import android.util.Log
import androidx.lifecycle.MutableLiveData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.repository.gateway.RegisterGatewayRepository

class HttpResponse<T>(
    private val setterGetter: MutableLiveData<ServicesSetterGetter<T>>
) : Callback<ServicesSetterGetter<T>> {
    override fun onResponse(
        call: Call<ServicesSetterGetter<T>>,
        response: Response<ServicesSetterGetter<T>>
    ) {
        Log.v("DEBUG : ", response.body().toString())

        if (response.isSuccessful) {
            val data = response.body()
            val body = data!!.body
            val error = null
            val code = data.code

            setterGetter.value = ServicesSetterGetter(
                code,
                body,
                error
            )
        } else {
            setterGetter.value = ServicesSetterGetter(
                response.code(),
                null,
                arrayOf("error server")
            )
        }
    }

    override fun onFailure(call: Call<ServicesSetterGetter<T>>, t: Throwable) {
        Log.v("DEBUG : ", t.message.toString())
    }

}
package space.dwlhm.gromanis.retrofit.`interface`

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.StatusSetterGetter
import space.dwlhm.gromanis.model.user.LoginSetterGetter
import space.dwlhm.gromanis.model.user.ProfilSetterGetter
import space.dwlhm.gromanis.model.user.RegisterBody
import space.dwlhm.gromanis.model.user.RegisterSetterGetter

interface UserInterface {

    @GET("/user")
    fun getProfil(
        @Header("authorization") authorization: String
    ) : Call<ServicesSetterGetter<ProfilSetterGetter>>

    @POST("/user/login")
    fun postLogin(
        @Header("authorization") authorization: String
    ) : Call<ServicesSetterGetter<LoginSetterGetter>>

    @POST("/user/logout")
    fun postLogout(
        @Header("authorization") authorization: String
    ) : Call<ServicesSetterGetter<StatusSetterGetter>>

    @POST("/user/register")
    fun postRegister(
        @Header("authorization")authorization: String,
        @Body body: RegisterBody
    ) : Call<ServicesSetterGetter<RegisterSetterGetter>>
}
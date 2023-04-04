package space.dwlhm.gromanis.retrofit.`interface`

import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.POST
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.StatusSetterGetter
import space.dwlhm.gromanis.model.user.LoginSetterGetter
import space.dwlhm.gromanis.model.user.ProfilSetterGetter
import space.dwlhm.gromanis.model.user.RegisterSetterGetter

interface UserInterface {

    @GET("/user")
    fun getProfil() : Call<ServicesSetterGetter<ProfilSetterGetter>>

    @POST("/user/login")
    fun postLogin() : Call<ServicesSetterGetter<LoginSetterGetter>>

    @POST("/user/logout")
    fun postLogout() : Call<ServicesSetterGetter<StatusSetterGetter>>

    @POST("/user/register")
    fun postRegister() : Call<ServicesSetterGetter<RegisterSetterGetter>>
}
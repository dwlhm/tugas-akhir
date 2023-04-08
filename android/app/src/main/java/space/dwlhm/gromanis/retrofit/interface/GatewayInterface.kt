package space.dwlhm.gromanis.retrofit.`interface`

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.StatusSetterGetter
import space.dwlhm.gromanis.model.gateway.RegisterGatewayBody
import space.dwlhm.gromanis.model.gateway.GatewaySetterGetter
import space.dwlhm.gromanis.model.gateway.MqttGatewaySetterGetter

interface GatewayInterface {

    @POST("/gateway")
    fun registerGateway(
        @Header("authorization") authorization: String,
        @Body body: RegisterGatewayBody
    ) : Call<ServicesSetterGetter<GatewaySetterGetter>>

    @GET("/gateway/{id}")
    fun getGateway(
        @Header("authorization") authorization: String,
        @Path("id") id: String
    ) : Call<ServicesSetterGetter<GatewaySetterGetter>>

    @GET("/gateway/{id}/mqtt")
    fun getMqttGateway(
        @Header("authorization") authorization: String,
        @Path("id") id: String
    ) : Call<ServicesSetterGetter<MqttGatewaySetterGetter>>

    @GET("/gateway")
    fun getAllGateway(
        @Header("authorization") authorization: String
    ) : Call<ServicesSetterGetter<Array<GatewaySetterGetter>>>

    @DELETE("/gateway/{id}")
    fun deleteGateway(
        @Header("authorization") authorization: String,
        @Path("id") id: String
    ) : Call<ServicesSetterGetter<StatusSetterGetter>>

}
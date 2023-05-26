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
import space.dwlhm.gromanis.model.device.*
import space.dwlhm.gromanis.model.gateway.RegisterGatewayBody

interface DeviceInterface {

    @POST("/device")
    fun registerDevice(
        @Header("authorization") authorization: String,
        @Body body: RegisterDeviceBody
    ) : Call<ServicesSetterGetter<DeviceSetterGetter>>

    @GET("/device")
    fun getAllDevices(
        @Header("authorization") authorization: String
    ) : Call<ServicesSetterGetter<Array<DeviceSetterGetter>>>

    @GET("/device/{id}")
    fun getDevice(
        @Header("authorization") authorization: String,
        @Path("id") id: String
    ) : Call<ServicesSetterGetter<DeviceProfileSetterGetter>>

    @DELETE("/device/{id}")
    fun deleteDevice(
        @Header("authorization") authorization: String,
        @Path("id") id: String
    ) : Call<ServicesSetterGetter<StatusSetterGetter>>

    @GET("/device/{id}/la")
    fun getLatestDeviceValue(
        @Header("authorization") authorization: String,
        @Path("id") id: String
    ) : Call<ServicesSetterGetter<DeviceValueSetterGetter>>

    @GET("/device/{id}/history")
    fun getHistoryDevice(
        @Header("authorization") authorization: String,
        @Path("id") id: String
    ) : Call<ServicesSetterGetter<DeviceHistorySetterGetter>>

}
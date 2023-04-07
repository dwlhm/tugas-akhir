package space.dwlhm.gromanis.retrofit

import com.google.gson.Gson
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import okhttp3.logging.HttpLoggingInterceptor.Level
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import space.dwlhm.gromanis.BuildConfig
import space.dwlhm.gromanis.Config
import space.dwlhm.gromanis.retrofit.`interface`.GatewayInterface
import space.dwlhm.gromanis.retrofit.`interface`.UserInterface

object RetrofitClient {

    const val MainServer = Config.HTTP_BASE_URL

    val retrofitClient: Retrofit.Builder by lazy {

        val levelType: Level
        if (BuildConfig.BUILD_TYPE.contentEquals("debug"))
            levelType = Level.BODY else levelType = Level.NONE

        val logging = HttpLoggingInterceptor()
        logging.setLevel(levelType)

        val okHttpClient = OkHttpClient.Builder()
        okHttpClient.addInterceptor(logging)

        Retrofit.Builder()
            .baseUrl(MainServer)
            .client(okHttpClient.build())
            .addConverterFactory(GsonConverterFactory.create())
    }

    val userInterface: UserInterface by lazy {
        retrofitClient
            .build()
            .create(UserInterface::class.java)
    }

    val gatewayInterace: GatewayInterface by lazy {
        retrofitClient
            .build()
            .create(GatewayInterface::class.java)
    }
}
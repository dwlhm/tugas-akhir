package space.dwlhm.gromanis.model

data class ServicesSetterGetter<T>(
    val code: Int,
    val body: T? = null,
    val errors: Array<String>? = null

)

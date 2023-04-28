package space.dwlhm.gromanis.model.gateway

data class GatewaySetterGetter(
    val isOnline: Boolean,
    val name: String,
    val address: String,
    val id: String,
    val maintainer: Int,
    val createdAt: String
)
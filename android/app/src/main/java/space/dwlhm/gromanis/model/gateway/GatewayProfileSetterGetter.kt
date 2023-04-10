package space.dwlhm.gromanis.model.gateway

import space.dwlhm.gromanis.model.user.ProfilSetterGetter

data class GatewayProfileSetterGetter(
    val isOnline: Boolean,
    val name: String,
    val address: String,
    val id: String,
    val maintainer: Int,
    val createdAt: String,
    val user: ProfilSetterGetter
)

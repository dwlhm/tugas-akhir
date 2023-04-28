package space.dwlhm.gromanis.model.device

import space.dwlhm.gromanis.model.user.ProfilSetterGetter

data class DeviceProfileSetterGetter(
    val name: String,
    val address: String,
    val gateway_id: String,
    val maintainer: Int,
    val id: String,
    val createdAt: String,
    val user: ProfilSetterGetter
)

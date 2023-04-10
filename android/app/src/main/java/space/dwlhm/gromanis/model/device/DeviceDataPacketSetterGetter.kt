package space.dwlhm.gromanis.model.device

data class DeviceDataPacketSetterGetter(
    val gateway_timestamp: String,
    val device: DeviceDataValueSetterGetter
)

package space.dwlhm.gromanis.model.device

data class RegisterDeviceBody(
    val name: String,
    val address: String,
    val gateway_id: String
)

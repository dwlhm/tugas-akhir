package space.dwlhm.gromanis.model.gateway

data class MqttGatewaySetterGetter(
    val credential: Array<String>,
    val topic_data: String,
    val topic_action: String,
    val gateway_id: String,
    val createdAt: String,
    val updatedAt: String
)

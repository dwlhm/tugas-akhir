package space.dwlhm.gromanis.model.user

data class RegisterBody(
    val name: String,
    val email: String,
    val password: String
)
package space.dwlhm.gromanis.model.device

data class DeviceHistorySetterGetter(
    val id: String,
    val list: Array<String>
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as DeviceHistorySetterGetter

        if (id != other.id) return false
        if (!list.contentEquals(other.list)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + list.contentHashCode()
        return result
    }
}
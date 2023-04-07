package space.dwlhm.gromanis.viewmodel

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.StatusSetterGetter
import space.dwlhm.gromanis.model.user.ProfilSetterGetter
import space.dwlhm.gromanis.repository.user.LogoutRepository
import space.dwlhm.gromanis.repository.user.ProfileRepository

class ProfileActivityViewModel : ViewModel() {

    var profileLiveData: MutableLiveData<ServicesSetterGetter<ProfilSetterGetter>>? = null
    var logoutLiveData: MutableLiveData<ServicesSetterGetter<StatusSetterGetter>>? = null

    fun profileUser(
        context: Context
    ): LiveData<ServicesSetterGetter<ProfilSetterGetter>>? {
        profileLiveData = ProfileRepository.getUserProfileApiCall(context)
        return profileLiveData
    }

    fun doLogout(
        context: Context
    ) : LiveData<ServicesSetterGetter<StatusSetterGetter>>? {
        logoutLiveData = LogoutRepository.postUserLogoutApiCall(context)
        return logoutLiveData
    }
}
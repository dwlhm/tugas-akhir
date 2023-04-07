package space.dwlhm.gromanis.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import space.dwlhm.gromanis.model.ServicesSetterGetter
import space.dwlhm.gromanis.model.user.LoginSetterGetter
import space.dwlhm.gromanis.repository.user.LoginRepository

class LoginActivityViewModel : ViewModel() {

    var loginLiveData: MutableLiveData<ServicesSetterGetter<LoginSetterGetter>>? = null
    fun loginUser(
        authorization: String
    ) : LiveData<ServicesSetterGetter<LoginSetterGetter>>? {
        loginLiveData = LoginRepository.postUserLoginApiCall(authorization)
        return loginLiveData
    }

}
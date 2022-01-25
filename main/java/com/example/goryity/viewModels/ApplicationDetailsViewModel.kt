package com.example.goryity.viewModels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.goryity.api.Repository
import com.example.goryity.models.TripApplication
import kotlinx.coroutines.launch

class ApplicationDetailsViewModel(private val repository: Repository) : ViewModel() {
    private val _application = MutableLiveData<TripApplication?>()
    val application: LiveData<TripApplication?> = _application

    private val _patchResult = MutableLiveData<Int>()
    val patchResult: LiveData<Int> = _patchResult


    fun getApplication(id: Int) {
        viewModelScope.launch {
            _application.value = repository.getApplication(id)
        }

    }

    fun patchApplicationAccept(id: Int) {
        viewModelScope.launch {
            _patchResult.value = repository.patchApplicationAccept(id)
        }
    }

    fun patchApplicationReject(id: Int, comment: String) {
        viewModelScope.launch {
            _patchResult.value = repository.patchApplicationReject(id, comment)
        }

    }

}
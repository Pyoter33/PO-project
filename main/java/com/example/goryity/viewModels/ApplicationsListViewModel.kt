package com.example.goryity.viewModels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.goryity.api.Repository
import com.example.goryity.models.TripApplicationListItem
import kotlinx.coroutines.launch

class ApplicationsListViewModel(private val repository: Repository) : ViewModel() {

    private val _list = MutableLiveData<List<TripApplicationListItem>?>()
    val list: LiveData<List<TripApplicationListItem>?> = _list

    fun getList() {
        viewModelScope.launch {
            _list.value = repository.getApplicationsList()
        }
    }

}
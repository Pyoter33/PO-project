package com.example.goryity.viewModels

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.goryity.models.*
import android.location.Location
import com.example.goryity.api.Repository

//TODO add constants
class SharedViewModel() : ViewModel() {
    private val _firstPoint = MutableLiveData<Point?>()
    val firstPoint: LiveData<Point?> = _firstPoint

    private val _secondPoint = MutableLiveData<Point?>()
    val secondPoint: LiveData<Point?> = _secondPoint

    fun setFirstPoint(point: Point?) {
        _firstPoint.value = point
    }

    fun setSecondPoint(point: Point?) {
        _secondPoint.value = point
    }


}
package com.example.goryity.viewModels

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.goryity.models.*
import android.location.Location

//TODO add constants
class StretchCreatorViewModel : ViewModel() {
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

    fun countSummary(): Triple<Double, Double, Int> {
        val startPoint = Location("firstPoint")
        startPoint.latitude = firstPoint.value!!.geoData.latitude
        startPoint.longitude = firstPoint.value!!.geoData.longitude

        val endPoint = Location("secondPoint")
        endPoint.latitude = secondPoint.value!!.geoData.latitude
        endPoint.longitude = secondPoint.value!!.geoData.longitude

        val length = startPoint.distanceTo(endPoint).toDouble()

        val elevation = secondPoint.value!!.geoData.altitude - firstPoint.value!!.geoData.altitude

        val lengthExtraPoint = if (length % 1000 > 500) 1 else 0
        val elevationExtraPoint = if (elevation % 100 > 50) 1 else 0

        var elevationPoints = 0.0
        if(elevation > 0)
            elevationPoints = elevation / 100 + elevationExtraPoint

        val points = length / 1000 + lengthExtraPoint + elevationPoints

        return Triple(length, elevation, points.toInt())
    }
}
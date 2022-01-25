package com.example.goryity.viewModels

import android.location.Location
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.goryity.api.Repository
import com.example.goryity.models.Point
import com.example.goryity.models.Stretch
import kotlinx.coroutines.launch

class StretchCreatorViewModel(private val repository: Repository): ViewModel() {

    private companion object {
        const val LENGTH_DIVIDER = 1000
        const val LENGTH_BORDER_VALUE = 500
        const val ELEVATION_DIVIDER = 100
        const val ELEVATION_BORDER_VALUE = 50
    }
    private val _postResult = MutableLiveData(0)
    val postResult: LiveData<Int> = _postResult

    fun resetPostResult(){
        _postResult.value = 0
    }

    fun postStretch(stretch: Stretch) {
        viewModelScope.launch {
            _postResult.value = repository.postStretch(stretch)
        }
    }

    fun countSummary(firstPoint: Point, secondPoint: Point): Triple<Double, Double, Int> {
        val startPoint = Location("firstPoint")
        startPoint.latitude = firstPoint.geoData.latitude
        startPoint.longitude = firstPoint.geoData.longitude

        val endPoint = Location("secondPoint")
        endPoint.latitude = secondPoint.geoData.latitude
        endPoint.longitude = secondPoint.geoData.longitude

        val length = startPoint.distanceTo(endPoint).toDouble()

        val elevation = secondPoint.geoData.altitude - firstPoint.geoData.altitude

        val lengthExtraPoint = if (length % LENGTH_DIVIDER > LENGTH_BORDER_VALUE) 1 else 0
        val elevationExtraPoint = if (elevation % ELEVATION_DIVIDER > ELEVATION_BORDER_VALUE) 1 else 0

        var elevationPoints = 0.0
        if(elevation > 0)
            elevationPoints = elevation / ELEVATION_DIVIDER + elevationExtraPoint

        val points = length / LENGTH_DIVIDER + lengthExtraPoint + elevationPoints

        return Triple(length, elevation, points.toInt())
    }


}
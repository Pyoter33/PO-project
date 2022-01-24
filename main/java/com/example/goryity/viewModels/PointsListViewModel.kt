package com.example.goryity.viewModels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.goryity.api.Repository
import com.example.goryity.models.ExpandableRangeModel
import com.example.goryity.models.ExpandableRangeParent
import com.example.goryity.models.Point
import kotlinx.coroutines.launch

class PointsListViewModel(private val repository: Repository) : ViewModel() {
    private val _list = MutableLiveData<List<ExpandableRangeParent>?>()
    val list: LiveData<List<ExpandableRangeParent>?> = _list


    fun getList() {
        viewModelScope.launch {
            _list.value = repository.getPointsList()
        }
    }

    fun filterByRangeFromPoint(
        range: String,
        firstPoint: Point?,
        secondPoint: Point?,
        list: List<ExpandableRangeParent>
    ): List<ExpandableRangeModel> {
        val filteredList = mutableListOf<ExpandableRangeModel>()

        val elem = list.find {
            it.range == range
        }
        val newPointsList = mutableListOf<Point>()

        filteredList.add(elem!!.copy())
        for (point in elem.points)
            if (point.id != firstPoint?.id && point.id != secondPoint?.id)
                newPointsList.add(point)
        (filteredList.first() as ExpandableRangeParent).points = newPointsList

        return filteredList
    }

    fun filterByRangeFromText(range: String, list: List<ExpandableRangeParent>): List<ExpandableRangeModel> {
        val filteredList = mutableListOf<ExpandableRangeModel>()

        for (elem in list) {
            elem.isExpanded = false
            if (elem.range.lowercase().contains(range.lowercase()))
                filteredList.add(elem)
        }
        return filteredList
    }

    fun filterByPoint(
        pointName: String,
        firstPoint: Point?,
        secondPoint: Point?,
        list: List<ExpandableRangeParent>
    ): List<ExpandableRangeModel> {
        val filteredList = mutableListOf<ExpandableRangeModel>()

        for (elem in list) {
            elem.isExpanded = false
            val newPointsList = mutableListOf<Point>()
            var toAdd = false
            for (point in elem.points)
                if (point.name!!.lowercase()
                        .contains(pointName.lowercase()) && point != firstPoint && point != secondPoint
                ) {
                    toAdd = true
                    newPointsList.add(point)
                }
            if (toAdd) {
                filteredList.add(elem.copy())
                (filteredList.last() as ExpandableRangeParent).points = newPointsList
            }
        }
        return filteredList
    }

}
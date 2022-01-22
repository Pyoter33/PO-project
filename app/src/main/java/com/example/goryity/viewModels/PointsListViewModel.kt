package com.example.goryity.viewModels

import androidx.lifecycle.ViewModel
import com.example.goryity.models.*
import java.util.*

class PointsListViewModel : ViewModel() {
    val range1 = MountainRange("Pieniny")
    val range2 = MountainRange("Tatry")
    val range3 = MountainRange("Góry Sowie")
    val range4 = MountainRange("4")
    val range5 = MountainRange("5")

    val list = mutableListOf(
        ExpandableRangeParent(
            range1,
            mutableListOf(
                Point(
                    1, 1, GeoData(1, 51.0654667, 16.983499, 40.0), "Schronisko Domek",
                    range1
                ),
                Point(
                    2,
                    1,
                    GeoData(2, 51.0817101, 17.0061003, 191.0),
                    "Diabelskie Kamienie",
                    range1
                ),
                Point(
                    11,
                    1,
                    GeoData(3, 51.1817101, 18.0061003, 241.0),
                    "Duża górka",
                    range1
                )
            ),
            ExpandableRangeModel.PARENT,
        ),
        ExpandableRangeParent(
            range2,
            mutableListOf(
                Point(3, 1, GeoData(1, 10.0, 20.0, 40.0), "Szczyt Rys", range2),
                Point(4, 1, GeoData(1, 10.0, 20.0, 40.0), "Parking", range2)
            ),
            ExpandableRangeModel.PARENT,
        ),
        ExpandableRangeParent(
            range3,
            mutableListOf(
                Point(5, 1, GeoData(1, 10.0, 20.0, 40.0), "3.1", range3),
                Point(6, 1, GeoData(1, 10.0, 20.0, 40.0), "3.2", range3)
            ),
            ExpandableRangeModel.PARENT
        ),
        ExpandableRangeParent(
            range4,
            mutableListOf(
                Point(7, 1, GeoData(1, 10.0, 20.0, 40.0), "4.1", range4),
                Point(8, 1, GeoData(1, 10.0, 20.0, 40.0), "4.2", range4)
            ),
            ExpandableRangeModel.PARENT,
        ), ExpandableRangeParent(
            range5,
            mutableListOf(
                Point(9, 1, GeoData(1, 10.0, 20.0, 40.0), "5.1", range5),
                Point(10, 1, GeoData(1, 10.0, 20.0, 40.0), "5.2", range5)
            ),
            ExpandableRangeModel.PARENT,
        )
    )


    fun filterByRangeFromPoint(
        range: String,
        firstPoint: Point?,
        secondPoint: Point?
    ): List<ExpandableRangeModel> {
        val filteredList = mutableListOf<ExpandableRangeModel>()

        val elem = list.find {
            it.range.name == range
        }
        val newPointsList = mutableListOf<Point>()

        if (elem!!.range.name == range) {
            filteredList.add(elem.copy())
            for (point in elem.points)
                if (point != firstPoint && point != secondPoint)
                    newPointsList.add(point)
            (filteredList.first() as ExpandableRangeParent).points = newPointsList

        }
        return filteredList
    }

    fun filterByRangeFromText(range: String): List<ExpandableRangeModel> {
        val filteredList = mutableListOf<ExpandableRangeModel>()

        for (elem in list) {
            elem.isExpanded = false
            if (elem.range.name.lowercase().contains(range.lowercase()))
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
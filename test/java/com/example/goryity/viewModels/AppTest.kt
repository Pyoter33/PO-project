package com.example.goryity.viewModels

import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.example.goryity.api.ApiService
import com.example.goryity.api.Repository
import com.example.goryity.models.ExpandableRangeParent
import com.example.goryity.models.GeoData
import com.example.goryity.models.Point
import junit.framework.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class AppTest {

    private lateinit var list: List<ExpandableRangeParent>
    private lateinit var listOnlyFirstRange: List<ExpandableRangeParent>
    private lateinit var chosenPoint: Point
    private lateinit var listWithoutChosenPoint: List<ExpandableRangeParent>

    private val repository = Repository(ApiService(ApplicationProvider.getApplicationContext()))
    private val pointsListViewModel =
        PointsListViewModel(repository)
    private val stretchCreatorViewModel =
        StretchCreatorViewModel(repository)

    @Before
    fun setUp() {
        list = listOf(
            ExpandableRangeParent(
                "first",
                listOf(
                    Point(1, 0, GeoData(1, 0.0, 0.0, 0.0), "1.1", "1"),
                    Point(2, 0, GeoData(2, 0.0, 0.0, 0.0), "1.2", "1"),
                    Point(3, 0, GeoData(3, 0.0, 0.0, 0.0), "1.3", "1")
                )
            ),
            ExpandableRangeParent(
                "second",
                listOf(
                    Point(4, 0, GeoData(4, 0.0, 0.0, 0.0), "2.1", "2"),
                    Point(5, 0, GeoData(5, 0.0, 0.0, 0.0), "2.2", "2"),
                    Point(6, 0, GeoData(6, 0.0, 0.0, 0.0), "2.3", "2")
                )
            )
        )

        listOnlyFirstRange = listOf(
            ExpandableRangeParent(
                "first",
                listOf(
                    Point(1, 0, GeoData(1, 0.0, 0.0, 0.0), "1.1", "1"),
                    Point(2, 0, GeoData(2, 0.0, 0.0, 0.0), "1.2", "1"),
                    Point(3, 0, GeoData(3, 0.0, 0.0, 0.0), "1.3", "1")
                )
            )
        )

        chosenPoint = Point(1, 0, GeoData(1, 0.0, 0.0, 0.0), "1.1", "1")
        listWithoutChosenPoint = listOf(
            ExpandableRangeParent(
                "first",
                listOf(
                    Point(2, 0, GeoData(2, 0.0, 0.0, 0.0), "1.2", "1"),
                    Point(3, 0, GeoData(3, 0.0, 0.0, 0.0), "1.3", "1")
                )
            )
        )


    }

    @Test
    fun filterByRangeFromTextTestFullName() {
        assertEquals(listOnlyFirstRange, pointsListViewModel.filterByRangeFromText("first", list))
    }

    @Test
    fun filterByRangeFromTextTestPartName() {
        assertEquals(listOnlyFirstRange, pointsListViewModel.filterByRangeFromText("f", list))
    }

    @Test
    fun filterByPointTestFullName() {
        val listOnlyFirstPoint = listOf(
            ExpandableRangeParent(
                "first",
                listOf(
                    Point(1, 0, GeoData(1, 0.0, 0.0, 0.0), "1.1", "1")
                )
            )
        )


        assertEquals(listOnlyFirstPoint, pointsListViewModel.filterByPoint("1.1", null, null, list))
    }

    @Test
    fun filterByPointTestPartName() {
        val listOnlyPointWith1 = listOf(
            ExpandableRangeParent(
                "first",
                listOf(
                    Point(1, 0, GeoData(1, 0.0, 0.0, 0.0), "1.1", "1"),
                    Point(2, 0, GeoData(2, 0.0, 0.0, 0.0), "1.2", "1"),
                    Point(3, 0, GeoData(3, 0.0, 0.0, 0.0), "1.3", "1")
                )
            ),
            ExpandableRangeParent(
                "second",
                listOf(
                    Point(4, 0, GeoData(4, 0.0, 0.0, 0.0), "2.1", "2"),
                )
            )
        )
        assertEquals(listOnlyPointWith1, pointsListViewModel.filterByPoint("1", null, null, list))
    }

    @Test
    fun filterByPointTestMix() {
        val listOnlyFirstFromSecond = listOf(
            ExpandableRangeParent(
                "second",
                listOf(
                    Point(4, 0, GeoData(4, 0.0, 0.0, 0.0), "2.1", "2"),
                )
            )
        )
        assertEquals(
            listOnlyFirstFromSecond,
            pointsListViewModel.filterByPoint(
                "1",
                null,
                null,
                pointsListViewModel.filterByRangeFromText(
                    "second",
                    list
                ) as List<ExpandableRangeParent>
            )
        )
    }

    @Test
    fun filterByRangeFromPointTestFirstPoint() {
        assertEquals(
            listWithoutChosenPoint,
            pointsListViewModel.filterByRangeFromPoint("first", chosenPoint, null, list)
        )
    }

    @Test
    fun filterByRangeFromPointTestSecondPoint() {
        assertEquals(
            listWithoutChosenPoint,
            pointsListViewModel.filterByRangeFromPoint("first", null, chosenPoint, list)
        )
    }

    @Test
    fun countSummaryTestPoints() {
        val exampleFirstPoint = Point(1,0, GeoData(1, 59.0, 17.0, 100.0), null, "")
        val exampleSecondPoint = Point(1,0, GeoData(1, 59.1, 17.1, 351.0), null, "")
        //distance ~15,36 km + 251m elevation
        val points = 18
        assertEquals(
            points,
            stretchCreatorViewModel.countSummary(exampleFirstPoint, exampleSecondPoint).third
        )
    }
}
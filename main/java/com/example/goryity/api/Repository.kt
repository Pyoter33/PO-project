package com.example.goryity.api

import com.example.goryity.models.*
import org.json.JSONObject
import java.text.SimpleDateFormat
import kotlin.math.sign
import kotlin.random.Random

class Repository(private val apiService: ApiService) {

    private companion object {
        const val URL = "http://10.0.0.9:5000"
    }

    suspend fun getApplication(id: Int): TripApplication? {
        val url = "$URL/requests/trip_acceptation/$id"
        val applicationJSONObject = apiService.getRequest(url)

        if (applicationJSONObject != null) {
            val userName =
                "${applicationJSONObject.getString("name")}  ${applicationJSONObject.getString("surname")}"
            val points = applicationJSONObject.getInt("points")
            val dateOfSubmission = applicationJSONObject.getString("dateOfSubmission")
            val startDate = applicationJSONObject.getString("startDate")
            val endDate = applicationJSONObject.getString("endDate")
            val tripDuration = applicationJSONObject.getInt("timeTripInMinutes")
            val photoUrl = applicationJSONObject.getString("photo")

            val formatter = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

            return TripApplication(
                id,
                userName,
                points,
                formatter.parse(dateOfSubmission)!!,
                formatter.parse(startDate)!!,
                formatter.parse(endDate)!!,
                tripDuration,
                photoUrl
            )
        }

        return null
    }

    suspend fun getApplicationsList(): List<TripApplicationListItem>? {
        val url = "$URL/requests/trip_acceptation"
        val applicationJSONArray = apiService.getRequestArray(url)
        val list = mutableListOf<TripApplicationListItem>()

        if (applicationJSONArray != null) {
            val formatter = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            for (i in 0 until applicationJSONArray.length()) {
                val applicationJSONObject = applicationJSONArray[i] as JSONObject
                val id = applicationJSONObject.getInt("requestId")
                val userName =
                    "${applicationJSONObject.getString("name")} ${applicationJSONObject.getString("surname")}"
                val points = applicationJSONObject.getInt("points")
                val dateOfSubmission = applicationJSONObject.getString("dateOfSubmission")
                list.add(
                    TripApplicationListItem(
                        id,
                        userName,
                        points,
                        formatter.parse(dateOfSubmission)!!
                    )
                )
            }

            return list
        }

        return null
    }

    suspend fun getPointsList(): List<ExpandableRangeParent>? {
        val url = "$URL/points"
        val applicationJSONArray = apiService.getRequestArray(url)
        val list = mutableListOf<Point>()

        if (applicationJSONArray != null) {
            for (i in 0 until applicationJSONArray.length()) {
                val applicationJSONObject = applicationJSONArray[i] as JSONObject
                val id = applicationJSONObject.getInt("id")
                val userId = applicationJSONObject.getInt("uzytkownikid")
                val name = applicationJSONObject.getString("nazwa")
                val range = applicationJSONObject.getString("pasmonazwa")
                list.add(
                    Point(
                        id,
                        userId,
                        GeoData(1, Random.nextDouble(from = 51.0654667, until = 51.0954667), Random.nextDouble(from = 16.983499, until = 16.993499), Random.nextDouble(from = 40.0, until = 212.0)),
                        name,
                        range
                    )
                )
            }
            return convertPoints(list)
        }

        return null
    }

    private fun convertPoints(list: List<Point>): List<ExpandableRangeParent> {
        val tempMap = mutableMapOf<String, MutableList<Point>>()
        val newList = mutableListOf<ExpandableRangeParent>()

        for (elem in list)
            if(tempMap.containsKey(elem.range))
                tempMap[elem.range]!!.add(elem)
            else {
                tempMap[elem.range] = mutableListOf()
                tempMap[elem.range]!!.add(elem)
            }

        for (elem in tempMap)
            newList.add(ExpandableRangeParent(elem.key, elem.value))

        return newList
    }

    suspend fun postStretch(stretch: Stretch): Int {
        val url = "$URL/sections"
        val params = mutableMapOf<String, Number>()
        params["userId"] = stretch.userId
        params["length"] = stretch.length
        params["deflection"] = stretch.elevation
        params["points"] = stretch.points
        params["startPoint"] = stretch.beginPoint.id
        params["endPoint"] = stretch.endPoint.id
        val jsonObject = JSONObject(params as Map<*, *>)


       return apiService.postRequest(url, jsonObject)
    }

    suspend fun patchApplicationAccept(id: Int): Int {
        val url = "$URL/requests/trip_acceptation/accept/${id}"
        val params = mutableMapOf<String, Number>()
        val jsonObject = JSONObject(params as Map<*, *>)


        return apiService.patchRequest(url, jsonObject)
    }

    suspend fun patchApplicationReject(id: Int, comment: String): Int {
        val url = "$URL/requests/trip_acceptation/reject/${id}"
        val params = mutableMapOf<String, String>()
        params["comment"] = comment
        val jsonObject = JSONObject(params as Map<*, *>)

        return apiService.patchRequest(url, jsonObject)
    }

}
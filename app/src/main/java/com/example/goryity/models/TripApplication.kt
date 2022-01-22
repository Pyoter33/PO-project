package com.example.goryity.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.util.*

@Parcelize  //delete later!!!
data class TripApplication(
    val id: Int,
    val userName: String,
    val points: Int,
    val dateOfSubmission: Date,
    val startDate: Date,
    val endDate: Date,
    val tripDuration: Int,
    val photoUrl: String
): Parcelable


data class TripApplicationListItem(
    val id: Int,
    val userName: String,
    val points: Int,
    val dateOfSubmission: Date,
) //????????
package com.example.goryity.viewModels

import androidx.lifecycle.ViewModel
import com.example.goryity.models.TripApplication
import java.util.*

class ApplicationsListViewModel : ViewModel() {

    val list = listOf(
        TripApplication(
            1,
            "Zbigniew Szpunar",
            25,
            Date(1220227200L * 1000),
            Date(1220327200L * 1000),
            Date(122022500L * 1000),
            231,
            "https://previews.123rf.com/images/vadmary/vadmary1302/vadmary130200033/17960609-mapa-de-calles-con-gps-navigation-icons.jpg"
        )
    )

}
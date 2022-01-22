package com.example.goryity.models

data class Stretch(val id: Int, val userId: Int, val length: Double, val elevation: Double, val points: Int, val state: StretchState, val beginPoint: Point, val endPoint: Point)

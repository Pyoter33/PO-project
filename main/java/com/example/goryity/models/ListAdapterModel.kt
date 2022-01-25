package com.example.goryity.models

interface ExpandableRangeModel {
    companion object {
        const val PARENT = 1
        const val CHILD = 2
    }
    val type: Int
    var isExpanded: Boolean
}

data class ExpandableRangeParent(
    val range: String,
    var points: List<Point>,
    override val type: Int = ExpandableRangeModel.PARENT,
    override var isExpanded: Boolean = false
) : ExpandableRangeModel

data class ExpandableRangeChild(
    val point: Point,
    override val type: Int = ExpandableRangeModel.CHILD,
    override var isExpanded: Boolean = false
) : ExpandableRangeModel
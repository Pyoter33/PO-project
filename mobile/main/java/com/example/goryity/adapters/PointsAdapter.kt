package com.example.goryity.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.goryity.databinding.ExpandableChildItemBinding
import com.example.goryity.databinding.ExpandableParentItemBinding
import com.example.goryity.models.*
import com.example.goryity.views.PointsListClickListener


class PointsAdapter(private val pointsListClickListener: PointsListClickListener) :
    ListAdapter<ExpandableRangeModel, RecyclerView.ViewHolder>(RangesComparator()) {


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return when (viewType) {
            ExpandableRangeModel.PARENT -> RangeModelParentViewHolder.create(parent)

            ExpandableRangeModel.CHILD -> RangeModelChildViewHolder.create(parent)

            else -> RangeModelParentViewHolder.create(parent)
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        val row = getItem(position)
        when (row.type) {
            ExpandableRangeModel.PARENT -> {
                (holder as RangeModelParentViewHolder).bind((row as ExpandableRangeParent))
                holder.itemView.setOnClickListener {
                    if (row.isExpanded) {
                        collapseRow(position)
                        row.isExpanded = false
                    } else {
                        expandRow(position)
                        row.isExpanded = true
                    }
                }
            }

            ExpandableRangeModel.CHILD -> {
                    (holder as RangeModelChildViewHolder).bind((row as ExpandableRangeChild).point, pointsListClickListener)
            }
        }
    }

    override fun getItemViewType(position: Int): Int {
        return getItem(position).type
    }

    private fun expandRow(position: Int) {
        val row = getItem(position)
        val nextPosition = position + 1
        val list = currentList.toMutableList()
        when (row.type) {
            ExpandableRangeModel.PARENT -> {
                for (i in (row as ExpandableRangeParent).points.indices) {
                    list.add(
                        nextPosition + i,
                        ExpandableRangeChild(row.points[i])
                    )
                    submitList(list)
                }
            }
            ExpandableRangeModel.CHILD -> {
            }
        }
    }

    private fun collapseRow(position: Int) {
        val row = getItem(position)
        val nextPosition = position + 1
        val list = currentList.toMutableList()
        when (row.type) {
            ExpandableRangeModel.PARENT -> {
                for (i in (row as ExpandableRangeParent).points.indices) {
                    list.removeAt(nextPosition)
                }
                submitList(list)
            }
        }

    }

    class RangeModelParentViewHolder(private val binding: ExpandableParentItemBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(range: ExpandableRangeParent) {
            binding.numberOfChildren.text = range.points.size.toString()
            binding.countryName.text = range.range
        }

        companion object {
            fun create(
                parent: ViewGroup
            ): RangeModelParentViewHolder {
                val layoutInflater = LayoutInflater.from(parent.context)
                val binding = ExpandableParentItemBinding.inflate(layoutInflater, parent, false)
                return RangeModelParentViewHolder(
                    binding
                )
            }
        }
    }

    class RangeModelChildViewHolder(private val binding: ExpandableChildItemBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(point: Point, pointsListClickListener: PointsListClickListener) {
            binding.stateName.text = point.name

            binding.countryItemChildContainer.setOnClickListener {
                pointsListClickListener.onClickPoint(point)
            }

        }

        companion object {
            fun create(
                parent: ViewGroup,
            ): RangeModelChildViewHolder {
                val layoutInflater = LayoutInflater.from(parent.context)
                val binding = ExpandableChildItemBinding.inflate(layoutInflater, parent, false)
                return RangeModelChildViewHolder(
                    binding
                )
            }
        }
    }
}

class RangesComparator : DiffUtil.ItemCallback<ExpandableRangeModel>() {
    override fun areItemsTheSame(
        oldItem: ExpandableRangeModel,
        newItem: ExpandableRangeModel
    ): Boolean {
        return oldItem === newItem
    }

    override fun areContentsTheSame(
        oldItem: ExpandableRangeModel,
        newItem: ExpandableRangeModel
    ): Boolean {
        return false
    }
}
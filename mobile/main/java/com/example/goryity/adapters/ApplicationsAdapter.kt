package com.example.goryity.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.goryity.databinding.ApplicationsListItemBinding
import com.example.goryity.models.TripApplication
import com.example.goryity.models.TripApplicationListItem
import com.example.goryity.views.ApplicationsClickListener
import java.text.SimpleDateFormat

class ApplicationsAdapter(private val applicationsClickListener: ApplicationsClickListener) :
    ListAdapter<TripApplicationListItem, ApplicationsAdapter.TripApplicationViewHolder>(
        ApplicationsComparator()
    ) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TripApplicationViewHolder {
        return TripApplicationViewHolder.create(parent)
    }

    override fun onBindViewHolder(holder: TripApplicationViewHolder, position: Int) {
        val application = getItem(position)
        holder.bind(application, applicationsClickListener)
    }


    class TripApplicationViewHolder(private val binding: ApplicationsListItemBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(application: TripApplicationListItem, applicationsClickListener: ApplicationsClickListener) {
            binding.textUser.text = application.userName
            binding.textDate.text =  SimpleDateFormat("dd.MM.yyyy")
                .format(application.dateOfSubmission)
            binding.textPoints.text = application.points.toString()

            binding.imageButtonDetails.setOnClickListener {
                applicationsClickListener.onClick(application)
            }
        }


        companion object {
            fun create(parent: ViewGroup): TripApplicationViewHolder {
                val layoutInflater = LayoutInflater.from(parent.context)
                val binding = ApplicationsListItemBinding.inflate(layoutInflater, parent, false)
                return TripApplicationViewHolder(binding)
            }

        }
    }

}

class ApplicationsComparator : DiffUtil.ItemCallback<TripApplicationListItem>() {
    override fun areItemsTheSame(
        oldItem: TripApplicationListItem,
        newItem: TripApplicationListItem
    ): Boolean {
        return oldItem === newItem
    }

    override fun areContentsTheSame(
        oldItem: TripApplicationListItem,
        newItem: TripApplicationListItem
    ): Boolean {
        return oldItem.id == newItem.id
    }
}

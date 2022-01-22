package com.example.goryity.views

import android.os.Bundle
import android.view.*
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.goryity.R
import com.example.goryity.adapters.ApplicationsAdapter
import com.example.goryity.databinding.ApplicationsListFragmentBinding
import com.example.goryity.models.TripApplication
import com.example.goryity.viewModels.ApplicationsListViewModel

class ApplicationsListFragment : Fragment(), ApplicationsClickListener {
    private lateinit var binding: ApplicationsListFragmentBinding
    private lateinit var adapter: ApplicationsAdapter
    private lateinit var viewModel: ApplicationsListViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding =
            DataBindingUtil.inflate(inflater, R.layout.applications_list_fragment, container, false)
        requireActivity().title = "Wnioski"
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        adapter = ApplicationsAdapter(this)
        viewModel = ViewModelProvider(this).get(ApplicationsListViewModel::class.java)

        binding.applicationsList.adapter = adapter
        val layoutManager = LinearLayoutManager(context)
        binding.applicationsList.layoutManager = layoutManager


        submitNewList()
    }

    //TODO change to observe
    private fun submitNewList(){
        if(viewModel.list.isNotEmpty()) {
            binding.textNoNewApplications.visibility = View.GONE
            adapter.submitList(viewModel.list)
            return
        }
        binding.textNoNewApplications.visibility = View.VISIBLE
    }

    override fun onClick(application: TripApplication) { //TODO change to id with api!
        findNavController().navigate(ApplicationsListFragmentDirections.actionApplicationsListFragmentToApplicationDetailsFragment(application, application.id))
    }
}

interface ApplicationsClickListener {
    fun onClick(application: TripApplication)
}
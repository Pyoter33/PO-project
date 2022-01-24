package com.example.goryity.views

import android.os.Bundle
import android.view.*
import android.widget.Toast
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.goryity.R
import com.example.goryity.adapters.ApplicationsAdapter
import com.example.goryity.api.ApiService
import com.example.goryity.api.Repository
import com.example.goryity.databinding.ApplicationsListFragmentBinding
import com.example.goryity.models.TripApplicationListItem
import com.example.goryity.viewModels.ApplicationsListViewModel
import com.example.goryity.viewModels.ApplicationsListViewModelFactory

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
        val factory = ApplicationsListViewModelFactory(Repository(ApiService(requireContext())))
        viewModel = ViewModelProvider(this, factory).get(ApplicationsListViewModel::class.java)

        binding.applicationsList.adapter = adapter
        val layoutManager = LinearLayoutManager(context)
        binding.applicationsList.layoutManager = layoutManager

        observeList()
    }

    private fun observeList() {
        viewModel.getList()
        viewModel.list.observe(viewLifecycleOwner, { list ->
            if (list != null) {
                if (list.isNotEmpty()) {
                    binding.textNoNewApplications.visibility = View.GONE
                    adapter.submitList(list)
                    return@observe
                }
                binding.textNoNewApplications.visibility = View.VISIBLE

            } else
                Toast.makeText(context, "Błąd przy pobieraniu danych!", Toast.LENGTH_SHORT).show()

        })
    }



    override fun onClick(application: TripApplicationListItem) {
        findNavController().navigate(
            ApplicationsListFragmentDirections.actionApplicationsListFragmentToApplicationDetailsFragment(
                application.id
            )
        )
    }
}

interface ApplicationsClickListener {
    fun onClick(application: TripApplicationListItem)
}
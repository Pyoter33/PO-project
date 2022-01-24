package com.example.goryity.views

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.goryity.R
import com.example.goryity.adapters.PointsAdapter
import com.example.goryity.api.ApiService
import com.example.goryity.api.Repository
import com.example.goryity.databinding.PointsListFragmentBinding
import com.example.goryity.models.ExpandableRangeModel
import com.example.goryity.models.ExpandableRangeParent
import com.example.goryity.models.Point
import com.example.goryity.viewModels.PointsListViewModel
import com.example.goryity.viewModels.PointsListViewModelFactory
import com.example.goryity.viewModels.SharedViewModel

class PointsListFragment : Fragment(), PointsListClickListener {

    private lateinit var binding: PointsListFragmentBinding
    private lateinit var adapter: PointsAdapter
    private val sharedViewModel: SharedViewModel by activityViewModels()
    private lateinit var viewModel: PointsListViewModel
    private lateinit var args: PointsListFragmentArgs

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding =
            DataBindingUtil.inflate(inflater, R.layout.points_list_fragment_, container, false)
        requireActivity().title = "Lista punktów"
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        args = PointsListFragmentArgs.fromBundle(requireArguments())
        val factory = PointsListViewModelFactory(Repository(ApiService(requireContext())))
        viewModel = ViewModelProvider(this, factory).get(PointsListViewModel::class.java)
        adapter = PointsAdapter(this)
        binding.listPoints.adapter = adapter
        val layoutManager = LinearLayoutManager(context)
        binding.listPoints.layoutManager = layoutManager

        checkFilter()
        observeList()
        setOnEditTextFindRangeListener()
        setOnEditTextFindPointListener()
        setOnCreatePointClickListener()
    }

    private fun checkFilter() {
        if (args.range != null)
            binding.editTextFindMountainRange.visibility = View.GONE
    }

    private fun observeList() {
        viewModel.getList()
        viewModel.list.observe(viewLifecycleOwner, { list ->
            if (list != null) {
                if (args.range == null)
                    adapter.submitList(list)
                else
                    adapter.submitList(
                        viewModel.filterByRangeFromPoint(
                            args.range!!,
                            sharedViewModel.firstPoint.value,
                            sharedViewModel.secondPoint.value,
                            viewModel.list.value!!
                        )
                    )
            } else
                Toast.makeText(context, "Błąd przy pobieraniu danych!", Toast.LENGTH_SHORT).show()
        })
    }

    private fun setOnEditTextFindRangeListener() {
        binding.editTextFindMountainRange.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                if (viewModel.list.value != null)
                    if (s != null)
                        adapter.submitList(viewModel.filterByRangeFromText(s.toString(), viewModel.list.value!!))
                    else
                        adapter.submitList(viewModel.list.value as List<ExpandableRangeModel>)
            }

            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
            }
        })
    }

    private fun setOnEditTextFindPointListener() {
        binding.editTextFindPoint.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                if (viewModel.list.value != null) {
                    if (s != null) {
                        if (args.range != null) {
                            adapter.submitList(
                                viewModel.filterByPoint(
                                    s.toString(),
                                    sharedViewModel.firstPoint.value,
                                    sharedViewModel.firstPoint.value,
                                    viewModel.filterByRangeFromPoint(
                                        args.range!!,
                                        sharedViewModel.firstPoint.value,
                                        sharedViewModel.secondPoint.value,
                                        viewModel.list.value!!
                                    ) as List<ExpandableRangeParent>
                                )
                            )
                        } else {
                            if (viewModel.list.value != null) {
                                adapter.submitList(
                                    viewModel.filterByPoint(
                                        s.toString(),
                                        sharedViewModel.firstPoint.value,
                                        sharedViewModel.firstPoint.value,
                                        viewModel.list.value!!
                                    )
                                )
                            }
                        }
                    } else {
                        if (viewModel.list.value != null) {
                            adapter.submitList(viewModel.list.value as List<ExpandableRangeModel>)
                        }
                    }
                }
            }

            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
            }
        })
    }

    private fun setOnCreatePointClickListener() {
        binding.buttonCreate.setOnClickListener {
            Toast.makeText(context, "Przeniesienie do tworzenia punktów", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onClickPoint(point: Point) {
        if (args.isFirst)
            sharedViewModel.setFirstPoint(point)
        else
            sharedViewModel.setSecondPoint(point)

        findNavController().popBackStack()
    }


}


interface PointsListClickListener {
    fun onClickPoint(point: Point)

}
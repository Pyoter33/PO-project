package com.example.goryity.views

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.goryity.R
import com.example.goryity.adapters.PointsAdapter
import com.example.goryity.databinding.PointsListFragmentBinding
import com.example.goryity.models.*
import com.example.goryity.viewModels.PointsListViewModel
import com.example.goryity.viewModels.StretchCreatorViewModel

class PointsListFragment : Fragment(), PointsListClickListener {

    private lateinit var binding: PointsListFragmentBinding
    private lateinit var adapter: PointsAdapter
    private val sharedViewModel: StretchCreatorViewModel by activityViewModels()
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
        viewModel = ViewModelProvider(this).get(PointsListViewModel::class.java)
        adapter = PointsAdapter(this)
        binding.listPoints.adapter = adapter
        val layoutManager = LinearLayoutManager(context)
        binding.listPoints.layoutManager = layoutManager

        checkFilter()

        submitPointsList()
        setOnEditTextFindRangeListener()
        setOnEditTextFindPointListener()
    }

    private fun checkFilter() {
        if (args.range != null)
            binding.editTextFindMountainRange.visibility = View.GONE
    }

    private fun submitPointsList() {
        val selectedList = if (args.range != null)
            viewModel.filterByRangeFromPoint(
                args.range!!,
                sharedViewModel.firstPoint.value,
                sharedViewModel.secondPoint.value
            )
        else
            viewModel.list

        adapter.submitList(selectedList)
    }

    private fun setOnEditTextFindRangeListener() {
        binding.editTextFindMountainRange.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                if (s != null)
                    adapter.submitList(viewModel.filterByRangeFromText(s.toString()))
                else
                    adapter.submitList(viewModel.list as List<ExpandableRangeModel>)
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
                                    sharedViewModel.secondPoint.value
                                ) as List<ExpandableRangeParent>
                            )
                        )
                    } else {
                        adapter.submitList(
                            viewModel.filterByPoint(
                                s.toString(),
                                sharedViewModel.firstPoint.value,
                                sharedViewModel.firstPoint.value,
                                viewModel.list
                            )
                        )
                    }
                } else {
                    adapter.submitList(viewModel.list as List<ExpandableRangeModel>)
                }
            }

            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
            }
        })
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
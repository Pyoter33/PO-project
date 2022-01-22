package com.example.goryity.views

import androidx.lifecycle.ViewModelProvider
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.LifecycleOwner
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.goryity.R
import com.example.goryity.adapters.PointsAdapter
import com.example.goryity.databinding.StretchCreatorFragmentBinding
import com.example.goryity.models.*
import com.example.goryity.viewModels.StretchCreatorViewModel

class StretchCreatorFragment : Fragment() {
    private val viewModel: StretchCreatorViewModel by activityViewModels()
    private lateinit var binding: StretchCreatorFragmentBinding
    private var currentRange: String? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = DataBindingUtil.inflate(
            layoutInflater,
            R.layout.stretch_creator_fragment,
            container,
            false
        )
        requireActivity().title = "Kreator odcinka"
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setOnFirstPointClickListener()
        setOnSecondPointClickListener()
        setOnFirstPointRemoveClickListener()
        setOnSecondPointRemoveClickListener()
        observeFirstPoint()
        observeSecondPoint()

    }

    private fun setOnFirstPointClickListener() {
        binding.layoutFirstPoint.setOnClickListener {
            if (binding.textFirstPoint.text.isNotEmpty())
                return@setOnClickListener

            findNavController().navigate(
                StretchCreatorFragmentDirections.actionStretchCreatorFragmentToPointsListFragment(
                    currentRange, true
                )
            )
        }
    }

    private fun setOnSecondPointClickListener() {
        binding.layoutSecondPoint.setOnClickListener {
            if (binding.textSecondPoint.text.isNotEmpty())
                return@setOnClickListener

            findNavController().navigate(
                StretchCreatorFragmentDirections.actionStretchCreatorFragmentToPointsListFragment(
                    currentRange, false
                )
            )
        }
    }

    private fun setOnFirstPointRemoveClickListener() {
        binding.imageButtonCloseFirstPoint.setOnClickListener { button ->
            button.visibility = View.GONE
            viewModel.setFirstPoint(null)
        }
    }

    private fun setOnSecondPointRemoveClickListener() {
        binding.imageButtonCloseSecondPoint.setOnClickListener { button ->
            button.visibility = View.GONE
            viewModel.setSecondPoint(null)
        }
    }


    private fun observeFirstPoint() {
        viewModel.firstPoint.observe(viewLifecycleOwner, { point ->
            if (point != null) {
                binding.textFirstPoint.text = point.name
                currentRange = point.range.name
                binding.imageButtonCloseFirstPoint.visibility = View.VISIBLE

                if(viewModel.secondPoint.value != null)
                    showSummary()

                return@observe
            }
            hideSummary()
            binding.textFirstPoint.text = ""
            if(viewModel.secondPoint.value == null)
                currentRange = null

        })
    }

    private fun observeSecondPoint() {
        viewModel.secondPoint.observe(viewLifecycleOwner, { point ->
            if (point != null) {
                binding.textSecondPoint.text = point.name
                currentRange = point.range.name
                binding.imageButtonCloseSecondPoint.visibility = View.VISIBLE

                if(viewModel.firstPoint.value != null)
                    showSummary()

                return@observe
            }
            hideSummary()
            binding.textSecondPoint.text = ""
            if(viewModel.firstPoint.value == null)
                currentRange = null

        })
    }

    private fun showSummary(){
        val summary = viewModel.countSummary()
        binding.textStretchLength.text = getString(R.string.meters, summary.first.toFloat())
        binding.textStretchElevation.text = getString(R.string.meters, summary.second.toFloat())
        binding.textStretchPoints.text = summary.third.toString()
    }

    private fun hideSummary(){
        binding.textStretchLength.text = getString(R.string.questionmark)
        binding.textStretchElevation.text = getString(R.string.questionmark)
        binding.textStretchPoints.text = getString(R.string.questionmark)
    }

}
package com.example.goryity.views

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.example.goryity.R
import com.example.goryity.api.ApiService
import com.example.goryity.api.Repository
import com.example.goryity.databinding.StretchCreatorFragmentBinding
import com.example.goryity.dialogs.StretchCreatedDialog
import com.example.goryity.dialogs.StretchExistsDialog
import com.example.goryity.models.*
import com.example.goryity.viewModels.SharedViewModel
import com.example.goryity.viewModels.StretchCreatorViewModel
import com.example.goryity.viewModels.StretchCreatorViewModelFactory

class StretchCreatorFragment : Fragment() {
    private val sharedViewModel: SharedViewModel by activityViewModels()
    private lateinit var viewModel: StretchCreatorViewModel
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

        val factory = StretchCreatorViewModelFactory(Repository(ApiService(requireContext())))
        viewModel = ViewModelProvider(this, factory).get(StretchCreatorViewModel::class.java)

        setOnFirstPointClickListener()
        setOnSecondPointClickListener()
        setOnFirstPointRemoveClickListener()
        setOnSecondPointRemoveClickListener()
        observeFirstPoint()
        observeSecondPoint()
        onCreateStretchClickListener()
        observePostResult()

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
            sharedViewModel.setFirstPoint(null)
        }
    }

    private fun setOnSecondPointRemoveClickListener() {
        binding.imageButtonCloseSecondPoint.setOnClickListener { button ->
            button.visibility = View.GONE
            sharedViewModel.setSecondPoint(null)
        }
    }


    private fun observeFirstPoint() {
        sharedViewModel.firstPoint.observe(viewLifecycleOwner, { point ->
            if (point != null) {
                binding.textFirstPoint.text = point.name
                currentRange = point.range
                binding.imageButtonCloseFirstPoint.visibility = View.VISIBLE

                if (sharedViewModel.secondPoint.value != null)
                    showSummary()

                return@observe
            }
            hideSummary()
            binding.textFirstPoint.text = ""
            if (sharedViewModel.secondPoint.value == null)
                currentRange = null

        })
    }

    private fun observeSecondPoint() {
        sharedViewModel.secondPoint.observe(viewLifecycleOwner, { point ->
            if (point != null) {
                binding.textSecondPoint.text = point.name
                currentRange = point.range
                binding.imageButtonCloseSecondPoint.visibility = View.VISIBLE

                if (sharedViewModel.firstPoint.value != null)
                    showSummary()

                return@observe
            }
            hideSummary()
            binding.textSecondPoint.text = ""
            if (sharedViewModel.firstPoint.value == null)
                currentRange = null

        })
    }

    private fun observePostResult() {
        viewModel.postResult.observe(viewLifecycleOwner, {result->
            if(result != 0) {
                when (result) {
                    ApiService.SUCCESS -> {
                        val dialog = StretchCreatedDialog()
                        dialog.show(childFragmentManager, "StretchCreatorFragment")
                    }
                    ApiService.CLIENT_ERROR -> {
                        val dialog = StretchExistsDialog()
                        dialog.show(childFragmentManager, "StretchCreatorFragment")

                    }
                    ApiService.SERVER_ERROR -> {
                        Toast.makeText(
                            context,
                            "Nie można stworzyć odcinka! Błąd serwera.",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
                viewModel.resetPostResult()
            }

        })

    }

    private fun showSummary() {
        val summary = viewModel.countSummary(
            sharedViewModel.firstPoint.value!!,
            sharedViewModel.secondPoint.value!!
        )
        binding.textStretchLength.text = getString(R.string.meters, summary.first.toFloat())
        binding.textStretchElevation.text = getString(R.string.meters, summary.second.toFloat())
        binding.textStretchPoints.text = summary.third.toString()
    }

    private fun hideSummary() {
        binding.textStretchLength.text = getString(R.string.questionmark)
        binding.textStretchElevation.text = getString(R.string.questionmark)
        binding.textStretchPoints.text = getString(R.string.questionmark)
    }

    private fun onCreateStretchClickListener() {
        binding.buttonCreate.setOnClickListener {
            val firstPoint = sharedViewModel.firstPoint.value
            val secondPoint = sharedViewModel.secondPoint.value
            if (firstPoint != null && secondPoint != null) {
                val summary = viewModel.countSummary(
                    firstPoint,
                    secondPoint
                )
                viewModel.postStretch(
                    Stretch(
                        1001,
                        1,
                        summary.first,
                        summary.second,
                        summary.third,
                        firstPoint,
                        secondPoint
                    )
                )
            }
            else
                Toast.makeText(context, "Żeby stworzyć odcinek dodaj dwa punkty!", Toast.LENGTH_SHORT).show()
        }
    }
}
package com.example.goryity.views

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.bumptech.glide.Glide
import com.example.goryity.R
import com.example.goryity.databinding.ApplicationDetailsFragmentBinding
import com.example.goryity.models.TripApplication
import com.example.goryity.viewModels.ApplicationDetailsViewModel
import java.text.SimpleDateFormat

class ApplicationDetailsFragment : Fragment(), RejectDialogInterface {

    private lateinit var binding: ApplicationDetailsFragmentBinding
    private lateinit var viewModel: ApplicationDetailsViewModel
    private lateinit var args: ApplicationDetailsFragmentArgs
    private lateinit var application: TripApplication
    private lateinit var dialog: RejectApplicationDialog

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = DataBindingUtil.inflate(
            inflater,
            R.layout.application_details_fragment,
            container,
            false
        )
        requireActivity().title = "Szczegóły wniosku"
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel = ViewModelProvider(this).get(ApplicationDetailsViewModel::class.java)
        args = ApplicationDetailsFragmentArgs.fromBundle(requireArguments())
        application = args.application


        dialog = RejectApplicationDialog(this, view as ViewGroup)
        setDetails()
        setOnImageClickListener()
        setOnExpandedImageClickListener()
        setOnRejectClickListener()
        setOnAcceptClickListener()
    }

    //TODO do in observe
    private fun setDetails() {
        binding.textTouristsApplication.text =
            getString(R.string.tourists_application, application.userName)
        binding.textDate.text =
            SimpleDateFormat("dd.MM.yyyy HH:mm").format(application.dateOfSubmission)
        binding.textPoints.text = application.points.toString()
        binding.textStartTime.text =
            SimpleDateFormat("dd.MM.yyyy HH:mm").format(application.startDate)
        binding.textEndTime.text = SimpleDateFormat("dd.MM.yyyy HH:mm").format(application.endDate)
        binding.textTotalTime.text = getString(
            R.string.time_format,
            application.tripDuration / 60,
            application.tripDuration % 60
        )
        Glide.with(this).load(application.photoUrl).into(binding.imageGps)
    }

    private fun setOnImageClickListener() {
        binding.imageGps.setOnClickListener {
            Glide.with(this).load(application.photoUrl).into(binding.expandedImage)
            binding.expandedImage.visibility = View.VISIBLE
            binding.details.alpha = 0.1f
        }
    }

    private fun setOnExpandedImageClickListener() {
        binding.expandedImage.setOnClickListener {
            Glide.with(this).load(application.photoUrl).into(binding.expandedImage)
            binding.expandedImage.visibility = View.INVISIBLE
            binding.details.alpha = 1f
        }
    }

    private fun setOnRejectClickListener(){
        binding.buttonReject.setOnClickListener {
            dialog.show(childFragmentManager, "ApplicationDetailsFragment")
        }

    }

    private fun setOnAcceptClickListener(){
        binding.buttonAccept.setOnClickListener {
            findNavController().popBackStack()
        }

    }

    override fun onClickSend(text: String) {
        findNavController().popBackStack()
    }

}

interface RejectDialogInterface{
    fun onClickSend(text: String)

}
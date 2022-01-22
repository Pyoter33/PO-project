package com.example.goryity.views

import android.app.AlertDialog
import android.app.Dialog
import android.content.res.Resources
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.DialogFragment
import com.example.goryity.R
import com.example.goryity.databinding.RejectApplicationDialogBinding
import com.example.goryity.models.ExpandableRangeModel

class RejectApplicationDialog(private val rejectDialogInterface: RejectDialogInterface, private val parent: ViewGroup): DialogFragment() {

    private lateinit var binding: RejectApplicationDialogBinding

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {

        val dialog = AlertDialog.Builder(activity).create()
        val inflater = requireActivity().layoutInflater

        binding = DataBindingUtil.inflate(inflater, R.layout.reject_application_dialog, parent, false)
        dialog.setView(binding.root)
        dialog.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        setOnEditTextListener()
        setOnSendClickListener()
        return dialog
    }

    private fun setOnEditTextListener(){
        binding.textCharCounter.text = getString(R.string.char_counter, 0)
        binding.editText.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {}

            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {

            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                if(s != null) {
                    if (s.length == 255) {
                        binding.editText.setBackgroundResource(R.drawable.background_text_over)
                        binding.textCharCounter.setTextColor(ContextCompat.getColor(parent.context, R.color.decline))
                    } else if(s.length == 254) {
                        binding.editText.setBackgroundResource(R.drawable.background_point)
                        binding.textCharCounter.setTextColor(Color.BLACK)
                    }
                    binding.textCharCounter.text = getString(R.string.char_counter, s.length)
                }
                else
                    binding.textCharCounter.text = getString(R.string.char_counter, 0)
            }
        })
    }

    private fun setOnSendClickListener(){
        binding.buttonSend.setOnClickListener {
            rejectDialogInterface.onClickSend(binding.editText.text.toString())
            dialog!!.cancel()
        }

    }
}
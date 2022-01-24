package com.example.goryity.dialogs

import android.app.AlertDialog
import android.app.Dialog
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.DialogFragment
import com.example.goryity.R
import com.example.goryity.databinding.RejectApplicationDialogBinding
import com.example.goryity.views.RejectDialogInterface

class RejectApplicationDialog(private val rejectDialogInterface: RejectDialogInterface, private val parent: ViewGroup): DialogFragment() {

    private companion object{
        const val TEXT_MAX_LENGTH = 255
    }

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
                    if (s.length == TEXT_MAX_LENGTH) {
                        binding.editText.setBackgroundResource(R.drawable.background_text_over)
                        binding.textCharCounter.setTextColor(ContextCompat.getColor(parent.context, R.color.decline))
                    } else if(s.length == TEXT_MAX_LENGTH - 1) {
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
            if(binding.editText.text.isNotEmpty()) {
                rejectDialogInterface.onClickSend(binding.editText.text.toString())
                dialog!!.cancel()
            }
            else {
                Toast.makeText(context, "Musisz podać powód odrzucenia wniosku!", Toast.LENGTH_SHORT).show()
            }
        }

    }
}
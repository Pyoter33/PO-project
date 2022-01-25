package com.example.goryity.dialogs

import android.app.AlertDialog
import android.app.Dialog
import android.os.Bundle
import androidx.fragment.app.DialogFragment
import com.example.goryity.R

class StretchCreatedDialog() : DialogFragment() {

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {

        return activity.let {
            val builder = AlertDialog.Builder(it)

            builder.setTitle(R.string.stretch_created_title)
                .setPositiveButton(R.string.ok) { dialog, _ ->
                    dialog.cancel()
                }.create()

        } ?: throw IllegalStateException("Activity cannot be null")
    }
}
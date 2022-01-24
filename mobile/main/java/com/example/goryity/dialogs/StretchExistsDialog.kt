package com.example.goryity.dialogs

import android.app.AlertDialog
import android.app.Dialog
import android.os.Bundle
import androidx.fragment.app.DialogFragment
import com.example.goryity.R

class StretchExistsDialog() : DialogFragment() {

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {

        return activity.let {
            val builder = AlertDialog.Builder(it)

            builder.setMessage(R.string.same_stretch_text).setTitle(R.string.same_stretch_title)
                .setPositiveButton(R.string.ok) { dialog, _ ->
                    dialog.cancel()
                }.create()

        } ?: throw IllegalStateException("Activity cannot be null")
    }
}
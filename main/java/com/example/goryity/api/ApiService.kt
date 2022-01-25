package com.example.goryity.api

import android.content.Context
import android.util.Log
import android.widget.Toast
import com.android.volley.ClientError
import com.android.volley.Request
import com.android.volley.toolbox.JsonArrayRequest
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

class ApiService(private val context: Context) {

    companion object{
        const val SUCCESS = 200
        const val CLIENT_ERROR = 400
        const val SERVER_ERROR = 404
    }

    suspend fun getRequest(url: String): JSONObject? = suspendCoroutine { continuation ->
        val queue = Volley.newRequestQueue(context)
        val request = JsonObjectRequest(Request.Method.GET, url, null, { response ->
            try {
                continuation.resume(response)
            } catch (e: JSONException) {
                e.printStackTrace()
            }
        }, { error ->
            continuation.resume(null)
            error.printStackTrace()
        })

        queue.add(request)

    }

    suspend fun getRequestArray(url: String): JSONArray? = suspendCoroutine { continuation ->
        val queue = Volley.newRequestQueue(context)
        val request = JsonArrayRequest(Request.Method.GET, url, null, { response ->
            try {
                continuation.resume(response)
            } catch (e: JSONException) {
                e.printStackTrace()
            }
        }, { error ->
            continuation.resume(null)
            error.printStackTrace()
        })

        queue.add(request)
    }

    suspend fun postRequest(url: String, postJSONObject: JSONObject): Int =
        suspendCoroutine { continuation ->
            val queue = Volley.newRequestQueue(context)
            val request = JsonObjectRequest(Request.Method.POST, url, postJSONObject, {
                try {
                    continuation.resume(SUCCESS)

                } catch (e: JSONException) {
                    e.printStackTrace()
                }
            }, {error ->
                continuation.resume(error.networkResponse.statusCode)
                error.printStackTrace()
            })

            queue.add(request)
        }

    suspend fun patchRequest(url: String, patchJSONObject: JSONObject): Int =
        suspendCoroutine { continuation ->
            val queue = Volley.newRequestQueue(context)
            val request =
                JsonObjectRequest(Request.Method.PATCH, url, patchJSONObject, {
                    try {
                        continuation.resume(SUCCESS)

                    } catch (e: JSONException) {
                        e.printStackTrace()
                    }
                }, {error->
                        continuation.resume(error.networkResponse.statusCode)
                    error.printStackTrace()
                })

            queue.add(request)
        }
}
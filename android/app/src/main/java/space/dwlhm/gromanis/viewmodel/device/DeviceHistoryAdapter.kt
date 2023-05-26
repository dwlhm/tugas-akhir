package space.dwlhm.gromanis.viewmodel.device

import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.content.ContextCompat.getSystemService
import androidx.recyclerview.widget.RecyclerView
import space.dwlhm.gromanis.Config
import space.dwlhm.gromanis.R


class DeviceHistoryAdapter(
    private val dataSet: Array<String>,
    private val context: Context
) : RecyclerView.Adapter<DeviceHistoryAdapter.ViewHolder>() {

    private lateinit var manager: DownloadManager

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val title: TextView = view.findViewById(R.id.history_txt_title)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.adapter_history_device_list, parent, false)

        return ViewHolder(view)
    }

    override fun getItemCount(): Int = dataSet.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        Log.v("HISTORY", dataSet[position])
        holder.title.text = dataSet[position] + ".csv"

        holder.title.setOnClickListener {
            Log.v("Download", "${Config.HTTP_BASE_URL}/${dataSet[position]}.csv")
            manager = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            val uri =
                Uri.parse("${Config.HTTP_BASE_URL}/${dataSet[position]}.csv")
            val request = DownloadManager.Request(uri)
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            manager.enqueue(request)
        }
    }
}
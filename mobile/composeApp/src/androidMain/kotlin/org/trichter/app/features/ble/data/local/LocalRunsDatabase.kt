package org.trichter.app.features.ble.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import org.trichter.app.features.recording.data.LocalMediaDao
import org.trichter.app.features.recording.data.LocalMediaEntity

@Database(
    entities = [LocalRunEntity::class, LocalMediaEntity::class],
    version = 3,
    exportSchema = false,
)
abstract class LocalRunsDatabase : RoomDatabase() {
    abstract fun localRunDao(): LocalRunDao
    abstract fun localMediaDao(): LocalMediaDao

    companion object {
        private var instance: LocalRunsDatabase? = null

        fun getInstance(context: Context): LocalRunsDatabase {
            return instance ?: synchronized(this) {
                instance ?: Room.databaseBuilder(
                    context.applicationContext,
                    LocalRunsDatabase::class.java,
                    "trichter_local_runs.db"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                    .also { instance = it }
            }
        }
    }
}

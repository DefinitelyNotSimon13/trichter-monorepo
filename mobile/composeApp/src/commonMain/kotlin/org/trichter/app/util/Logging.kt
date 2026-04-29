package org.trichter.app.util

import io.ktor.client.plugins.logging.Logger


class KtorLogger : Logger {
    override fun log(message: String) {
        Log.i("KTOR", message);
    }
}

expect class Log() {
    companion object {
        fun d(tag: String, message: String)
        fun d(tag: String?, message: String?, tr: Throwable?)
        fun i(tag: String, message: String)
        fun w(tag: String, message: String)
        fun e(tag: String, message: String)
        fun e(tag: String?, message: String?, tr: Throwable?)
    }
}
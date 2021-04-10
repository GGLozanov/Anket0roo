package com.lozanov.anket0roo.util

val String?.isURL: Boolean get() {
    if (this == null) {
        return false
    }
    val urlPattern = "^http(s{0,1})://[a-zA-Z0-9_/\\-\\.]+\\.([A-Za-z/]{2,5})[a-zA-Z0-9_/\\&\\?\\=\\-\\.\\~\\%]*"
    return this.matches(Regex(urlPattern))
}
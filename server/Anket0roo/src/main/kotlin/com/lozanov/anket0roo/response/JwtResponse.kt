package com.lozanov.anket0roo.response

import java.io.Serializable

@kotlinx.serialization.Serializable
data class JwtResponse(
    val token: String
): Serializable {
    companion object {
        private const val serialVersionUID = -8091879091924046844L
    }
}
package com.lozanov.TicketMachine.request

import java.io.Serializable

@kotlinx.serialization.Serializable
data class JwtRequest(
    var username: String? = null,
    var password: String? = null
) : Serializable {
    companion object {
        private const val serialVersionUID = 5926468583005150707L
    }
}
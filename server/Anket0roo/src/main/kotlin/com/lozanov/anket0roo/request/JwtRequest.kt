package com.lozanov.anket0roo.request

import java.io.Serializable
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Size

@kotlinx.serialization.Serializable
data class JwtRequest(
    @NotBlank
    @Size(max = 25)
    var username: String? = null,
    @NotBlank
    @Size(max = 120)
    var password: String? = null
) : Serializable {
    companion object {
        private const val serialVersionUID = 5926468583005150707L
    }
}
package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.advice.Anket0rooResponseEntityExceptionHandler
import com.lozanov.anket0roo.util.AuthenticationFacade
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.MalformedJwtException
import io.jsonwebtoken.SignatureException
import io.jsonwebtoken.UnsupportedJwtException
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import java.lang.IllegalArgumentException

@Component
class AuthenticationProvider : AuthenticationFacade {
    override fun getAuthentication(): Authentication? = SecurityContextHolder.getContext().authentication

    fun getAuthenticationWithValidation(): Authentication {
        val auth = getAuthentication()
        if(auth == null || !auth.isAuthenticated) {
            throw BadCredentialsException("Questionnaire authenticated user has bad credentials!")
        }
        return auth
    }

    fun <T: Any> executeWithAuthAwareAndControllerContext(
        block: () -> ResponseEntity<*>,
        onExpiredJwt: (ex: ExpiredJwtException) -> T
    ): ResponseEntity<*> {
        return try {
            block()
        } catch(ex: Exception) {
            when(ex) {
                is IllegalArgumentException -> {
                    throw Anket0rooResponseEntityExceptionHandler.InvalidFormatException("Invalid input information supplied!")
                }
                is MalformedJwtException -> {
                    throw Anket0rooResponseEntityExceptionHandler.InvalidFormatException("Link is malformed!")
                }
                is ExpiredJwtException -> {
                    return ResponseEntity.ok(onExpiredJwt(ex))
                }
                is UnsupportedJwtException -> {
                    throw Anket0rooResponseEntityExceptionHandler.RequestFormatException("Bad request format for unsupported JWT operation.")
                }
                is SignatureException -> {
                    throw IllegalAccessException("Bad signature for link's JWT!")
                }
                else -> throw ex
            }
        }
    }
}
package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.util.AuthenticationFacade
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component

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
}
package com.lozanov.anket0roo.util

import org.springframework.security.core.Authentication

interface AuthenticationFacade {
    fun getAuthentication(): Authentication?
}
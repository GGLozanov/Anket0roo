package com.lozanov.anket0roo.controller

import com.lozanov.anket0roo.request.JwtRequest
import com.lozanov.anket0roo.response.JwtResponse
import com.lozanov.anket0roo.response.Response
import com.lozanov.anket0roo.service.JwtUserDetailsService
import com.lozanov.anket0roo.util.JwtTokenUtil
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.DisabledException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@RestController
@CrossOrigin
class AuthController(
    private val authenticationManager: AuthenticationManager,
    private val jwtTokenUtil: JwtTokenUtil,
    private val userDetailsService: JwtUserDetailsService
) {
    @PostMapping(value = ["/authenticate"])
    @Throws(Exception::class)
    fun createAuthenticationToken(@Valid @RequestBody authenticationRequest: JwtRequest): ResponseEntity<*> {
        if(authenticationRequest.username != null && authenticationRequest.password != null) {
            authenticate(authenticationRequest.username!!, authenticationRequest.password!!)
            val userDetails: UserDetails = userDetailsService
                    .loadUserByUsername(authenticationRequest.username!!)
            val token = jwtTokenUtil.generateToken(userDetails)
            println("Generated token: ${token}")
            return ResponseEntity.ok<Any>(JwtResponse(token))
        }

        return ResponseEntity.badRequest().body<Any>(Response("Missing data (username/password)!"))
    }

    @Throws(Exception::class)
    private fun authenticate(username: String, password: String) {
        authenticationManager.authenticate(UsernamePasswordAuthenticationToken(username, password))
    }
}
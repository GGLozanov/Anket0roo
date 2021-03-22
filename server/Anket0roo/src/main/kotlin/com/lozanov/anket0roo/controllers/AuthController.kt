package com.lozanov.anket0roo.controllers

import com.lozanov.anket0roo.request.JwtRequest
import com.lozanov.anket0roo.response.JwtResponse
import com.lozanov.anket0roo.service.JwtUserDetailsService
import com.lozanov.anket0roo.util.JwtTokenUtil
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.DisabledException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin
class AuthController(
    private val authenticationManager: AuthenticationManager,
    private val jwtTokenUtil: JwtTokenUtil,
    private val userDetailsService: JwtUserDetailsService
) {
    @RequestMapping(value = ["/authenticate"], method = [RequestMethod.POST])
    @Throws(Exception::class)
    fun createAuthenticationToken(@RequestBody authenticationRequest: JwtRequest): ResponseEntity<*>? {
        if(authenticationRequest.username != null && authenticationRequest.password != null) {
            authenticate(authenticationRequest.username!!, authenticationRequest.password!!)
            val userDetails: UserDetails = userDetailsService
                    .loadUserByUsername(authenticationRequest.username!!)
            val token = jwtTokenUtil.generateToken(userDetails)
            println("Generated token: ${token}")
            return ResponseEntity.ok<Any>(JwtResponse(token))
        }

        return ResponseEntity.badRequest().build<Any>()
    }

    @Throws(Exception::class)
    private fun authenticate(username: String, password: String) {
        authenticationManager.authenticate(UsernamePasswordAuthenticationToken(username, password))
    }
}
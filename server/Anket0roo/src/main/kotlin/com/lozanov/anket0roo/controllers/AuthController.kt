package com.lozanov.TicketMachine.controllers

import com.lozanov.TicketMachine.RetryApplication
import com.lozanov.TicketMachine.request.JwtRequest
import com.lozanov.TicketMachine.response.JwtResponse
import com.lozanov.TicketMachine.service.JwtUserDetailsService
import com.lozanov.TicketMachine.util.JwtTokenUtil
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
class AuthController {
    @Autowired
    private val hardcodedUsers: RetryApplication.UserBean? = null

    @Autowired
    private val authenticationManager: AuthenticationManager? = null

    @Autowired
    private val jwtTokenUtil: JwtTokenUtil? = null

    @Autowired
    private val userDetailsService: JwtUserDetailsService? = null

    @RequestMapping(value = ["/authenticate"], method = [RequestMethod.POST])
    @Throws(Exception::class)
    fun createAuthenticationToken(@RequestBody authenticationRequest: JwtRequest): ResponseEntity<*>? {
        if(authenticationRequest.username != null && authenticationRequest.password != null) {
            authenticate(authenticationRequest.username!!, authenticationRequest.password!!)
            if(userDetailsService != null) {
                val userDetails: UserDetails = userDetailsService
                        .loadUserByUsername(authenticationRequest.username!!)
                val token = jwtTokenUtil!!.generateToken(userDetails)
                println("Generated token: ${token}")
                return ResponseEntity.ok<Any>(JwtResponse(token))
            }
        }

        return ResponseEntity.badRequest().build<Any>()
    }

    @Throws(Exception::class)
    private fun authenticate(username: String, password: String) {
        try {

            authenticationManager!!.authenticate(UsernamePasswordAuthenticationToken(username, password))
        } catch (e: DisabledException) {
            throw Exception("USER_DISABLED", e)
        } catch (e: BadCredentialsException) {
            print("Bad credentials")
            throw Exception("INVALID_CREDENTIALS", e)
        }
    }
}
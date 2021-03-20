package com.lozanov.TicketMachine.service

import com.lozanov.TicketMachine.RetryApplication
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import java.util.*

@Service
class JwtUserDetailsService : UserDetailsService {

    @Autowired
    private var hardcodedUsers: RetryApplication.UserBean? = null

    @Throws(UsernameNotFoundException::class)
    override fun loadUserByUsername(username: String): UserDetails {
        // compare db users and give out granted authority here
        println("Attempting to find user")
        println("User attempted to be found: ${hardcodedUsers!!.users.find {
            it.username == username
        }}")

        return hardcodedUsers!!.users.find {
            it.username == username
        } ?: throw UsernameNotFoundException("User not found with username: " + username);
    }
}
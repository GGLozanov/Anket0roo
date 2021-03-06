package com.lozanov.anket0roo.config

import com.lozanov.anket0roo.controller.MediaController
import com.lozanov.anket0roo.filter.JwtRequestFilter
import com.lozanov.anket0roo.handler.JwtAuthenticationEntryPoint
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.security.web.firewall.DefaultHttpFirewall
import org.springframework.security.web.firewall.HttpFirewall


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
class WebSecurityConfig : WebSecurityConfigurerAdapter() {
    @Autowired
    private val jwtAuthenticationEntryPoint: JwtAuthenticationEntryPoint? = null

    @Autowired
    private val jwtUserDetailsService: UserDetailsService? = null

    @Autowired
    private val jwtRequestFilter: JwtRequestFilter? = null

    @Autowired
    private val passwordEncoder: BCryptPasswordEncoder? = null

    @Autowired
    @Throws(Exception::class)
    fun configureGlobal(auth: AuthenticationManagerBuilder) {
        // configure AuthenticationManager so that it knows from where to load
        // user for matching credentials
        // Use BCryptPasswordEncoder
        auth.userDetailsService(jwtUserDetailsService)
                .passwordEncoder(passwordEncoder)
                .and().eraseCredentials(false)
    }

    @Bean
    @Throws(Exception::class)
    override fun authenticationManagerBean(): AuthenticationManager {
        return super.authenticationManagerBean()
    }

    class AuthenticatedUsernameValidator {
        fun checkUsername(authentication: Authentication?, username: String): Boolean {
            print("authentication: ${authentication?.name}; username sent: $username")
            return authentication != null && authentication.isAuthenticated && authentication.name == username
        }
    }

    @Bean
    fun authenticatedUsernameValidator(): AuthenticatedUsernameValidator {
        return AuthenticatedUsernameValidator()
    }

    @Bean
    fun defaultHttpFirewall(): HttpFirewall? {
        return DefaultHttpFirewall()
    }

    @Throws(Exception::class)
    override fun configure(httpSecurity: HttpSecurity) {
        // We don't need CSRF for this example
        httpSecurity.cors().and().csrf().disable() // don't authenticate this particular request
                .authorizeRequests()
                .antMatchers(HttpMethod.POST, "/authenticate", "/users").permitAll()
                .antMatchers("/questionnaires/{tokenUrl}/**").permitAll()
                .antMatchers(HttpMethod.GET, "${MediaController.QUESTIONNAIRES_MEDIA_PATH}/**").permitAll() // FIXME: If this were a real project, this would require auth and validation of ownership of resource (!)
                .antMatchers("/users/{username}/**").access("@authenticatedUsernameValidator.checkUsername(authentication, #username)")
                .anyRequest() // all other requests need to be authenticated
                .authenticated().and().exceptionHandling() // make sure we use stateless session; session won't be used to store user's state.
                .authenticationEntryPoint(jwtAuthenticationEntryPoint).and().sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)

        // Add a com.lozanov.TicketMachine.filter to validate the tokens with every request
        httpSecurity.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter::class.java)
    }
}
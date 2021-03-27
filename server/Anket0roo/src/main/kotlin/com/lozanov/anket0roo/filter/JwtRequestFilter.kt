package com.lozanov.anket0roo.filter

import com.lozanov.anket0roo.service.JwtUserDetailsService
import com.lozanov.anket0roo.util.JwtTokenUtil
import io.jsonwebtoken.ExpiredJwtException
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException
import javax.servlet.FilterChain
import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletRequestWrapper
import javax.servlet.http.HttpServletResponse

@Component
class JwtRequestFilter(
    private val jwtUserDetailsService: JwtUserDetailsService,
    private val jwtTokenUtil: JwtTokenUtil,
    private val passwordEncoder: BCryptPasswordEncoder
) : OncePerRequestFilter() {

    inner class UserCreateHttpServletRequest(req: HttpServletRequest) : HttpServletRequestWrapper(req) {
        override fun getParameter(name: String?): String {
            var res = super.getParameter(name)
            if("password" == name) {
                passwordEncoder.encode(res)
            }
            return res
        }

        override fun getParameterValues(name: String?): Array<String> {
            val values = super.getParameterValues(name)
            if ("password" == name) {
                for (index in values.indices) {
                    values[index] = passwordEncoder.encode(values[index])
                }
            }
            return values
        }
    }

    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain) {
        val requestTokenHeader = request.getHeader("Authorization")
        var username: String? = null
        var jwtToken: String? = null
        // JWT Token is in the form "Bearer token". Remove Bearer word and get
        // only the Token

        logger.info("Doing filter internal")

        if(request.requestURL.contains("/authenticate") && request.method == HttpMethod.POST.name) {
            chain.doFilter(request, response)
            println("Resuming for endpoint without needed token")
            return
        } // guard clause against endpoints with no need for token

        if(request.requestURL.contains("/user") && request.method == HttpMethod.POST.name) {
            chain.doFilter(UserCreateHttpServletRequest(request), response)
            println("Resuming for endpoint without needed token")
            return
        }

        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7)
            try {
                username = jwtTokenUtil.getUsernameFromToken(jwtToken)
            } catch (e: IllegalArgumentException) {
                println("Unable to get JWT Token")
            } catch (e: ExpiredJwtException) {
                println("JWT Token has expired")
            }
        } else {
            logger.warn("JWT Token does not begin with Bearer String")
        }

        // Once we get the token validate it.
        if (username != null && SecurityContextHolder.getContext().authentication == null) {
            val userDetails = jwtUserDetailsService.loadUserByUsername(username)

            // if token is valid configure Spring Security to manually set
            // authentication
            if (jwtTokenUtil.validateToken(jwtToken, userDetails.username)) {
                val usernamePasswordAuthenticationToken = UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.authorities)
                usernamePasswordAuthenticationToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                // After setting the Authentication in the context, we specify
                // that the current user is authenticated. So it passes the
                // Spring Security Configurations successfully.
                SecurityContextHolder.getContext().authentication = usernamePasswordAuthenticationToken
            }
        }
        chain.doFilter(request, response)
    }
}
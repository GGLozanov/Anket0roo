package com.lozanov.anket0roo.filter

import com.lozanov.anket0roo.controller.MediaController
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
import javax.servlet.ServletInputStream
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletRequestWrapper
import javax.servlet.http.HttpServletResponse


@Component
class JwtRequestFilter(
    private val jwtUserDetailsService: JwtUserDetailsService,
    private val jwtTokenUtil: JwtTokenUtil,
) : OncePerRequestFilter() {

    // dun work for now
//    inner class UserCreateHttpServletRequest(req: HttpServletRequest) : HttpServletRequestWrapper(req) {
//        override fun getParameter(name: String?): String {
//            var res = super.getParameter(name)
//            print("filtering per getParameter")
//            if("password" == name) {
//                res = passwordEncoder.encode(res)
//            }
//            return res
//        }
//
//        override fun getParameterValues(name: String?): Array<String> {
//            val values = super.getParameterValues(name)
//            print("filtering per getParameterValues")
//            if ("password" == name) {
//                for (index in values.indices) {
//                    values[index] = passwordEncoder.encode(values[index])
//                }
//            }
//            return values
//        }
//
//        override fun getParameterMap(): MutableMap<String, Array<String>> {
//            val map = super.getParameterMap()
//            print("filtering per getParameterMap")
//            return map.apply {
//                replace("password", arrayOf(passwordEncoder.encode(get("password").toString())))
//            }
//        }
//
//        override fun getQueryString(): String? {
//                val map: Map<String, Array<String>> = parameterMap
//            val builder = StringBuilder()
//            for (param in map.keys) {
//                val isParamPassword = param == "password"
//                for (value in map[param]!!) {
//                    builder.append(param).append("=").append(if(isParamPassword)
//                        passwordEncoder.encode(value) else value).append("&")
//                }
//            }
//            builder.deleteCharAt(builder.length - 1)
//            return builder.toString()
//        }
//    }

    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain) {
        val requestTokenHeader = request.getHeader("Authorization")
        var username: String? = null
        var jwtToken: String? = null
        // JWT Token is in the form "Bearer token". Remove Bearer word and get
        // only the Token

        logger.info("Doing filter internal")

        if(((request.requestURL.equals("/authenticate") ||
                        request.requestURL.equals("/user")) && request.method == HttpMethod.POST.name) ||
                (request.requestURL.contains(MediaController.QUESTIONNAIRES_MEDIA_PATH) && request.method == HttpMethod.GET.name)) {
            chain.doFilter(request, response)
            println("Resuming for endpoint without needed token")
            return
        } // guard clause against endpoints with no need for token

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
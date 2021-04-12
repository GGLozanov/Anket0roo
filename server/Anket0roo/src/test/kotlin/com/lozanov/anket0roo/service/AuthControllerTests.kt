package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.Anket0rooApplication
import com.lozanov.anket0roo.repository.UserRepository
import com.lozanov.anket0roo.request.JwtRequest
import com.lozanov.anket0roo.util.JwtTokenUtil
import kotlinx.serialization.json.Json
import org.assertj.core.api.BDDAssumptions.given
import org.hamcrest.Matchers
import org.junit.jupiter.api.Test
import org.junit.runner.RunWith
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.security.core.userdetails.User
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder


@RunWith(SpringRunner::class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK, classes = [Anket0rooApplication::class])
@AutoConfigureMockMvc
class AuthControllerTests {
    @MockBean
    private lateinit var userRepository: UserRepository
    @MockBean
    private lateinit var userDetailsService: JwtUserDetailsService
    @MockBean
    private lateinit var authenticationManager: AuthenticationManager
    @Autowired
    private lateinit var bCryptPasswordEncoder: BCryptPasswordEncoder

    @Autowired
    private lateinit var mvc: MockMvc

    @Test
    fun givenValidCredentials_Create() {
        val username = "George Lozanov"
        val password = "popeye"

        // IMPL doesn't matter (not my class and I don't use it), but it's ALWAYS valid
        Mockito.`when`(authenticationManager.authenticate(UsernamePasswordAuthenticationToken(username, password)))
                .thenReturn(object : Authentication {
                    override fun getName(): String {
                        TODO("Not yet implemented")
                    }

                    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
                        TODO("Not yet implemented")
                    }

                    override fun getCredentials(): Any {
                        TODO("Not yet implemented")
                    }

                    override fun getDetails(): Any {
                        TODO("Not yet implemented")
                    }

                    override fun getPrincipal(): Any {
                        TODO("Not yet implemented")
                    }

                    override fun isAuthenticated(): Boolean {
                        TODO("Not yet implemented")
                    }

                    override fun setAuthenticated(isAuthenticated: Boolean) {
                        TODO("Not yet implemented")
                    }

                })

        // wew, can't bypass making actual mocks
        val user = User(username,
                bCryptPasswordEncoder.encode(password), listOf())
        Mockito.`when`(userDetailsService.loadUserByUsername(username)).thenReturn(user)

        Mockito.`when`(userRepository.findByUsername(username))
                .thenReturn(com.lozanov.anket0roo.model.User(0, username, password))

        mvc.perform(MockMvcRequestBuilders.post("/authenticate")
                .content(Json.encodeToString(JwtRequest.serializer(), JwtRequest(username, password)))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk)
                .andExpect(MockMvcResultMatchers.jsonPath("$.token", Matchers.notNullValue()))

        given(userDetailsService.loadUserByUsername(username)).isEqualTo(user)
    }
}
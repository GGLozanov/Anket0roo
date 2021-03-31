package com.lozanov.anket0roo.controller

import com.lozanov.anket0roo.model.User
import com.lozanov.anket0roo.response.JwtResponse
import com.lozanov.anket0roo.service.UserService
import com.lozanov.anket0roo.util.JwtTokenUtil
import kotlinx.coroutines.ExperimentalCoroutinesApi
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@RestController
@CrossOrigin
class UserController(
    private val userService: UserService,
    private val jwtTokenUtil: JwtTokenUtil,
    private val passwordEncoder: BCryptPasswordEncoder
) {
    @PostMapping(value = ["/users"])
    @ResponseBody
    fun createUser(@Valid @RequestBody user: User): ResponseEntity<*>? {
        val savedUser = userService.createUser(user.copy(password = passwordEncoder.encode(user.password)))
        return ResponseEntity.ok(JwtResponse(jwtTokenUtil.generateToken(
                    org.springframework.security.core.userdetails.User(savedUser.username, savedUser.password, listOf()))))
    }

    @GetMapping(value = ["users/{username}"])
    @ResponseBody
    fun getUserById(@PathVariable("username") username: String): ResponseEntity<*>? {
        val user = userService.findUserByUsername(username)
        return ResponseEntity.ok(user)
    }
}
package com.lozanov.anket0roo.controllers

import com.lozanov.anket0roo.model.User
import com.lozanov.anket0roo.request.JwtRequest
import com.lozanov.anket0roo.response.JwtResponse
import com.lozanov.anket0roo.service.UserService
import com.lozanov.anket0roo.util.JwtTokenUtil
import kotlinx.coroutines.ExperimentalCoroutinesApi
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*
import javax.persistence.PersistenceException
import javax.validation.Valid

@RestController
@CrossOrigin
@ExperimentalCoroutinesApi
class UserController(
    private val userService: UserService,
    private val jwtTokenUtil: JwtTokenUtil,
) {

    @ExperimentalCoroutinesApi
    @PostMapping(value = ["/user"])
    @ResponseBody
    suspend fun createUser(@Valid @RequestBody user: User): ResponseEntity<*>? {
        val savedUser = userService.createUser(user)
        return ResponseEntity.ok(JwtResponse(jwtTokenUtil.generateToken(
                    org.springframework.security.core.userdetails.User(savedUser.username, savedUser.password, listOf()))))
    }

    @GetMapping(value = ["user/{id}"])
    @ResponseBody
    fun getUserById(@PathVariable id: String): ResponseEntity<*>? {
        val user = userService.findUser(id.toInt())
        return ResponseEntity.ok(user)
    }
}
package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.model.User
import com.lozanov.anket0roo.repository.UserRepository
import kotlinx.coroutines.ExperimentalCoroutinesApi
import org.springframework.stereotype.Service
import javax.persistence.EntityNotFoundException
import javax.persistence.PersistenceException

@Service
class UserService(
    private val userRepository: UserRepository
) {
    fun createUser(user: User): User =
        userRepository.save(user)

    fun findUserByUsername(username: String): User =
        userRepository.findByUsername(username) ?: throw EntityNotFoundException()

    fun findUserIdByUsername(username: String): Int =
        userRepository.findIdByUsername(username) ?: throw EntityNotFoundException()
}
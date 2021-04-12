package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.model.User
import com.lozanov.anket0roo.repository.UserRepository
import com.lozanov.anket0roo.ui.SeleniumAuthenticationPage
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.context.junit4.SpringRunner


@ExtendWith(SpringExtension::class)
@RunWith(SpringRunner::class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@DataJpaTest
class UserRepositoryTest {
    @Autowired
    private lateinit var entityManager: TestEntityManager

    @Autowired
    private lateinit var userRepository: UserRepository

    @Test
    fun whenSaved_thenFindsByName() {
        val username = "100ichkov"

        val user = User(0, username, "bruh@gmail.com", "100ichkovtotallynotgay")

        userRepository.save(user)
        val savedUser = userRepository.findByUsername(username);

        assertThat(user).isNotNull
        assertThat(user.username).isEqualTo(username)

        userRepository.delete(savedUser!!)
    }
}
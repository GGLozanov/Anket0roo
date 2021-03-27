package com.lozanov.anket0roo

import com.lozanov.anket0roo.advice.Anket0rooResponseEntityExceptionHandler
import com.lozanov.anket0roo.service.JwtUserDetailsService
import com.lozanov.anket0roo.util.JwtTokenUtil
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Import
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder

@SpringBootApplication
@Import(Anket0rooResponseEntityExceptionHandler::class)
class Anket0rooApplication {
	@Bean
	fun passwordEncoder(): BCryptPasswordEncoder {
		return BCryptPasswordEncoder()
	}
}

fun main(args: Array<String>) {
	runApplication<Anket0rooApplication>(*args)
}

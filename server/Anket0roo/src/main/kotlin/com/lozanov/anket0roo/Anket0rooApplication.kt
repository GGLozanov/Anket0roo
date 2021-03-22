package com.lozanov.anket0roo

import com.lozanov.anket0roo.service.JwtUserDetailsService
import com.lozanov.anket0roo.util.JwtTokenUtil
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@EnableJpaRepositories("com.lozanov.anket0roo.repository")
@EntityScan("com.lozanov.anket0roo.model")
@ComponentScan("com.lozanov.anket0roo.service")
class Anket0rooApplication

fun main(args: Array<String>) {
	runApplication<Anket0rooApplication>(*args)
}

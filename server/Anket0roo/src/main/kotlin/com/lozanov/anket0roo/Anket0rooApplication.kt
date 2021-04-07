package com.lozanov.anket0roo

import com.lozanov.anket0roo.advice.Anket0rooResponseEntityExceptionHandler
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.net.InetAddress
import javax.servlet.http.HttpServletRequest


@SpringBootApplication
@Import(Anket0rooResponseEntityExceptionHandler::class)
class Anket0rooApplication {
	@Value("\${server.servlet.context-path}")
	private val contextPath: String? = null

	@Value("\${client.url}")
	private val clientUrl: String? = null

	@Bean
	fun passwordEncoder(): BCryptPasswordEncoder {
		return BCryptPasswordEncoder()
	}

	@Bean
	fun corsConfigurer(): WebMvcConfigurer {
		return object : WebMvcConfigurer {
			override fun addCorsMappings(registry: CorsRegistry) {
				// val host = InetAddress.getLocalHost().hostAddress
				// val appUrl = java.lang.String.format("http://localhost:%s%s", port, contextPath)
				println(clientUrl)
				registry.addMapping(contextPath!!).allowedOrigins(clientUrl)
			}
		}
	}
}

fun main(args: Array<String>) {
	runApplication<Anket0rooApplication>(*args)
}

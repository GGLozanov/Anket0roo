package com.lozanov.anket0roo.model

import org.springframework.security.core.userdetails.UserDetails
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,
    // TODO: Should this be here, lol
   val details: UserDetails
)

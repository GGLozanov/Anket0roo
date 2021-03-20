package com.lozanov.anket0roo.model

import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id

data class Questionnaire(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int
)
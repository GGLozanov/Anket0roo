package com.lozanov.anket0roo.repository

import com.lozanov.anket0roo.model.Questionnaire
import org.springframework.data.repository.CrudRepository

interface QuestionnaireRepository : CrudRepository<Questionnaire, Int> {
}
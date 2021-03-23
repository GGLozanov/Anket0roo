package com.lozanov.anket0roo.repository

import com.lozanov.anket0roo.model.Questionnaire
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface QuestionnaireRepository : CrudRepository<Questionnaire, Int> {
    fun findQuestionnairesByPublicTrue(): List<Questionnaire>?

    fun findQuestionnairesByAuthorId(id: Int): List<Questionnaire>?
}
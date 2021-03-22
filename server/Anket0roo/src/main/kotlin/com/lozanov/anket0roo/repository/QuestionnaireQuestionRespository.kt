package com.lozanov.anket0roo.repository

import com.lozanov.anket0roo.model.QuestionnaireQuestion
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface QuestionnaireQuestionRespository : CrudRepository<QuestionnaireQuestion, Int> {
}
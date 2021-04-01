package com.lozanov.anket0roo.repository

import com.lozanov.anket0roo.model.QuestionnaireQuestion
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface QuestionnaireQuestionRespository : CrudRepository<QuestionnaireQuestion, Int> {
    @Query("SELECT COUNT(q_q) FROM QuestionnaireQuestion q_q WHERE q_q.questionAnswerId.questionId NOT IN (:questionIds) AND q_q.question.ownerId = :userId")
    fun countQuestionnaireQuestionsByQuestionIdNotInForUser(questionIds: List<Int>, userId: Int): Int
}
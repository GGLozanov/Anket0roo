package com.lozanov.anket0roo.repository

import com.lozanov.anket0roo.model.Question
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface QuestionRepository : CrudRepository<Question, Int> {
    fun findQuestionByOwnerId(ownerId: Int): List<Question>
}
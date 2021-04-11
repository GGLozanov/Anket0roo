package com.lozanov.anket0roo.repository

import com.lozanov.anket0roo.model.Question
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface QuestionRepository : CrudRepository<Question, Int> {
    fun findQuestionsByOwnerId(ownerId: Int): List<Question>

    @Query("SELECT question FROM Question question, User u WHERE u.username LIKE :username AND question.ownerId = u.id")
    fun findQuestionsByOwnerUsername(username: String): List<Question>

    @Query("SELECT COUNT(q) FROM Question q WHERE q.id IN (:questionIds) AND q.ownerId <> :userId")
    fun countQuestionsByIdNotInForUser(questionIds: List<Int>, userId: Int): Int
}
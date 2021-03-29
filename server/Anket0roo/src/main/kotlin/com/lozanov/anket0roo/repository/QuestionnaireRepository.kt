package com.lozanov.anket0roo.repository

import com.lozanov.anket0roo.model.Questionnaire
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface QuestionnaireRepository : CrudRepository<Questionnaire, Int> {
    fun findQuestionnairesByPublicTrueAndAuthorIdNot(authorId: Int): List<Questionnaire>?

    fun findQuestionnairesByAuthorId(id: Int): List<Questionnaire>?

    @Query("SELECT questionnaire FROM Questionnaire questionnaire, User u WHERE u.username LIKE :username AND u.id = questionnaire.authorId")
    fun findQuestionnaireByAuthorUsername(username: String): List<Questionnaire>?

    @Query("SELECT questionnaire FROM Questionnaire questionnaire, User u WHERE u.username LIKE :username AND u.id = questionnaire.authorId AND questionnaire.id = :id")
    fun findQuestionnairesByAuthorUsernameAndId(username: String, id: Int): Questionnaire?
}
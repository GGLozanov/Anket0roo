package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.model.Questionnaire
import com.lozanov.anket0roo.repository.QuestionnaireQuestionRespository
import com.lozanov.anket0roo.repository.QuestionnaireRepository
import org.springframework.stereotype.Service
import javax.persistence.EntityNotFoundException

@Service
class QuestionnaireService(
    private val questionnaireRepository: QuestionnaireRepository,
) {
    fun getUserQuestionnaires(username: String): List<Questionnaire> =
            questionnaireRepository.findQuestionnaireByAuthorUsername(username) ?: listOf()

    fun getUserQuestionnaireById(username: String, qId: Int): Questionnaire =
            questionnaireRepository.findQuestionnairesByAuthorUsernameAndId(username, qId) ?: throw EntityNotFoundException()

    fun getPublicQuestionnaires(requestUserId: Int): List<Questionnaire> =
        questionnaireRepository.findQuestionnairesByPublicTrueAndAuthorIdNot(requestUserId) ?: listOf()

    fun saveQuestionnaire(questionnaire: Questionnaire): Questionnaire =
            questionnaireRepository.save(questionnaire)
    
    fun getQuestionnaireById(id: Int): Questionnaire =
            questionnaireRepository.findById(id).orElseThrow()
    
    fun checkUserOwnership(userId: Int, qId: Int): Boolean =
            questionnaireRepository.countQuestionnairesByAuthorIdAndId(userId, qId) == 1
}
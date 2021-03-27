package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.model.Questionnaire
import com.lozanov.anket0roo.repository.QuestionnaireRepository
import org.springframework.stereotype.Service
import javax.persistence.EntityNotFoundException

@Service
class QuestionnaireService(private val questionnaireRepository: QuestionnaireRepository) {
    fun getUserQuestionnaires(userId: Int): List<Questionnaire> =
            questionnaireRepository.findQuestionnairesByAuthorId(userId) ?: listOf()

    fun getUserQuestionnaireById(userId: Int, qId: Int): Questionnaire =
            questionnaireRepository.findQuestionnairesByAuthorIdAndId(userId, qId) ?: throw EntityNotFoundException()

    fun getPublicQuestionnaires(requestUserId: Int): List<Questionnaire> =
        questionnaireRepository.findQuestionnairesByPublicTrueAndAuthorIdNot(requestUserId) ?: listOf()

    fun saveQuestionnaire(questionnaire: Questionnaire): Questionnaire =
            questionnaireRepository.save(questionnaire)
    
    fun getQuestionnaireById(id: Int): Questionnaire =
            questionnaireRepository.findById(id).orElseThrow()
}
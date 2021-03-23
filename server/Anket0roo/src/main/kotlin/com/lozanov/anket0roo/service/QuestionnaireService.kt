package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.model.Questionnaire
import com.lozanov.anket0roo.repository.QuestionnaireRepository
import org.springframework.stereotype.Service

@Service
class QuestionnaireService(private val questionnaireRepository: QuestionnaireRepository) {
    fun getUserQuestionnaires(userId: Int): List<Questionnaire> =
            questionnaireRepository.findQuestionnairesByAuthorId(userId) ?: listOf()

    fun getPublicQuestionnaires(): List<Questionnaire> =
        questionnaireRepository.findQuestionnairesByPublicTrue() ?: listOf()

    fun createQuestionnaire(questionnaire: Questionnaire): Questionnaire =
            questionnaireRepository.save(questionnaire)
    
    fun getQuestionnaireById(id: Int): Questionnaire =
            questionnaireRepository.findById(id).orElseThrow()
}
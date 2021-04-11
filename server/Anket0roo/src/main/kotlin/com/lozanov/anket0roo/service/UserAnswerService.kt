package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.model.UserAnswer
import com.lozanov.anket0roo.repository.UserAnswerRepository
import org.springframework.stereotype.Service

@Service
class UserAnswerService(private val userAnswerRepository: UserAnswerRepository) {
    fun saveUserAnswers(userAnswer: List<UserAnswer>): Iterable<UserAnswer> =
        userAnswerRepository.saveAll(userAnswer)

    fun getUserAnswers(qId: java.lang.Integer): List<UserAnswer> =
        userAnswerRepository.findUserAnswersByQuestionnaireId(qId)
}
package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.model.UserAnswer
import com.lozanov.anket0roo.repository.UserAnswerRepository
import org.springframework.stereotype.Service

@Service
class UserAnswerService(private val userAnswerRepository: UserAnswerRepository) {
    fun saveUserAnswers(userAnswer: List<UserAnswer>) {
        // how do you pass an adequate body and save it without overhead 9000
    }

    fun getUserAnswers(qId: Int): List<UserAnswer> =
        userAnswerRepository.findUserAnswersByQuestionnaire_Id(qId)
}
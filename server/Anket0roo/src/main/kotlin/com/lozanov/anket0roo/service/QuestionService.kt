package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.model.Question
import com.lozanov.anket0roo.repository.QuestionRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class QuestionService(private val questionRepository: QuestionRepository) {
    fun createQuestion(question: Question): Question = questionRepository.save(question)

    fun findUserQuestions(username: String): List<Question> = questionRepository.findQuestionsByOwnerUsername(username)

    fun findQuestionsByIds(ids: List<Int>): MutableIterable<Question> = questionRepository.findAllById(ids)

    fun countQuestionsByIdNotInForUser(questionIds: List<Int>, userId: Int): Int =
            questionRepository.countQuestionsByIdNotInForUser(questionIds, userId)
}
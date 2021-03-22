package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.repository.QuestionRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class QuestionService(private val questionRepository: QuestionRepository) {

}
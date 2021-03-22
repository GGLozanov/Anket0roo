package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.repository.QuestionnaireRepository
import org.springframework.stereotype.Service

@Service
class QuestionnaireService(private val questionnaireRepository: QuestionnaireRepository) {
}
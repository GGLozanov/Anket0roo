package com.lozanov.anket0roo.repository

import com.lozanov.anket0roo.model.Question
import org.springframework.data.repository.CrudRepository

interface QuestionRepository : CrudRepository<Question, Int> {
}
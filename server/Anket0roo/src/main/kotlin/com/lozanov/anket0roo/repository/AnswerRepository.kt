package com.lozanov.anket0roo.repository

import com.lozanov.anket0roo.model.Answer
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface AnswerRepository : CrudRepository<Answer, Int> {
}
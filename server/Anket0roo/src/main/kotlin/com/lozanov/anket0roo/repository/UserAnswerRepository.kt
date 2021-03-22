package com.lozanov.anket0roo.repository

import com.lozanov.anket0roo.model.UserAnswer
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserAnswerRepository : CrudRepository<UserAnswer, Int> {
}
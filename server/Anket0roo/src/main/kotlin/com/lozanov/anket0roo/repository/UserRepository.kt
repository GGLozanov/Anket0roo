package com.lozanov.anket0roo.repository

import com.lozanov.anket0roo.model.User
import org.springframework.data.repository.CrudRepository

interface UserRepository : CrudRepository<User, Int> {
}
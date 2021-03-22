package com.lozanov.anket0roo.repository

import com.lozanov.anket0roo.model.User
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.*
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import javax.transaction.Transactional

@Repository
interface UserRepository : CrudRepository<User, Int> {
    @Transactional
    fun findByUsername(username: String): User?
}
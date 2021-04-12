package com.lozanov.anket0roo.repository

import com.lozanov.anket0roo.model.IpAnswer
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface IpAnswerRepository : CrudRepository<IpAnswer, Int> {
    fun countByIpAnswerId_Ip(ip: String): Int
}
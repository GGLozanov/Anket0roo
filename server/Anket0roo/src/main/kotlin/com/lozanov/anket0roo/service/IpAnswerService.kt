package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.model.IpAnswer
import com.lozanov.anket0roo.repository.IpAnswerRepository
import org.springframework.stereotype.Service

@Service
class IpAnswerService(private val ipAnswerRepository: IpAnswerRepository) {
    fun validateIp(ip: String): Boolean {
        return ipAnswerRepository.countByIpAnswerId_Ip(ip) == 0
    }

    fun saveIpAnswer(ipAnswer: IpAnswer): IpAnswer {
        return ipAnswerRepository.save(ipAnswer)
    }
}
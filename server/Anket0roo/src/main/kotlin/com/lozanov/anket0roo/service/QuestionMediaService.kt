package com.lozanov.anket0roo.service

import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class QuestionMediaService : MediaService() {
    fun saveQuestionImage(file: MultipartFile) {
        // no special handling... for now
        save(file)
    }
}
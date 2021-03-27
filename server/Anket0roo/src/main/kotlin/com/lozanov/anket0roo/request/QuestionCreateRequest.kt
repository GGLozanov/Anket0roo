package com.lozanov.anket0roo.request

import com.lozanov.anket0roo.model.Question
import org.springframework.web.multipart.MultipartFile

data class QuestionCreateRequest(
    val question: Question,
    val image: MultipartFile?
)

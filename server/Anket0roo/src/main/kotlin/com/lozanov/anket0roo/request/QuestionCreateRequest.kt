package com.lozanov.anket0roo.request

import com.lozanov.anket0roo.model.Question
import kotlinx.serialization.Serializable
import org.springframework.web.multipart.MultipartFile

@Serializable
data class QuestionCreateRequest(
    val question: Question,
    val image: MultipartFile? = null
) : java.io.Serializable

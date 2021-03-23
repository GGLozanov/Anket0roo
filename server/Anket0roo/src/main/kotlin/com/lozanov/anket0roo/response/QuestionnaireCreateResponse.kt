package com.lozanov.anket0roo.response

import com.lozanov.anket0roo.model.Questionnaire
import kotlinx.serialization.Contextual
import java.io.Serializable
import java.net.URL

@kotlinx.serialization.Serializable
data class QuestionnaireCreateResponse(
    val questionnaire: Questionnaire,
    @Contextual
    val uniqueUrl: URL
): Serializable

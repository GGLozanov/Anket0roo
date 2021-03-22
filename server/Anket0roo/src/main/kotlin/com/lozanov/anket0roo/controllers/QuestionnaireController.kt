package com.lozanov.anket0roo.controllers

import com.lozanov.anket0roo.model.Questionnaire
import com.lozanov.anket0roo.model.User
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin
class QuestionnaireController {

    @PostMapping(value = ["/questionnaire"])
    @ResponseBody
    fun createQuestionnaire(@RequestBody questionnaire: Questionnaire): ResponseEntity<*>? {
        TODO("unimplemented")
    }

    @GetMapping(value = ["/questionnaire"])
    @ResponseBody
    fun getUserQuestionnaires(): ResponseEntity<*>? {
        TODO("unimplemented")
    }
}
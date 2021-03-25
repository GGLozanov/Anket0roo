package com.lozanov.anket0roo.controller

import com.lozanov.anket0roo.model.Question
import com.lozanov.anket0roo.service.QuestionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@RestController
@CrossOrigin
class QuestionController(
    private val questionService: QuestionService
) {
    @GetMapping(value = ["/users/{id}/questions"])
    @ResponseBody
    fun getUserQuestions(@PathVariable id: Int): ResponseEntity<*> =
        ResponseEntity.ok(questionService.findUserQuestions(id))

    @PostMapping(value = ["/users/{id}/questions"])
    @ResponseBody
    fun createQuestion(@PathVariable id: Int, @Valid @RequestBody question: Question): ResponseEntity<*> =
        ResponseEntity.ok(questionService.createQuestion(question))
}
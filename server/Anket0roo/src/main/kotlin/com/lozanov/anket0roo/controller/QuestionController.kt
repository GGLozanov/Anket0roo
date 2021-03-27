package com.lozanov.anket0roo.controller

import com.lozanov.anket0roo.model.Question
import com.lozanov.anket0roo.request.QuestionCreateRequest
import com.lozanov.anket0roo.service.MediaService
import com.lozanov.anket0roo.service.QuestionMediaService
import com.lozanov.anket0roo.service.QuestionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import javax.validation.Valid

@RestController
@CrossOrigin
class QuestionController(
    private val questionService: QuestionService,
    private val questionMediaService: QuestionMediaService
) {
    @GetMapping(value = ["/users/{id}/questions"])
    @ResponseBody
    fun getUserQuestions(@PathVariable id: Int): ResponseEntity<*> =
        ResponseEntity.ok(questionService.findUserQuestions(id))

    @PostMapping(value = ["/users/{id}/questions"])
    @ResponseBody
    fun createQuestion(@PathVariable id: Int, @Valid @RequestBody questionCreateRequest: QuestionCreateRequest): ResponseEntity<*> {
        // TODO: Question should arrive with link regex'd into its content at the end (with the appropriate file name)
        // TODO: Frontend will extract this link & ping the endpoint at MediaController
        val createdQuestion = questionService.createQuestion(questionCreateRequest.question)

        questionCreateRequest.image?.let {
            questionMediaService.saveQuestionImage(it)
        }

        return ResponseEntity.ok(createdQuestion)
    }
}
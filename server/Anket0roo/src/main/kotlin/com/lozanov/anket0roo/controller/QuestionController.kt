package com.lozanov.anket0roo.controller

import com.lozanov.anket0roo.advice.Anket0rooResponseEntityExceptionHandler
import com.lozanov.anket0roo.model.Question
import com.lozanov.anket0roo.request.QuestionCreateRequest
import com.lozanov.anket0roo.service.MediaService
import com.lozanov.anket0roo.service.QuestionMediaService
import com.lozanov.anket0roo.service.QuestionService
import com.lozanov.anket0roo.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import javax.validation.Valid

@RestController
@CrossOrigin
class QuestionController(
    private val questionService: QuestionService,
    private val userService: UserService,
    private val questionMediaService: QuestionMediaService
) {
    @GetMapping(value = ["/users/{username}/questions"])
    @ResponseBody
    fun getUserQuestions(@PathVariable username: String): ResponseEntity<*> =
        ResponseEntity.ok(questionService.findUserQuestions(userService.findUserIdByUsername(username)))

    @PostMapping(value = ["/users/{username}/questions"])
    @ResponseBody
    fun createQuestion(@PathVariable username: String, @Valid @RequestBody questionCreateRequest: QuestionCreateRequest): ResponseEntity<*> {
        // TODO: Question should arrive with link regex'd into its content at the end (with the appropriate file name)
        // TODO: Frontend will extract this link & ping the endpoint at MediaController
        if(questionCreateRequest.question.ownerId != userService.findUserIdByUsername(username)) {
            throw Anket0rooResponseEntityExceptionHandler.InvalidFormatException("Question cannot have a different owner than authenticated user!")
        }

        val createdQuestion = questionService.createQuestion(questionCreateRequest.question)

        questionCreateRequest.image?.let {
            questionMediaService.saveQuestionImage(it)
        }

        return ResponseEntity.ok(createdQuestion)
    }
}
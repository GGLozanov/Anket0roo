package com.lozanov.anket0roo.controller

import com.lozanov.anket0roo.advice.Anket0rooResponseEntityExceptionHandler
import com.lozanov.anket0roo.model.Question
import com.lozanov.anket0roo.request.QuestionCreateRequest
import com.lozanov.anket0roo.service.MediaService
import com.lozanov.anket0roo.service.QuestionMediaService
import com.lozanov.anket0roo.service.QuestionService
import com.lozanov.anket0roo.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import javax.servlet.ServletContext
import javax.validation.Valid

@RestController
@CrossOrigin
class QuestionController(
    private val questionService: QuestionService,
    private val userService: UserService,
    private val questionMediaService: QuestionMediaService,
) {
    private val linkRegex: Regex by lazy {
        Regex(Regex.escape(ServletUriComponentsBuilder.fromCurrentContextPath()
                .replacePath(null)
                .build()
                .toUriString()) +
                "${MediaController.QUESTIONNAIRES_MEDIA_PATH}/[^.]+\\.jpg")
    }

    @GetMapping(value = ["/users/{username}/questions"])
    @ResponseBody
    fun getUserQuestions(@PathVariable username: String): ResponseEntity<*> =
        ResponseEntity.ok(questionService.findUserQuestions(username))

    @PostMapping(value = ["/users/{username}/questions"])
    @ResponseBody
    fun createQuestion(@PathVariable username: String, @Valid @RequestBody questionCreateRequest: QuestionCreateRequest): ResponseEntity<*> {
        val sentFile = questionCreateRequest.image != null

        if(sentFile && !linkRegex.matches(questionCreateRequest.question.question)) {
            throw Anket0rooResponseEntityExceptionHandler.RequestFormatException(
                    "Cannot send request with a question contaning an image without " +
                            "the image name being present in the form of a regex!")
        }

        if(questionCreateRequest.question.ownerId != userService.findUserIdByUsername(username)) {
            throw Anket0rooResponseEntityExceptionHandler.InvalidFormatException(
                    "Question cannot have a different owner than authenticated user!")
        }

        val createdQuestion = questionService.createQuestion(questionCreateRequest.question)

        if(sentFile) {
            questionMediaService.saveQuestionImage(questionCreateRequest.image!!)
        }

        return ResponseEntity.ok(createdQuestion)
    }
}
package com.lozanov.anket0roo.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.lozanov.anket0roo.advice.Anket0rooResponseEntityExceptionHandler
import com.lozanov.anket0roo.model.Question
import com.lozanov.anket0roo.request.QuestionCreateRequest
import com.lozanov.anket0roo.service.MediaService
import com.lozanov.anket0roo.service.QuestionMediaService
import com.lozanov.anket0roo.service.QuestionService
import com.lozanov.anket0roo.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.ui.Model
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
                .toUriString() + MediaController.QUESTIONNAIRES_MEDIA_PATH) + "/[^.]+\\.jpg|.png")
    }

    @GetMapping(value = ["/users/{username}/questions"])
    @ResponseBody
    fun getUserQuestions(@PathVariable username: String): ResponseEntity<*> =
        ResponseEntity.ok(questionService.findUserQuestions(username))

    // TODO: Validation for ModelAttribute
    @PostMapping(value = ["/users/{username}/questions"], consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    @ResponseBody
    fun createQuestion(@PathVariable username: String,
                       @RequestParam requestParams: Map<String, String>,
                       @RequestPart("image") image: MultipartFile?): ResponseEntity<*> {
        val sentFile = image != null
        val question = ObjectMapper().readValue(requestParams["question"], Question::class.java)

        if(sentFile && !linkRegex.containsMatchIn(question.question)) {
            println("File found but incorrectly assoc w/ question")
            throw Anket0rooResponseEntityExceptionHandler.RequestFormatException(
                    "Cannot send request with a question containing an image without " +
                            "the image name being present in the form of a regex!")
        }

        if(question.ownerId != userService.findUserIdByUsername(username)) {
            println("Question different owner!")
            throw Anket0rooResponseEntityExceptionHandler.InvalidFormatException(
                    "Question cannot have a different owner than authenticated user!")
        }

        val createdQuestion = questionService.createQuestion(question)

        if(sentFile) {
            questionMediaService.saveQuestionImage(image!!)
        }

        return ResponseEntity.ok(createdQuestion)
    }
}
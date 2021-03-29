package com.lozanov.anket0roo.controller

import com.lozanov.anket0roo.advice.Anket0rooResponseEntityExceptionHandler
import com.lozanov.anket0roo.model.Questionnaire
import com.lozanov.anket0roo.model.UserAnswer
import com.lozanov.anket0roo.response.QuestionnaireCreateResponse
import com.lozanov.anket0roo.response.Response
import com.lozanov.anket0roo.service.AuthenticationProvider
import com.lozanov.anket0roo.service.QuestionnaireService
import com.lozanov.anket0roo.service.UserAnswerService
import com.lozanov.anket0roo.service.UserService
import com.lozanov.anket0roo.util.JwtTokenUtil
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import java.net.URL
import javax.validation.Valid

@RestController
@CrossOrigin
class QuestionnaireController(
    private val questionnaireService: QuestionnaireService,
    private val jwtTokenUtil: JwtTokenUtil,
    private val authenticationProvider: AuthenticationProvider,
    private val userService: UserService,
    private val userAnswerService: UserAnswerService
) {

    @PostMapping(value = ["/questionnaires"])
    @ResponseBody
    fun createQuestionnaire(@Valid @RequestBody questionnaire: Questionnaire): ResponseEntity<*>? {
        val savedQuestionnaire = questionnaireService.saveQuestionnaire(questionnaire)
        val baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .replacePath(null)
                .build()
                .toUriString()
        return ResponseEntity.ok(
                QuestionnaireCreateResponse(
                    savedQuestionnaire,
                    URL(baseUrl + "/${jwtTokenUtil.generateQuestionnaireAdminToken(
                            authenticationProvider.getAuthenticationWithValidation().name, questionnaire.id)}"),
                    URL(baseUrl +
                            "/${jwtTokenUtil.generateQuestionnaireToken(questionnaire.id)}"
                    )
                )
        )
    }

    @GetMapping(value = ["/users/{username}/questionnaires"])
    @ResponseBody
    fun getUserQuestionnaires(@PathVariable("username") username: String): ResponseEntity<*>? {
        val questionnaires = questionnaireService.getUserQuestionnaires(username)
        return ResponseEntity.ok(questionnaires)
    }

    @GetMapping(value = ["/questionnaires"])
    @ResponseBody
    fun getPublicUserQuestionnaires(): ResponseEntity<*> {
        val questionnaires = questionnaireService.getPublicQuestionnaires(
            userService.findUserIdByUsername(authenticationProvider.getAuthenticationWithValidation().name)
        )
        return ResponseEntity.ok(questionnaires)
    }
    
    @GetMapping(value = ["/questionnaires/{tokenUrl}"])
    @ResponseBody
    fun getQuestionnaire(@PathVariable tokenUrl: String): ResponseEntity<*> {
        fun sendResponseBasedOnQuestionnaireClosed(questionnaire: Questionnaire): ResponseEntity<*> {
            return if(questionnaire.closed) {
                ResponseEntity.ok(questionnaire)
            } else {
                ResponseEntity.status(403).body(Response("Questionnaire has been closed to public access! Access forbidden!"))
            }
        }
        
        return authenticationProvider.executeWithAuthAwareAndControllerContext({
            sendResponseBasedOnQuestionnaireClosed(
                    questionnaireService.getQuestionnaireById(jwtTokenUtil.getQuestionnaireIdFromToken(tokenUrl)))
        }, { sendResponseBasedOnQuestionnaireClosed(
                questionnaireService.getQuestionnaireById(it.claims["questionnaire_id", Int::class.java])) })
    }

    @GetMapping(value = ["/questionnaires/admin/{tokenUrl}"])
    @ResponseBody
    fun getQuestionnaireAdmin(@PathVariable tokenUrl: String): ResponseEntity<*> {
        return authenticationProvider.executeWithAuthAwareAndControllerContext({
            ResponseEntity.ok(extractQuestionnaireTokenClaimsAndRetrievePerValidation(
                jwtTokenUtil.getUsernameFromToken(tokenUrl),
                jwtTokenUtil.getQuestionnaireIdFromToken(tokenUrl)
            ))
        }, { ResponseEntity.ok(extractQuestionnaireTokenClaimsAndRetrievePerValidation(
                it.claims.subject,
                it.claims["questionnaire_id", Int::class.java]
            )) })
    }

    @PostMapping(value = ["/questionnaires/{tokenUrl}/submit"])
    @ResponseBody
    fun submitUserAnswers(@PathVariable tokenUrl: String, @Valid @RequestBody userAnswers: List<UserAnswer>): ResponseEntity<*> {
        val saveUserAnswersWithValidation = {
            val questionnaireId = jwtTokenUtil.getQuestionnaireIdFromToken(tokenUrl) // validate jwt

            if(userAnswers.map { it.questionnaireId }.any { it != questionnaireId }) {
                throw Anket0rooResponseEntityExceptionHandler.InvalidFormatException("User answers cannot conain answers from more than one questionnaire")
            }

            ResponseEntity.ok(userAnswerService.saveUserAnswers(userAnswers))
        }

        // db excepions, like passing in invalid ID mappings, are handled by response entity exceptions
        return authenticationProvider.executeWithAuthAwareAndControllerContext(
                { saveUserAnswersWithValidation() }, { saveUserAnswersWithValidation() }
        )
    }

    @PutMapping(value = ["/users/{username}/questionnaires/{qId}/close"])
    @ResponseBody
    fun closeQuestionnaire(@PathVariable username: String, @PathVariable("qId") questionnaireId: Int): ResponseEntity<*> {
        val questionnaire = questionnaireService.getUserQuestionnaireById(username, questionnaireId)
        questionnaireService.saveQuestionnaire(questionnaire.copy(closed = true))
        return ResponseEntity.ok(Response("Questionnaire with id $questionnaireId and owner $username successfully closed"))
    }

    private fun extractQuestionnaireTokenClaimsAndRetrievePerValidation(username: String?, questionnaireId: Int): List<UserAnswer> {
        val auth = authenticationProvider.getAuthenticationWithValidation()
        if(auth.name == username) {
           return userAnswerService.getUserAnswers(questionnaireId)
        } else throw IllegalAccessException("Token for this URL does not match the authenticated user!")
    }
}
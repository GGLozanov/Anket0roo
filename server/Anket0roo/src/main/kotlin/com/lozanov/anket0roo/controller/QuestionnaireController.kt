package com.lozanov.anket0roo.controller

import com.lozanov.anket0roo.advice.Anket0rooResponseEntityExceptionHandler
import com.lozanov.anket0roo.model.Questionnaire
import com.lozanov.anket0roo.model.UserAnswer
import com.lozanov.anket0roo.response.QuestionnaireCreateResponse
import com.lozanov.anket0roo.response.Response
import com.lozanov.anket0roo.service.*
import com.lozanov.anket0roo.util.JwtTokenUtil
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.net.URL
import javax.validation.Valid

@RestController
@CrossOrigin
class QuestionnaireController(
    private val questionnaireService: QuestionnaireService,
    private val questionService: QuestionService,
    private val jwtTokenUtil: JwtTokenUtil,
    private val authenticationProvider: AuthenticationProvider,
    private val userService: UserService,
    private val userAnswerService: UserAnswerService
) {
    @Value("\${client.url}")
    private val clientUrl: String? = null

    @PostMapping(value = ["/users/{username}/questionnaires"])
    @ResponseBody
    fun createQuestionnaire(@PathVariable username: String, @Valid @RequestBody questionnaire: Questionnaire): ResponseEntity<*>? {
        print("Questionnaire generated: $questionnaire")
        if(userService.findUserIdByUsername(username) != questionnaire.authorId) {
            throw Anket0rooResponseEntityExceptionHandler.InvalidFormatException("User questionnaire cannot be authored by a different person from the auth user!")
        }

        val questionIds = questionnaire.questionnaireQuestions.map { it.questionnaireQuestionId.questionId }
        println("Questionnaire count: ${questionService.countQuestionsByIdNotInForUser(
                questionIds,
                userService.findUserIdByUsername(username))}")
        if(questionService.countQuestionsByIdNotInForUser(
                        questionIds,
                        userService.findUserIdByUsername(username)) > 0) {
            throw Anket0rooResponseEntityExceptionHandler.InvalidFormatException("User questionnaire cannot have questions the user does not own!")
        }
        questionService.findQuestionsByIds(questionIds).forEach {
            val matchingQuestionnaireQuestion = questionnaire.questionnaireQuestions.find { questionnaire -> questionnaire.questionnaireQuestionId.questionId == it.id }
            if(matchingQuestionnaireQuestion != null) {
                matchingQuestionnaireQuestion.question = it // everything's by reference... it's byotiful
                matchingQuestionnaireQuestion.questionnaire = questionnaire
            } else {
                throw Anket0rooResponseEntityExceptionHandler.InvalidFormatException("User questionnaire cannot contain questions with unknown/undefined IDs!")
            }
        } // bruh, this JPA stuff is nuts

        val savedQuestionnaire = questionnaireService.saveQuestionnaire(questionnaire)
        return ResponseEntity.ok(
                QuestionnaireCreateResponse(
                    savedQuestionnaire,
                    URL(clientUrl + "/questionnaires/${
                        jwtTokenUtil.generateQuestionnaireToken(questionnaire.id)}"),
                    URL(clientUrl +
                            "/questionnaires/admin/${jwtTokenUtil.generateQuestionnaireAdminToken(
                                    authenticationProvider.getAuthenticationWithValidation().name, 
                                    questionnaire.id)}"
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
    
    @GetMapping(value = ["/questionnaires/{tokenUrl:.+}"])
    @ResponseBody
    fun getQuestionnaire(@PathVariable tokenUrl: String): ResponseEntity<*> {
        fun sendResponseBasedOnQuestionnaireClosed(questionnaire: Questionnaire): ResponseEntity<*> {
            return if(!questionnaire.closed) {
                ResponseEntity.ok(questionnaire)
            } else {
                ResponseEntity.status(403).body(Response("Questionnaire has been closed to public access! Access forbidden!"))
            }
        }
        
        return authenticationProvider.executeWithAuthAwareAndControllerContext({
            sendResponseBasedOnQuestionnaireClosed(
                    questionnaireService.getQuestionnaireById(jwtTokenUtil.getQuestionnaireIdFromToken(tokenUrl).toInt()))
        }, { sendResponseBasedOnQuestionnaireClosed(
                questionnaireService.getQuestionnaireById(it.claims["questionnaire_id", java.lang.Integer::class.java].toInt())) })
    }

    @GetMapping(value = ["/questionnaires/admin/{tokenUrl:.+}"])
    @ResponseBody
    fun getQuestionnaireAdmin(@PathVariable tokenUrl: String): ResponseEntity<*> {
        println("Token url: ${tokenUrl}")
        return authenticationProvider.executeWithAuthAwareAndControllerContext({
            ResponseEntity.ok(extractQuestionnaireTokenClaimsAndRetrieveAnswersPerValidation(
                jwtTokenUtil.getUsernameFromToken(tokenUrl),
                jwtTokenUtil.getQuestionnaireIdFromToken(tokenUrl),
            ))
        }, { ResponseEntity.ok(extractQuestionnaireTokenClaimsAndRetrieveAnswersPerValidation(
                it.claims.subject,
                it.claims["questionnaire_id", java.lang.Integer::class.java],
        )) })
    }

    // slight request overhead but router components in react arguments go brr (yes, backend shouldn't be shaped by client but w/e)
    @GetMapping("/questionnaires/ping/{id}")
    @ResponseBody
    fun getQuestionnaireById(@PathVariable id: Int): ResponseEntity<*> {
        val questionnaire = questionnaireService.getQuestionnaireById(id)
        if(!questionnaire.public) {
            throw IllegalAccessException("Cannot get questionnaire by id when the questionnaire is not public!")
        }

        return ResponseEntity.ok(questionnaire)
    }

    @PostMapping(value = ["/questionnaires/{tokenUrl:.+}/submit"])
    @ResponseBody
    fun submitUserAnswers(@PathVariable tokenUrl: String, @RequestBody userAnswers: List<UserAnswer>): ResponseEntity<*> {
        val saveUserAnswersWithValidation = {
            val questionnaireId = jwtTokenUtil.getQuestionnaireIdFromToken(tokenUrl) // validate jwt

            finishUserAnswersSubmitWithValidation(questionnaireId.toInt(), userAnswers)
        }

        // db excepions, like passing invalid IDin invalid ID mappings, are handled by response entity exceptions
        return authenticationProvider.executeWithAuthAwareAndControllerContext(
                { saveUserAnswersWithValidation() }, { saveUserAnswersWithValidation() }
        )
    }

    @PostMapping(value = ["/questionnaires/ping/{id}/submit"])
    @ResponseBody
    fun submitUserAnswers(@PathVariable id: Int, @Valid @RequestBody userAnswers: List<UserAnswer>): ResponseEntity<*> {
        if(!questionnaireService.getQuestionnaireById(id).public) {
            throw IllegalAccessException("Cannot submit answer for questionnaire by id when the questionnaire is not public!")
        }

        return finishUserAnswersSubmitWithValidation(id, userAnswers)
    }

    private fun finishUserAnswersSubmitWithValidation(questionnaireId: Int, userAnswers: List<UserAnswer>): ResponseEntity<*> {
        if(userAnswers.map { it.questionnaireId }.any { it != questionnaireId }) {
            throw Anket0rooResponseEntityExceptionHandler.InvalidFormatException("User answers cannot contain answers from more than one questionnaire")
        }

        return ResponseEntity.ok(userAnswerService.saveUserAnswers(userAnswers))
    }

    @PutMapping(value = ["/users/{username}/questionnaires/{qId}/toggle_open"])
    @ResponseBody
    fun closeQuestionnaire(@PathVariable username: String, @PathVariable("qId") questionnaireId: Int): ResponseEntity<*> {
        val questionnaire = questionnaireService.getUserQuestionnaireById(username, questionnaireId)
        questionnaireService.saveQuestionnaire(questionnaire.copy(closed = !questionnaire.closed))
        return ResponseEntity.ok(Response("Questionnaire with id $questionnaireId and owner $username successfully closed"))
    }

    private fun extractQuestionnaireTokenClaimsAndRetrieveAnswersPerValidation(username: String?,
                                                                               questionnaireId: java.lang.Integer): List<UserAnswer> {
        // val auth = authenticationProvider.getAuthenticationWithValidation()
        println(username)
        // println(auth.principal)
        // FIXME: Validation for link should be here but auth returns anon user so w/e
        // if(auth.principal == username) {
           return userAnswerService.getUserAnswers(questionnaireId)
        // } else throw IllegalAccessException("Token for this URL does not match the authenticated user!")
    }
}
package com.lozanov.anket0roo.controllers

import com.lozanov.anket0roo.advice.Anket0rooResponseEntityExceptionHandler
import com.lozanov.anket0roo.model.Questionnaire
import com.lozanov.anket0roo.model.User
import com.lozanov.anket0roo.response.QuestionnaireCreateResponse
import com.lozanov.anket0roo.service.AuthenticationProvider
import com.lozanov.anket0roo.service.QuestionnaireService
import com.lozanov.anket0roo.util.JwtTokenUtil
import io.jsonwebtoken.ExpiredJwtException
import io.jsonwebtoken.MalformedJwtException
import io.jsonwebtoken.SignatureException
import io.jsonwebtoken.UnsupportedJwtException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import java.lang.IllegalArgumentException
import java.net.URL
import javax.validation.ConstraintViolationException
import javax.validation.Valid

@RestController
@CrossOrigin
class QuestionnaireController(
    private val questionnaireService: QuestionnaireService,
    private val jwtTokenUtil: JwtTokenUtil,
    private val authenticationProvider: AuthenticationProvider
) {

    @PostMapping(value = ["/questionnaires"])
    @ResponseBody
    fun createQuestionnaire(@Valid @RequestBody questionnaire: Questionnaire): ResponseEntity<*>? {
        val savedQuestionnaire = questionnaireService.createQuestionnaire(questionnaire)
        return ResponseEntity.ok(
                QuestionnaireCreateResponse(
                        savedQuestionnaire,
                        URL(ServletUriComponentsBuilder.fromCurrentContextPath()
                                .replacePath(null)
                                .build()
                                .toUriString() + "/${jwtTokenUtil.generateQuestionnaireToken(
                                    authenticationProvider.getAuthenticationWithValidation().name, questionnaire.id
                                )}"
                        )
                )
        )
    }

    @GetMapping(value = ["users/{id}/questionnaires"])
    @ResponseBody
    fun getUserQuestionnaires(@PathVariable("id") id: Int): ResponseEntity<*>? {
        val questionnaires = questionnaireService.getUserQuestionnaires(id)
        return ResponseEntity.ok(questionnaires)
    }

    @GetMapping(value = ["/questionnaires"])
    @ResponseBody
    fun getPublicUserQuestionnaires(): ResponseEntity<*> {
        val questionnaires = questionnaireService.getPublicQuestionnaires()
        return ResponseEntity.ok(questionnaires)
    }

    @GetMapping(value = ["/questionnaires/{tokenUrl}"])
    @ResponseBody
    fun getQuestionnaire( @PathVariable tokenUrl: String): ResponseEntity<*>? {
        try {
            return ResponseEntity.ok(extractQuestionnaireTokenClaimsAndRetrievePerValidation(
                jwtTokenUtil.getUsernameFromToken(tokenUrl),
                jwtTokenUtil.getQuestionnaireIdFromToken(tokenUrl)
            ))
        } catch(ex: Exception) {
            when(ex) {
                is IllegalArgumentException -> {
                    throw Anket0rooResponseEntityExceptionHandler.InvalidFormatException("Invalid input information supplied!")
                }
                is MalformedJwtException -> {
                    throw Anket0rooResponseEntityExceptionHandler.InvalidFormatException("Link is malformed!")
                }
                is ExpiredJwtException -> {
                    return ResponseEntity.ok(extractQuestionnaireTokenClaimsAndRetrievePerValidation(
                        ex.claims.subject,
                        ex.claims["questionnaire_id", Int::class.java]
                    ))
                }
                is UnsupportedJwtException -> {
                    throw Anket0rooResponseEntityExceptionHandler.RequestFormatException("Bad request format for unsupported JWT operation.")
                }
                is SignatureException -> {
                    throw IllegalAccessException("Bad signature for link's JWT!")
                }
                else -> throw ex
            }
        }
    }

    private fun extractQuestionnaireTokenClaimsAndRetrievePerValidation(username: String, questionnaireId: Int): Questionnaire {
        val auth = authenticationProvider.getAuthenticationWithValidation()
        if(auth.name == username) {
           return questionnaireService.getQuestionnaireById(questionnaireId)
        } else throw IllegalAccessException("Token for this URL does not match the authenticated user!")
    }
}
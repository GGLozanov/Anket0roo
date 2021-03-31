package com.lozanov.anket0roo.advice

import com.lozanov.anket0roo.response.Response
import org.hibernate.MappingException
import org.hibernate.exception.ConstraintViolationException
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.dao.PermissionDeniedDataAccessException
import org.springframework.dao.TypeMismatchDataAccessException
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.DisabledException
import org.springframework.transaction.TransactionSystemException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.context.request.WebRequest
import org.springframework.web.multipart.MaxUploadSizeExceededException
import org.springframework.web.server.UnsupportedMediaTypeStatusException
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import java.io.IOException
import java.util.stream.Collectors
import javax.annotation.Priority
import javax.persistence.EntityNotFoundException
import javax.persistence.NoResultException
import javax.persistence.NonUniqueResultException
import javax.validation.ValidationException


@ControllerAdvice
@Priority(1)
class Anket0rooResponseEntityExceptionHandler : ResponseEntityExceptionHandler() {
    @ResponseStatus(HttpStatus.CONFLICT) // 409
    @ExceptionHandler(DataIntegrityViolationException::class, ConstraintViolationException::class, NonUniqueResultException::class, TransactionSystemException::class)
    @ResponseBody
    fun handleConflict(ex: Exception, request: WebRequest): ResponseEntity<*> {
        return ResponseEntity.status(409).body(Response("Conflicting data encountered!"))
    }

    @ResponseStatus(HttpStatus.NOT_ACCEPTABLE) // 406
    @ExceptionHandler(
            TypeMismatchDataAccessException::class, ValidationException::class, InvalidFormatException::class)
    @ResponseBody
    fun handleInvalidData(ex: Exception, request: WebRequest): ResponseEntity<*> {
        return ResponseEntity.status(406).body(Response("Unacceptable data passed in! ${ex.message ?: ""}"))
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR) // 500
    @ExceptionHandler(MappingException::class, InitializationException::class)
    @ResponseBody
    fun handleMapping(ex: Exception, request: WebRequest): ResponseEntity<*> {
        return ResponseEntity.status(500).body(Response("Internal server issue! ${ex.message ?: ""}"))
    }

    @ResponseStatus(HttpStatus.FORBIDDEN) // 403
    @ExceptionHandler(PermissionDeniedDataAccessException::class, IllegalAccessException::class)
    @ResponseBody
    fun handleForbidden(ex: Exception, request: WebRequest): ResponseEntity<*> {
        return ResponseEntity.status(403).body(Response("Insufficient privileges to access resource! ${ex.message ?: ""}"))
    }

    @ResponseStatus(HttpStatus.NOT_FOUND) // 404
    @ExceptionHandler(EntityNotFoundException::class, NoResultException::class, HttpClientErrorException.BadRequest::class)
    @ResponseBody
    fun handleNotFound(ex: Exception, request: WebRequest): ResponseEntity<*> {
        return ResponseEntity.status(400).body(Response("Requested resource not found! ${ex.message ?: ""}"))
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED) // 401
    @ExceptionHandler(BadCredentialsException::class, DisabledException::class)
    @ResponseBody
    fun handleBadAuth(ex: Exception, request: WebRequest): ResponseEntity<*> {
        return ResponseEntity.status(401).body(Response("Unauthorized data to access this resource! ${ex.message ?: ""}"))
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST) // 400
    @ExceptionHandler(RequestFormatException::class)
    @ResponseBody
    fun handleBadRequest(ex: Exception, request: WebRequest): ResponseEntity<*> {
        return ResponseEntity.badRequest().body(Response("Malformed request sent! ${ex.message ?: ""}"))
    }

    override fun handleMethodArgumentNotValid(ex: MethodArgumentNotValidException, headers: HttpHeaders, status: HttpStatus, request: WebRequest): ResponseEntity<Any> {
        val errorList: MutableList<String> = ex
                .bindingResult
                .fieldErrors
                .stream()
                .map { fieldError -> fieldError.defaultMessage }
                .collect(Collectors.toList())
        val errorDetails = ErrorDetails(HttpStatus.BAD_REQUEST, ex.localizedMessage, errorList)
        return handleExceptionInternal(ex, errorDetails, headers, errorDetails.status, request)

    }

    @ExceptionHandler(MaxUploadSizeExceededException::class, FileRetrievalException::class)
    @ResponseBody
    fun handleMaxSizeException(ex: Exception, request: WebRequest): ResponseEntity<*> {
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                .body(Response("File is incompatible or retrieval went wrong! ${ex.message ?: ""}"))
    }

    @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
    @ExceptionHandler(HttpClientErrorException.UnsupportedMediaType::class, UnsupportedMediaTypeStatusException::class)
    @ResponseBody
    fun handleUnsupportedMediaType(ex: Exception, request: WebRequest): ResponseEntity<*> {
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                .body(Response("Unsupported media type! ${ex.message ?: ""}"))
    }

    class InvalidFormatException(message: String) : Exception(message)

    class RequestFormatException(message: String) : Exception(message)

    class InitializationException(message: String) : Exception(message)
    
    class FileRetrievalException(message: String) : IOException(message)

    data class ErrorDetails(
        val status: HttpStatus,
        val message: String,
        val errors: List<String>
    )
}
package com.lozanov.anket0roo.advice

import org.hibernate.MappingException
import org.hibernate.exception.ConstraintViolationException
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.dao.PermissionDeniedDataAccessException
import org.springframework.dao.TypeMismatchDataAccessException
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.DisabledException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import javax.persistence.EntityNotFoundException
import javax.persistence.NoResultException
import javax.persistence.NonUniqueResultException
import javax.validation.ValidationException


@ControllerAdvice
class Anket0rooResponseEntityExceptionHandler : ResponseEntityExceptionHandler() {
    @ResponseStatus(HttpStatus.CONFLICT) // 409
    @ExceptionHandler(DataIntegrityViolationException::class, ConstraintViolationException::class, NonUniqueResultException::class)
    fun handleConflict() {}

    @ResponseStatus(HttpStatus.NOT_ACCEPTABLE) // 406
    @ExceptionHandler(javax.validation.ConstraintViolationException::class,
            TypeMismatchDataAccessException::class, ValidationException::class, InvalidFormatException::class)
    fun handleInvalidData() {}

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR) // 500
    @ExceptionHandler(MappingException::class)
    fun handleMapping() {}

    @ResponseStatus(HttpStatus.FORBIDDEN) // 403
    @ExceptionHandler(PermissionDeniedDataAccessException::class, IllegalAccessException::class)
    fun handleForbidden() {}

    @ResponseStatus(HttpStatus.NOT_FOUND) // 404
    @ExceptionHandler(EntityNotFoundException::class, NoResultException::class, DisabledException::class)
    fun handleNotFound() {}

    @ResponseStatus(HttpStatus.UNAUTHORIZED) // 401
    @ExceptionHandler(BadCredentialsException::class)
    fun handleBadAuth() {}

    @ResponseStatus(HttpStatus.BAD_REQUEST) // 400
    @ExceptionHandler(RequestFormatException::class)
    fun handleBadRequest() {}

    class InvalidFormatException(message: String) : Exception(message)

    class RequestFormatException(message: String) : Exception(message)
}
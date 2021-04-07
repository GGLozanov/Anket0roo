package com.lozanov.anket0roo.util

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import java.io.Serializable
import java.util.*
import java.util.function.Function

@Component
class JwtTokenUtil : Serializable {
    @Value("\${jwt.secret}")
    private val secret: String? = null

    // retrieve username from jwt token
    fun getUsernameFromToken(token: String?): String? = getClaimFromToken(token, Function { obj: Claims -> obj.subject })

    // retrieve expiration date from jwt token
    fun getExpirationDateFromToken(token: String?): Date = getClaimFromToken(token, Function { obj: Claims -> obj.expiration })

    fun getQuestionnaireIdFromToken(token: String?): Int = getClaimFromToken(token, Function { obj: Claims -> obj["questionnaire_id", Int::class.java] })

    fun <T> getClaimFromToken(token: String?, claimsResolver: Function<Claims, T>): T {
        val claims = getAllClaimsFromToken(token)
        return claimsResolver.apply(claims)
    }

    // for retrieveing any information from token we will need the secret key
    private fun getAllClaimsFromToken(token: String?): Claims = Jwts.parser()
            .setSigningKey(secret!!.byteInputStream().readAllBytes()).parseClaimsJws(token).body

    // check if the token has expired
    private fun isTokenExpired(token: String?): Boolean {
        val expiration = getExpirationDateFromToken(token)
        return expiration.before(Date())
    }

    // generate token for user
    fun generateToken(userDetails: UserDetails): String {
        return doGenerateToken(userDetails.authorities.map {
            it.authority to true
        }.toMap().toMutableMap(), userDetails.username)
    }

    fun generateQuestionnaireAdminToken(subject: String, questionnaireId: Int): String {
        return doGenerateToken(mutableMapOf(
            "questionnaire_id" to questionnaireId
        ), subject)
    }

    fun generateQuestionnaireToken(questionnaireId: Int): String {
        return doGenerateToken(mutableMapOf(
            "questionnaire_id" to questionnaireId
        ))
    }

    //while creating the token -
    //1. Define  claims of the token, like Issuer, Expiration, Subject, and the ID
    //2. Sign the JWT using the HS512 algorithm and secret key.
    //3. According to JWS Compact Serialization(https://tools.ietf.org/html/draft-ietf-jose-json-web-signature-41#section-3.1)
    //   compaction of the JWT to a URL-safe string
    private fun doGenerateToken(claims: MutableMap<String, Any>, subject: String? = null): String =
            Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(Date(System.currentTimeMillis()))
                    .setExpiration(Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
                    .signWith(SignatureAlgorithm.HS512, secret!!.byteInputStream().readAllBytes()).compact()


    //validate token
    fun validateToken(token: String?, authUsername: String): Boolean {
        val username = getUsernameFromToken(token)
        return username == authUsername && !isTokenExpired(token)
    }

    companion object {
        private const val serialVersionUID = -2550185165626007488L
        const val JWT_TOKEN_VALIDITY = 5 * 1000 * 1000.toLong()
    }
}
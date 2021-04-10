package com.lozanov.anket0roo.model

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import kotlinx.serialization.Transient
import org.hibernate.annotations.CreationTimestamp
import org.springframework.format.annotation.DateTimeFormat
import java.sql.Date
import javax.persistence.*

@Entity
@Table(name = "user_answers")
@Serializable
data class UserAnswer(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat
    @Contextual
    @Column(name = "answer_date")
    val createDate: java.util.Date,

    @Column(name = "questionnaire_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    val questionnaireId: Int,

    @Column(name = "answer_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    val answerId: Int,

    // in endpoints wherein checks for answers are being performed, questionnaires are being fetched first (or passed in)
    // then the answer<->questionnaire mapping is passed and the answers are mapped to their ids client side
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questionnaire_id", referencedColumnName = "id", insertable = false, updatable = false)
    @Transient
    @JsonIgnore
    val questionnaire: Questionnaire? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id", referencedColumnName = "id", insertable = false, updatable = false)
    @Transient
    @JsonIgnore
    val answer: Answer? = null
): java.io.Serializable
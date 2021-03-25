package com.lozanov.anket0roo.model

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
    val questionnaireId: Int,

    @Column(name = "answer_id")
    val answerId: Int,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(insertable = false, updatable = false)
    @Transient
    val questionnaire: Questionnaire? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(insertable = false, updatable = false)
    @Transient
    val answer: Answer? = null
): java.io.Serializable
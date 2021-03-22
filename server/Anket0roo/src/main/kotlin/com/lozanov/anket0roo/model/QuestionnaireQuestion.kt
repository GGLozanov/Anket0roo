package com.lozanov.anket0roo.model

import kotlinx.serialization.Serializable
import org.hibernate.annotations.NaturalIdCache
import javax.persistence.*

@Entity
@Table(name = "questionnaires_questions")
@Serializable
data class QuestionnaireQuestion(
    @EmbeddedId
    val questionAnswerId: QuestionnaireQuestionId,

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("questionnaireId")
    val questionnaire: Questionnaire,

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("questionId")
    val question: Question,

    @Column(name = "mandatory")
    val mandatory: Boolean,

    @Column(name = "more_than_one_answer")
    val moreThanOneAnswer: Boolean
): java.io.Serializable {
    @Embeddable
    @Serializable
    data class QuestionnaireQuestionId(
        @Column(name = "questionnaire_id")
        val questionnaireId: Int,
        @Column(name = "question_id")
        val questionId: Int,
    ): java.io.Serializable
}
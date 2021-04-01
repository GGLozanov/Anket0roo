package com.lozanov.anket0roo.model

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import com.lozanov.anket0roo.repository.QuestionRepository
import kotlinx.serialization.Serializable
import kotlinx.serialization.Transient
import org.hibernate.annotations.NaturalIdCache
import org.springframework.beans.factory.annotation.Autowired
import javax.persistence.*

@Entity
@Table(name = "questionnaires_questions")
@Serializable
data class QuestionnaireQuestion(
    @EmbeddedId
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    val questionAnswerId: QuestionnaireQuestionId,

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("questionnaireId")
    @JoinColumn(name = "questionnaire_id", insertable = false, updatable = false)
    @Transient
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    var questionnaire: Questionnaire? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("questionId")
    @JoinColumn(name = "question_id", insertable = false, updatable = false)
    var question: Question? = null,

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
        val questionId: Int
    ): java.io.Serializable
}
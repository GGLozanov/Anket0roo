package com.lozanov.anket0roo.model

import kotlinx.serialization.Serializable
import javax.persistence.*
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Size

@Entity
@Table(name = "questionnaires")
@Serializable
data class Questionnaire(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,

    @NotBlank
    @Size(max = 50)
    val name: String,

    val public: Boolean,

    val closed: Boolean,

    @OneToMany(
        mappedBy = "questionnaire",
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    val questionnaireQuestions: List<QuestionnaireQuestion>,

    @Column(name = "author_id")
    val authorId: Int

): java.io.Serializable
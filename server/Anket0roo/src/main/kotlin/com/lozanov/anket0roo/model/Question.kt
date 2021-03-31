package com.lozanov.anket0roo.model

import kotlinx.serialization.Serializable
import javax.persistence.*
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Size

@Entity
@Table(name = "questions")
@Serializable
data class Question(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,

    @NotBlank
    @Size(max = 50)
    val question: String, // image contained in regex form

    @ManyToMany(
        cascade = [CascadeType.ALL],
        fetch = FetchType.LAZY,
    )
    @JoinTable(name = "question_answers",
            joinColumns = [JoinColumn(name = "question_id", referencedColumnName="id")],
            inverseJoinColumns = [JoinColumn(name = "answer_id", referencedColumnName="id")])
    val answers: Set<Answer> = setOf(),

    @Column(name = "owner_id")
    val ownerId: Int

//    @OneToMany(
//        mappedBy = "question",
//        cascade = [CascadeType.ALL],
//        orphanRemoval = true
//    )
//    val questionsQuestionnaire: List<QuestionnaireQuestion>
): java.io.Serializable
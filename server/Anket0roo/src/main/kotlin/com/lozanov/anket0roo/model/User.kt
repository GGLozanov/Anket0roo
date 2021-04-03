package com.lozanov.anket0roo.model

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import kotlinx.serialization.Serializable
import kotlinx.serialization.Transient
import org.springframework.security.core.userdetails.UserDetails
import javax.persistence.*
import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Size

@Entity
@Table(name = "users", uniqueConstraints = [UniqueConstraint(columnNames = ["id", "username"])])
@Serializable
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,

    @NotBlank
    @Size(max = 25)
    @Column(unique = true)
    val username: String,

    @NotBlank
    @Size(max = 55)
    @Email
    val email: String,

    @NotBlank
    @Size(max = 120)
    @Transient
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    val password: String = "",

    @OneToMany(
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY,
    )
    @JoinColumn(name = "author_id", referencedColumnName = "id")
    val questionnaires: List<Questionnaire> = listOf(),

    @OneToMany(
            cascade = [CascadeType.ALL],
            orphanRemoval = true,
            fetch = FetchType.LAZY,
    )
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    val questions: List<Question> = listOf(),
): java.io.Serializable

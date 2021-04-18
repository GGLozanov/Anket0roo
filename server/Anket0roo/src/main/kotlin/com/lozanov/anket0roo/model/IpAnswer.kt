package com.lozanov.anket0roo.model

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import kotlinx.serialization.Serializable
import kotlinx.serialization.Transient
import javax.persistence.*

@Entity
@Table(name = "ip_answers", uniqueConstraints = [UniqueConstraint(columnNames = ["questionnaire_id", "ip"])])
@Serializable
data class IpAnswer(
    @EmbeddedId
    val ipAnswerId: IpAnswerId,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questionnaire_id", referencedColumnName = "id", insertable = false, updatable = false)
    @Transient
    @JsonIgnore
    val questionnaire: Questionnaire? = null,
): java.io.Serializable {
    @Serializable
    @Embeddable
    data class IpAnswerId(
        @Column(name = "questionnaire_id")
        val questionnaireId: Int,
        @Column
        val ip: String,
    ): java.io.Serializable {
        override fun equals(other: Any?): Boolean = other is IpAnswerId && this.questionnaireId == other.questionnaireId
    }
}

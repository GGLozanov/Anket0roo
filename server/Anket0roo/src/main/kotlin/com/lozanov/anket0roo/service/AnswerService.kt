package com.lozanov.anket0roo.service

import com.lozanov.anket0roo.model.Answer
import com.lozanov.anket0roo.repository.AnswerRepository
import org.springframework.stereotype.Service

// oh, if only I had the wish to actually improve this code
// instead of writing ironic comments about how this is a school project
// and I don't care the slightest how badly abstracted this far cry for generics is!

@Service
class AnswerService(private val answerRepository: AnswerRepository) {

    private fun createAnswer(answer: Answer) {
        answerRepository.save(answer)
    }
}
import {Expose} from "class-transformer";
import {Question} from "./question";
import {QuestionnaireQuestion} from "./questionnaire_question";

export class QuestionnaireQuestionResponse extends QuestionnaireQuestion {
    @Expose()
    question: Question;

    constructor(question: Question, mandatory: boolean, moreThanOneAnswer: boolean) {
        super(mandatory, moreThanOneAnswer)
        this.question = question;
    }
}
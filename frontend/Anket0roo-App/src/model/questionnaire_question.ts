import {Expose} from "class-transformer";
import {Question} from "./question";

export class QuestionnaireQuestion {
    @Expose()
    question: Question;
    @Expose()
    mandatory: boolean;
    @Expose()
    moreThanOneAnswer: boolean;

    constructor(question: Question, mandatory: boolean, moreThanOneAnswer: boolean) {
        this.question = question;
        this.mandatory = mandatory;
        this.moreThanOneAnswer = moreThanOneAnswer;
    }
}
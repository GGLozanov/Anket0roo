import {Expose} from "class-transformer";
import {Question} from "./question";

export abstract class QuestionnaireQuestion {
    @Expose()
    mandatory: boolean;
    @Expose()
    moreThanOneAnswer: boolean;

    constructor(mandatory: boolean, moreThanOneAnswer: boolean) {
        this.mandatory = mandatory;
        this.moreThanOneAnswer = moreThanOneAnswer;
    }
}
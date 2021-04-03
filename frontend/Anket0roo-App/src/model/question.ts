import {IdModel} from "./id_model";
import {Answer} from "./answer";
import {Expose} from "class-transformer";

export class Question extends IdModel {
    @Expose()
    question: string;
    @Expose()
    answers: Answer[];
    @Expose()
    answerId: number;

    constructor(id: number, question: string, answers: Answer[], answerId: number) {
        super(id);
        this.question = question;
        this.answers = answers;
        this.answerId = answerId;
    }
}
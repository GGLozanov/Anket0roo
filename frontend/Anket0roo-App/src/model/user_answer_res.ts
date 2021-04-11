import {IdModel} from "./id_model";
import {Expose} from "class-transformer";
import {Answer} from "./answer";
import {Question} from "./question";

export class UserAnswerResponse extends IdModel {
    @Expose()
    createDate: string;
    @Expose()
    answer: Answer;
    @Expose()
    question: Question

    constructor(id: number, createDate: string, answer: Answer, question: Question) {
        super(id);
        this.createDate = createDate;
        this.answer = answer;
        this.question = question;
    }
}
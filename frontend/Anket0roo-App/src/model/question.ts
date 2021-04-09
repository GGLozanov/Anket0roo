import {IdModel} from "./id_model";
import {Answer} from "./answer";
import {Expose} from "class-transformer";

export class Question extends IdModel {
    @Expose()
    question: string;
    @Expose()
    answers: Answer[];
    @Expose()
    ownerId: number;

    constructor(question: string, answers: Answer[], ownerId: number, id?: number) {
        super(id);
        this.question = question;
        this.answers = answers;
        this.ownerId = ownerId;
    }
}
import {IdModel} from "./id_model";
import {Expose} from "class-transformer";

export class Answer extends IdModel {
    @Expose()
    answer: string;

    constructor(id: number, answer: string) {
        super(id);
        this.answer = answer;
    }
}

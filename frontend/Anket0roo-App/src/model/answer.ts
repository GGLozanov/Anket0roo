import {IdModel} from "./id_model";
import {Expose} from "class-transformer";

export class Answer extends IdModel {
    @Expose()
    answer: string;

    constructor(answer: string, id?: number) {
        super(id);
        this.answer = answer;
    }
}

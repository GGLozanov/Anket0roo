import {constants} from "./consts";

export const questionnairesMediaPath = "questions/files";

// use to check image content upon loading questions
// TODO (important): extracts this regex, removes it from the question in the UI, and replaces it with the image content
export const questionRegex = RegExp((constants.apiURL + questionnairesMediaPath)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "/[^.]+\.jpg|.png");
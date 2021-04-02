import * as React from "react";
import {useRoutes} from "react-router-dom";
import {Error} from "../error/general_error";
import {AuthWrapper} from "../components/auth/auth_wrapper";
import {Profile} from "../components/main/profile/profile";
import {OwnQuestionnaires} from "../components/main/profile/own_questionnaires";
import {ViewQuestionnaireResults} from "../components/main/view_questionnaire_results";
import {PublicQuestionnaires} from "../components/main/profile/public_questionnaires";
import {FillQuestionnaire} from "../components/main/form/fill_questionnaire";

export const AppRouter: React.FC = () => useRoutes([
        { path: '/', element: <AuthWrapper /> },
        { path: 'profile',
            element: <Profile />,
            children: [
                { path: 'questionnaires',
                    element: <OwnQuestionnaires />
                },
                { path: 'public_questionnaires', element: <PublicQuestionnaires /> },
            ]
        },
        { path: 'questionnaires/:tokenUrl', element: <FillQuestionnaire /> },
        { path: 'questionnaires/admin/:tokenUrl', element: <ViewQuestionnaireResults /> },
        { path: '*', element: <Error errorCode={404} errorReason={"Requested URL not found!"} /> }
    ]);
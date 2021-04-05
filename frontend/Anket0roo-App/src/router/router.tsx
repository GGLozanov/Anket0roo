import * as React from "react";
import {useRoutes} from "react-router-dom";
import {Error} from "../error/general_error";
import {Profile} from "../components/main/profile/profile";
import {OwnQuestionnaires} from "../components/main/profile/own_questionnaires";
import {ViewQuestionnaireResults} from "../components/main/view_questionnaire_results";
import {PublicQuestionnaires} from "../components/main/profile/public_questionnaires";
import {FillQuestionnaire} from "../components/main/form/fill_questionnaire";
import {AuthWrapper} from "../components/auth/auth_wrapper";
import {Login} from "../components/auth/login";
import {SignUp} from "../components/auth/sign_up";
import {CreateQuestionnaire} from "../components/main/form/create_questionnaire";
import {CreateQuestion} from "../components/main/form/create_question";

// Oh dear, I can already hear the React maniacs screaming at me
export const AppRouter: React.FC = () => useRoutes([
        { path: '/', element: <AuthWrapper componentToRenderOnAuth={<Profile />}/> },
        { path: 'login', element: <Login /> },
        { path: 'signup', element: <SignUp /> },
        { path: 'profile',
            element: <AuthWrapper componentToRenderOnAuth={<Profile />}/>,
            children: [
                { path: 'questionnaires',
                    element: <AuthWrapper componentToRenderOnAuth={<OwnQuestionnaires />}/>
                },
                { path: 'public_questionnaires', element: <AuthWrapper componentToRenderOnAuth={<PublicQuestionnaires />}/> },
                { path: 'create_questionnaire', element: <AuthWrapper componentToRenderOnAuth={<CreateQuestionnaire />} /> },
                { path: 'create_question', element: <AuthWrapper componentToRenderOnAuth={<CreateQuestion />} /> }
            ]
        },
        { path: 'questionnaires/:tokenUrl', element: <FillQuestionnaire /> },
        { path: 'questionnaires/admin/:tokenUrl', element: <ViewQuestionnaireResults /> },
        { path: '*', element: <Error errorCode={404} errorReason={"Requested URL not found!"} /> }
    ]);
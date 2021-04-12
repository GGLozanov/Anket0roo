import * as React from "react";
import {BrowserRouter, Navigate, useRoutes} from "react-router-dom";
import {Error} from "../error/general_error";
import {Profile} from "../components/main/profile/profile";
import {OwnQuestionnaires} from "../components/main/profile/own_questionnaires";
import {ViewQuestionnaireResults} from "../components/main/view/view_questionnaire_results";
import {PublicQuestionnaires} from "../components/main/profile/public_questionnaires";
import {FillQuestionnaire} from "../components/main/form/fill_questionnaire";
import {Login} from "../components/auth/login";
import {SignUp} from "../components/auth/sign_up";
import {CreateQuestionnaire} from "../components/main/form/create_questionnaire";
import {CreateQuestion} from "../components/main/form/create_question";
import {FillQuestionnairePublic} from "../components/main/form/fill_questionnaire_public";
import {AuthComponentWrapper, AuthRouteWrapper} from "../components/auth/auth_wrapper";
import {FillQuestionnaireToken} from "../components/main/form/fill_questionnaire_token";
import {ViewQuestionnaireResultsId} from "../components/main/view/view_questionnaire_results_id";
import {ViewQuestionnaireResultsToken} from "../components/main/view/view_questionnaire_results_token";

interface AuthRouteProps {
    loggedIn: boolean
}

// Oh dear, I can already hear the React maniacs screaming at me
export const AppRouter: React.FC<AuthRouteProps> = ({ loggedIn }: AuthRouteProps) => <BrowserRouter>
        <Routes loggedIn={loggedIn} />
    </BrowserRouter>

const Routes: React.FC<AuthRouteProps> = ({ loggedIn }: AuthRouteProps) => {
    return useRoutes([
        { path: '/', element: <AuthRouteWrapper pathToPushOnAuth={'profile'} isLoggedIn={loggedIn} /> },
        { path: 'login', element: <Login /> },
        { path: 'signup', element: <SignUp /> },
        { path: 'profile',
            element: <AuthComponentWrapper componentToRenderOnAuth={<Profile />} isLoggedIn={loggedIn} />,
        },
        { path: 'profile/questionnaires',
            element: <AuthComponentWrapper componentToRenderOnAuth={<OwnQuestionnaires />} isLoggedIn={loggedIn} />
        },
        { path: 'profile/public_questionnaires', element: <AuthComponentWrapper componentToRenderOnAuth={<PublicQuestionnaires />} isLoggedIn={loggedIn} /> },
        { path: 'profile/create_questionnaire', element: <AuthComponentWrapper componentToRenderOnAuth={<CreateQuestionnaire />} isLoggedIn={loggedIn} /> },
        { path: 'profile/create_question', element: <AuthComponentWrapper componentToRenderOnAuth={<CreateQuestion />} isLoggedIn={loggedIn} /> },
        { path: 'questionnaires/fill/:id', element: <AuthComponentWrapper componentToRenderOnAuth={<FillQuestionnairePublic />} isLoggedIn={loggedIn} /> },
        { path: 'questionnaires/:tokenUrl', element: <FillQuestionnaireToken /> }, // url pattern matching 100
        { path: 'questionnaires/admin/:tokenUrl', element: <ViewQuestionnaireResultsToken /> },
        { path: 'questionnaires/admin/view/:id', element: <ViewQuestionnaireResultsId /> },
        { path: '*', element: <Error errorCode={404} errorReason={"Requested URL not found!"} /> }
    ]);
}
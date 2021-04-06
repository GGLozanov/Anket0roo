import {createContext, useContext} from "react";
import {User} from "../model/user";

interface UserProps {
    user?: User
}

export const UserContext = createContext<UserProps>({
    user: null
});

// man, imagine if I'd generified this. Oh right, that'd be for an actual app that has context retrieval with
// extra maintainable error handling. I forgot this was for a course project I have no interest in doing zzzz
export const useUserContext = () => {
    const userContext = useContext(UserContext);

    if(userContext === undefined) {
        throw Error("User context cannot be accessed in component without a top-level provider!");
    }

    return userContext;
}
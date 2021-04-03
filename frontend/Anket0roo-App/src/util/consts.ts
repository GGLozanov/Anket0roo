
interface Constants {
    tokenKey: string;
    apiURL: string;
    jwtSecret: string;
}

export const constants: Constants = {
    tokenKey: "token",
    apiURL: "http://localhost:80/",
    jwtSecret: "InternetProgrammingWastesMyTime" // I really, really don't care enough to hide this
};
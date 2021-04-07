import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./App";
import {AppRouter} from "../router/router";
import {AuthContext} from "../context/auth_context";

ReactDOM.render(
    <App />,
    document.getElementById("root")
);
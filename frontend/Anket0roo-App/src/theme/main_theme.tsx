import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import {blue, cyan} from "@material-ui/core/colors";

export const mainTheme = responsiveFontSizes(createMuiTheme({
    palette: {
        primary: {
            main: blue[500],
        },
        secondary: {
            main: cyan[500],
        },
    },
}));
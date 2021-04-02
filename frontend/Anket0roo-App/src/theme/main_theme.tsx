import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

export const mainTheme = responsiveFontSizes(createMuiTheme({
    palette: {
        primary: {
            main: purple[500],
        },
        secondary: {
            main: green[500],
        },
    },
}));
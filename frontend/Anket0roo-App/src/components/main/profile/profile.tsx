import * as React from "react";
import {
    AppBar,
    createStyles,
    IconButton,
    makeStyles,
    Snackbar,
    SvgIcon,
    Theme,
    Toolbar,
    Typography
} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import MenuIcon from '@material-ui/icons/Menu';
import {Component, useEffect, useState} from "react";
import {UserContext} from "../../../context/user_context";
import {userService} from "../../../service/user_service";
import {useAuthContext} from "../../../context/auth_context";
import {plainToClass} from "class-transformer";
import {User} from "../../../model/user";
import {SwipeableLeftTemporaryNavDrawer} from "../../../layout/nav_drawer";
import {OverridableComponent} from "@material-ui/core/OverridableComponent";
import {SvgIconTypeMap} from "@material-ui/core/SvgIcon/SvgIcon";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

export const Profile: React.FC = () => {
    const classes = useStyles();

    const [snackbarOpen, setSnackBarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [profileName, setProfileName] = useState(null);

    const [open, setOpen] = useState(false);

    const toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (event && event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setOpen(open);
    };

    const authContext = useAuthContext();

    const onSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBarOpen(false);
    }

    useEffect(() => {
        if(user == null) {
            userService.getUser()
                .catch((error) => {
                    // reauth on every error; error handling 100
                    authContext.logout()
                }).then((response) => {
                    if(response && response.data.username) {
                        setProfileName(response.data.username);
                        setUser(plainToClass(User, JSON.parse(response.data), { excludeExtraneousValues: true }));
                    } else {
                        setSnackBarOpen(true)
                    }
                });
        }
    }, [user]);

    return (
        <div className={classes.root}>
            <UserContext.Provider value={{user: user}}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} onClick={toggleDrawer}
                                    color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {profileName ? <div>Your Profile, {profileName}</div> : <div>Your Profile</div>}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </UserContext.Provider>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={onSnackbarClose}>
                <MuiAlert elevation={6} variant="filled" onClose={onSnackbarClose} severity="error">
                    Something went wrong! Please login again!</MuiAlert>
            </Snackbar>
            <SwipeableLeftTemporaryNavDrawer routes={new Map(
                [["create_questionnaire", () => <MenuIcon />], ["create_question", () => <MenuIcon />]]
            )}  open={open} toggleDrawer={toggleDrawer}/>
        </div>
    );
}
import * as React from "react";
import {
    AppBar,
    createStyles,
    IconButton,
    makeStyles,
    Snackbar,
    SvgIcon, Tabs,
    Theme,
    Toolbar,
    Tab,
    Typography, useTheme,
} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import MenuIcon from '@material-ui/icons/Menu';
import CreateIcon from "@material-ui/icons/Create";
import QuestionAnswerIcon from "@material-ui/Icons/QuestionAnswer";
import {Component, useEffect, useState} from "react";
import {UserContext} from "../../../context/user_context";
import {userService} from "../../../service/user_service";
import {useAuthContext} from "../../../context/auth_context";
import {plainToClass} from "class-transformer";
import {User} from "../../../model/user";
import {SwipeableLeftTemporaryNavDrawer} from "../../../layout/nav_drawer";
import {OwnQuestionnaires} from "./own_questionnaires";
import {PublicQuestionnaires} from "./public_questionnaires";
import {TabPanel} from "../../../layout/tab_panel";
import SwipeableViews from "react-swipeable-views";

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

const tabProps = (idx: number) => {
    return {
        id: `full-width-tab-${idx}`,
        'aria-controls': `full-width-tabpanel-${idx}`,
    };
}

export const Profile: React.FC = () => {
    const classes = useStyles();
    const theme = useTheme();

    const [snackbarOpen, setSnackBarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [profileName, setProfileName] = useState(null);

    const [open, setOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);

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
    
    const handleSwipeableViewIndexChange = (idx: number) => {
        setTabValue(idx);
    }

    const handleTabChange = (event: React.ChangeEvent<{}>, newIdx: number) => {
        setTabValue(newIdx);
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
                <AppBar position="static" color={"default"}>
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} onClick={toggleDrawer(!open)}
                                    color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {profileName ? <div>Your Profile, {profileName}</div> : <div>Your Profile</div>}
                        </Typography>
                    </Toolbar>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="Your Questionnaires and Public Questionnaires"
                        centered
                    >
                        <Tab label="Item One" {...tabProps(0)} />
                        <Tab label="Item Two" {...tabProps(1)} />
                    </Tabs>
                </AppBar>
            </UserContext.Provider>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={onSnackbarClose}>
                <MuiAlert elevation={6} variant="filled" onClose={onSnackbarClose} severity="error">
                    Something went wrong! Please login again!</MuiAlert>
            </Snackbar>
            <SwipeableLeftTemporaryNavDrawer routes={new Map([
                    ["create_questionnaire", () => <CreateIcon />],
                    ["create_question", () => <QuestionAnswerIcon />],
                ])}  open={open} toggleDrawer={toggleDrawer}/>
            <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={tabValue}
                            onChangeIndex={handleSwipeableViewIndexChange}>
                <TabPanel index={0} value={tabValue} children={<OwnQuestionnaires />} />
                <TabPanel index={1} value={tabValue} children={<PublicQuestionnaires />} />
                </SwipeableViews>
        </div>
    );
}
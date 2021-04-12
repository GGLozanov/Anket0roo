import * as React from "react";
import {
    Avatar,
    Button,
    Container,
    CssBaseline, FormControl,
    Grid, Icon,
    makeStyles,
    Paper,
    TextField,
    Typography
} from "@material-ui/core";

import {Link, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {LockOutlined} from "@material-ui/icons";
import {Controller, useForm} from "react-hook-form";
import {authService} from "../../service/auth_service";
import {useAuthContext} from "../../context/auth_context";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

interface AuthProps {
    username: string;
    password: string;
}

export const Login: React.FC = () => {
    const classes = useStyles();

    const { handleSubmit, control, reset, formState: { errors } } = useForm<AuthProps>();

    const [loginError, setLoginError] = useState('');

    const authContext = useAuthContext();
    const navigate = useNavigate();

    const onSubmit = ({password, username}: AuthProps) => {
        // valid data's here
        authService.login(username, password)
            .catch((error) => {
            console.log(error);
            reset({ username: '', password: '' },
            { keepErrors: true, keepDirty: true });
            setLoginError("There was an error! Please try again.");
        }).then((response) => {
            if(response && response?.data.token) {
                console.log(`returned token: ${response.data.token}`)
                authContext.login(response.data.token);
                navigate("/profile", { replace: true });
                setLoginError(null);
            } else {
                setLoginError("Invalid response! Please try again.");
            }
        });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth variant="outlined">
                        <Controller
                            name="username"
                            render={ ({ field }) =>
                                <TextField
                                    {...field}
                                    margin="normal"
                                    name="username"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    helperText={errors.username ? errors.username.message : null}
                                    autoComplete="name"
                                    error={errors.username !== undefined}
                                />
                            }
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                maxLength: 20
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <Controller
                            name="password"
                            render={ ({ field }) =>
                                <TextField
                                    {...field}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    helperText={errors.password ? errors.password.message : null}
                                    error={errors.password !== undefined}
                                />
                            }
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true
                            }}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        id="submit"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link to="/signup" replace={true}>
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </form>
                {loginError && <div>{loginError}</div>}
            </div>
        </Container>
    );
}
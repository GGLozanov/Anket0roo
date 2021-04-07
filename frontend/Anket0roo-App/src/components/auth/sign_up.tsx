import * as React from "react";
import {useState} from "react";
import {
    Avatar,
    Button,
    Container,
    CssBaseline, FormControl,
    Grid,
    makeStyles,
    Paper,
    TextField,
    Typography
} from "@material-ui/core";
import {Link} from "react-router-dom";
import {LockOutlined} from "@material-ui/icons";
import {Controller, useForm} from "react-hook-form";
import {useAuthContext} from "../../context/auth_context";
import {authService} from "../../service/auth_service";

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
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

interface SignUpProps {
    username: string;
    password: string;
    email: string;
}

// TODO: Replace w/ hook form validators & stuff
export const SignUp: React.FC = () => {
    const classes = useStyles();

    const { handleSubmit, control, formState: { errors } } = useForm<SignUpProps>();
    const authContext = useAuthContext();

    const [signUpError, setSignUpError] = useState('');

    const onSubmit = ({username, password, email}: SignUpProps) => {
        authService.signUp(email, password, username)
            .catch((error) => {
            setSignUpError("Something went wrong! Please try again!");
        }).then((response) => {
            if(response && response?.data.token) {
                authContext.login(response.data.token);
            } else {
                setSignUpError("Invalid response! Please try again.");
            }
        });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth variant="outlined">
                        <Controller
                            name="email"
                            render={ ({ field }) =>
                                <TextField
                                    {...field}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    helperText={errors.email ? errors.email.message : null}
                                    name="email"
                                    autoComplete="email"
                                    error={errors.email !== undefined}
                                />
                            }
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: 'Invalid email address'
                                }
                            }}
                        />
                    </FormControl>
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
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link to="login">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            {signUpError && <div>{signUpError}</div>}
        </Container>
    );
}

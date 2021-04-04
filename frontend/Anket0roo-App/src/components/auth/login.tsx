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

import {Link} from "react-router-dom";
import {useState} from "react";
import {LockOutlined} from "@material-ui/icons";
import {Controller, useForm} from "react-hook-form";

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

export const Login: React.FC = () => {
    const classes = useStyles();

    const { handleSubmit, control, formState: { errors } } = useForm();

    const [loginError, setLoginError] = useState('');

    const onSubmit = (data: object) => {
        // valid data's here
        const username = data.username;
        const password = data.password;

         // if auth attempt fail:
        /*       reset(
        {
          email: '',
          password: ''
        },
        {
          errors: true,
          dirtyFields: true
        }
      ); */
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
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
                                    error={errors.email}
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
                                    error={errors.password}
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
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link to="login">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
                {loginError && <div>{loginError}</div>}
            </div>
        </Container>
    );
}
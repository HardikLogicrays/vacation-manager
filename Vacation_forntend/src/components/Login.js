import React, {useState, useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid/index";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Alert from '@mui/material/Alert';

const useStyles = makeStyles((theme) => ({
    introBox: {
        display: "flex",
        flexDirection: "column",
        marginTop: "60px",
        fontFamily: "Roboto Mono, monospace"
    },
    primaryText: {
        fontSize: "35px",
        fontWeight: "bold"
    },
    secondaryText: {
        position: "relative",
        top: "-10px",
        opacity: ".78"
    },
    formBox: {
        dispaly: "flex",
        flexDirection: "column",
        marginTop: theme.spacing(5)
    },
    formAlert: {
        marginBottom: "20px",
    },
    stackForm: {
        dispaly: "flex",
        flexDirection: "column",
        flexGrow: 1
    },
    formControl: {
        margin: "10px 0",
        width: "400px"
    },
    formHelper: {
        textAlign: "right",
        cursor: "pointer",
        marginTop: "-10px",
        marginRight: "4px"
    },
    actionCont: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px"
    },
    actionBtn: {
        background: "linear-gradient(45deg, #1a76d2 30%, rgb(16 78 140) 90%)",
        border: 0,
        borderRadius: 10,
        boxShadow: "0 3px 5px 2px rgb(99 138 243 / 30%)",
        color: "white",
        height: 50,
        padding: "0 40px",
        margin: "10px",
        fontSize: "16px"
    }
}));

export default function AutoGrid() {
    const classes = useStyles();
    const [values, setValues] = useState({});
    const [data, setData] = useState();
    const [error, setError] = useState(false);


    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        setValues({
            email: event.target.email.value,
            password: event.target.password.value
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                email: event.target.email.value,
                password: event.target.password.value
            }),
            redirect: 'follow'
        };
        
        (event.target.email.value && event.target.password.value) && fetch(`${process.env.REACT_APP_BASE_API_URL}login/`, requestOptions)
            .then(response => response.json())
            .then(result => setData(result))
            .catch(error => console.log('error', error));
    }

    var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "csrftoken=sgA7AbBUUVx1lJ9CWmUezzYmYhfAOZCVF38au2VhuJGNMY8B2bhqejqLi7OW8Zju; sessionid=4ia56a3v7vbqfzcc6evd70kt8hcxeew8");

    useEffect(() => {
        data?.errors && setError(true);
        data?.token && localStorage.setItem('token', data?.token);
        if (data?.token) window.location.href = '/calendar';
        setTimeout(() => {
            setError(false);
        }, 10000);

    },[data?.errors, data?.token]);

    if (localStorage.getItem('token')) {
        window.location.href = 'calendar'
    }

    return (
        <Grid container  justifyContent="center">
            <Grid item lg={6} container className={classes.gridItem} justifyContent="center">
                <Box className={classes.introBox}  justifyContent="center">
                    <Typography
                        variant="h3"
                        component="h1"
                        className={classes.primaryText}
                    >
                        Sign In
                    </Typography>

                    <Box component="div" className={classes.formBox}>
                        {error && <Alert className={classes.formAlert} severity="error">Please enter correct email and password.</Alert>}

                        <form className={classes.stackForm} method="get" onSubmit={handleSubmit}>
                            <TextField
                                id="outlined-basic"
                                label="Email"
                                variant="outlined"
                                name="email"
                                className={classes.formControl}
                                error={values.email === ""}
                                helperText={values.email === "" && 'Please enter email.'}
                            />
                            <div>
                                <FormControl
                                    className={classes.formControl}
                                    variant="outlined"
                                >
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={values.showPassword ? "text" : "password"}
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange("password")}
                                        error={values.password === ""}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {values.showPassword ? (
                                                    <Visibility />
                                                    ) : (
                                                    <VisibilityOff />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        labelWidth={70}
                                    />
                                </FormControl>
                            </div>
                            <div className={classes.actionCont}>
                                <Button
                                    type="submit"
                                    className={classes.actionBtn}
                                >
                                    Sign In
                                </Button>
                            </div>
                        </form>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

import { useState, useEffect } from "react";
import { TextField, Button, DialogActions, Grid } from "@mui/material";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const EventForm = ({ scheduler }) => {
    const event = scheduler.edited;
    const [createData, setCreateData] = useState(undefined);
    const [error, setError] = useState(false);
    const [expiredToken, setExpiredToken] = useState(false);

    const tokenValue = localStorage.getItem('token');

    const [state, setState] = useState({
        title: event?.title || "",
        start: event?.start || "",
        end: event?.end || "",
    });

    const handleChange = (value, name) => {
        setState((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });


        if (state.title.length < 3 || !state.start || !state.end) {
            setError(true);
        }

        setError(false);
    };

    const randomColor = Math.floor(Math.random()*16777215).toString(16);

    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${tokenValue}`);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "csrftoken=lZOoOrDpBBMSBV2bJAGYemMsDwa0SJ44DpbEJBGA4frzKOTPwjZ7LCm5uOfy0ZFO; sessionid=tmj4466xbex7od8ltonfo5t1cxzszivx");

    let raw = JSON.stringify(createData);

    function holidaysCreate() {
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${process.env.REACT_APP_BASE_API_URL}holidays/`, requestOptions)
            .then(response => response.text())
            .then(result => setExpiredToken(JSON.parse(result).errors?.token))
            .catch(error => console.log('error', error));
    }

    useEffect(() => {
        createData && holidaysCreate();
    }, [createData]);

    useEffect(() => {
        if (expiredToken) {
            window.location.href = '/';
            localStorage.removeItem('token');
        }
    }, [expiredToken]);

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    const handleSubmit = async () => {
        if (state.title.length < 3 || !state.start || !state.end) {
            return setError(true);
        }

        setError(false);

        try {
            scheduler.loading(true);
            const added_updated_event = (await new Promise((res) => {

                setTimeout(() => {
                    res({
                        event_id: event?.event_id || Math.random(),
                        title: state?.title,
                        start: state?.start,
                        end: state?.end,
                        color: `#${randomColor}`
                    });
                }, 3000);

                setCreateData({
                    color: `#${randomColor}`,
                    title: state.title,
                    start_date: formatDate(state.start),
                    end_date: formatDate(state.end)
                });
            }));

            scheduler.onConfirm(added_updated_event, event ? "edit" : "create");
            scheduler.close();
        } finally {
            scheduler.loading(false);
        }
    };

    
    let afterTwoMonths = new Date();

    afterTwoMonths.setMonth(afterTwoMonths.getMonth() + 2);


    let day = new Date();
    let nextDay = new Date();
    nextDay.setDate(day.getDate() + 1);

    return (
        <div>
            <div style={{ padding: "1rem" }}>
                <h2>Add Leave</h2>
                <Grid container spacing={2}>

                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="Title"
                            name="title"
                            value={state.title}
                            onChange={(e) => handleChange(e.target.value, "title")}
                            error={(!state.title && error) && error}
                            helperText={(!state.title && error) && "Please enter title"}
                            fullWidth
                        />
                    </Grid>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid item xs={6} sm={6}>
                            <DatePicker
                                style={{ width: "100%" }}
                                label="Start"
                                name="start"
                                value={state.start ? state.start : null}
                                minDate={nextDay}
                                maxDate={afterTwoMonths}
                                onChange={(newValue) => handleChange(newValue, "start")}
                                renderInput={(params) => <TextField fullWidth required {...params} error={(!state.start && error) && error}
                                helperText={(!state.start && error) && "Please select date."}/>}
                            />
                        </Grid>

                        <Grid item xs={6} sm={6}>
                            <DatePicker
                                label="End"
                                name="end"
                                value={state.end ? state.end : null}
                                minDate={state.start ? state.start : nextDay}
                                maxDate={afterTwoMonths}
                                onChange={(newValue) => handleChange(newValue, "end")}
                                renderInput={(params) => <TextField fullWidth required {...params} error={(!state.end && error) && error}
                                helperText={(!state.end && error) && "Please select date."}/>}
                            />
                        </Grid>
                    </LocalizationProvider>
                </Grid>
            </div>
            <DialogActions>
                <Button onClick={scheduler.close}>Cancel</Button>
                <Button onClick={handleSubmit}>Confirm</Button>
            </DialogActions>
        </div>
    );
}
export default EventForm;
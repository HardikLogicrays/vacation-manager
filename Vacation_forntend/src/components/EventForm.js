import { useState, useEffect } from "react";
import { TextField, Button, DialogActions, Grid, Stack } from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const EventForm = ({ scheduler }) => {
    const event = scheduler.edited;
    const [createData, setCreateData] = useState(undefined);

    const tokenValue = localStorage.getItem('token');

    const [state, setState] = useState({
        title: event?.title || "",
        start: event?.start || "",
        end: event?.end || "",
    });
    const [error, setError] = useState("");

    const handleChange = (value, name) => {
        setState((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    };

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
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    useEffect(() => {
        createData && holidaysCreate();
    }, [createData]);

    const handleSubmit = async () => {

        if (state.title.length < 3) {
            return setError("Min 3 letters");
        }

        try {
            scheduler.loading(true);

            const added_updated_event = (await new Promise((res) => {
                setTimeout(() => {
                    res({
                        event_id: event?.event_id || Math.random(),
                        title: state?.title,
                        start: state?.start,
                        end: state?.end
                    });
                }, 3000);

                setCreateData({
                    title: state.title,
                    start_date: state.start?.toISOString().split('T')[0],
                    end_date: state.end?.toISOString().split('T')[0]
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
                            error={!!error}
                            helperText={error}
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
                                minDate={new Date()}
                                maxDate={afterTwoMonths}
                                onChange={(newValue) => handleChange(newValue, "start")}
                                renderInput={(params) => <TextField fullWidth required {...params} />}
                            />
                        </Grid>

                        <Grid item xs={6} sm={6}>
                            <DatePicker
                                label="End"
                                name="end"
                                value={state.end ? state.end : null}
                                minDate={state.start ? state.start : new Date()}
                                maxDate={afterTwoMonths}
                                onChange={(newValue) => handleChange(newValue, "end")}
                                renderInput={(params) => <TextField fullWidth required {...params} />}
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
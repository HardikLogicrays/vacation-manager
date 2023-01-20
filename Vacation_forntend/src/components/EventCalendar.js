import React, { useState, useEffect } from 'react';
import { Scheduler } from "@aldabil/react-scheduler";
import Button from "@material-ui/core/Button";
import EventForm from "./EventForm";

function EventCalendar() {
    const [events, setEvents] = useState([]);
    const tokenValue = localStorage.getItem('token');

    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${tokenValue}`);
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Cookie", "csrftoken=lZOoOrDpBBMSBV2bJAGYemMsDwa0SJ44DpbEJBGA4frzKOTPwjZ7LCm5uOfy0ZFO; sessionid=tmj4466xbex7od8ltonfo5t1cxzszivx");

    const textTranslate = {
        form: {
            addTitle: "Add Leave",
        },
        event: {
            title: "Title",
            start: "Start",
            end: "End",
            allDay: "All Day",
            inputFormat: "MM/DD/YYYY"
        },
    }

    const CalendarPickerProps = {
        minDate: new Date(),
    }



    const getEvents = async () => {
        let requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
        const result = await fetch(
            `${process.env.REACT_APP_BASE_API_URL}holidays/`,
            requestOptions
        )
            .then((response) => response.json())
            .then((res) => {
                setEvents(res);
                return res;
            });
        return result;
    };

    useEffect(() => {
        getEvents();
    }, [tokenValue]);

    useEffect(() => {
        events.length > 0 && events.map(item => {
            return Object.assign(item, { start: new Date(item?.start_date), end: new Date(item?.end_date) })
        });
    }, [events]);

    if (!tokenValue) window.location.href = '/';

    function handleClick() {
        window.location.href = '/';
        localStorage.removeItem('token');
    }

    return (
        <div style={{ width: "800px", margin: "10px auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2>Leave Management System</h2>
                {tokenValue && <Button style={{ background: "linear-gradient(45deg, #1a76d2 30%, rgb(16 78 140) 90%)", boxShadow: "0 3px 5px 2px rgb(99 138 243 / 30%)", color: "white" }} variant="contained" onClick={handleClick}>Sign Out</Button>}
            </div>
            <Scheduler
                editable={false}
                deletable={false}
                day={null}
                week={null}
                translations={textTranslate}
                navigationPickerProps={CalendarPickerProps}
                view="month"
                color={"red"}
                getRemoteEvents={getEvents}
                customEditor={(scheduler) => <EventForm scheduler={scheduler} />}
                month={{
                    cellRenderer: ({ height, start, onClick }) => {
                        let date = start;
                        let currentSate = new Date();
                        let afterTwoMonths = new Date();
                        afterTwoMonths.setMonth(afterTwoMonths.getMonth() + 2);
                        const disabled = date < currentSate || date > afterTwoMonths;

                        return (
                            <button
                                style={{
                                    width: "100%",
                                    height,
                                    margin: 0,
                                    border: 0,
                                    cursor: disabled ? "not-allowed" : "pointer",
                                    background: disabled ? "#ebebeb" : "transparent",
                                    opacity: disabled ? 0.7 : 1
                                }}
                                disabled={disabled}
                                onClick={onClick}
                                start={date}
                            ></button>
                        );
                    },
                }}
                dialogMaxWidth="sm"
            />
        </div>
    )
}

export default EventCalendar;
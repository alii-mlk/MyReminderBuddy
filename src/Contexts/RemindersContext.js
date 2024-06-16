import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiCalendar from "react-google-calendar-api";
import { ANDROID_CLIENT_ID, GOOGLE_API_KEY } from '../utils/config';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import { PermissionsAndroid } from 'react-native';
import { AuthContext } from './AuthContext';
import RNCalendarEvents from "react-native-calendar-events";
import { WeatherContext } from './WeatherContext';
import { emtptyReminderTemplate, handleChange, kelvinToCelius } from '../utils/utils';

const config = {
    clientId: ANDROID_CLIENT_ID,
    apiKey: GOOGLE_API_KEY,
    scope: "https://www.googleapis.com/auth/calendar",
    discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
    ],
};

const apiCalendar = new ApiCalendar(config);

export const ReminderContext = createContext();

const ReminderContextProvider = (props) => {
    const [reminders, setReminders] = useState(undefined)
    const [calendarAccess, setCalendarAccess] = useState(false)
    const { loginType } = useContext(AuthContext)
    const { locationAccess } = useContext(WeatherContext)

    useEffect(() => {
        if (locationAccess)
            getCalendarPermission()
    }, [locationAccess])

    useEffect(() => {
        getReminders()
    }, [loginType])

    //this is a hook that when any reminder changes it syncs reminders on device localstorage including fetching reminders from google calendar
    useEffect(() => {
        if (!reminders) return
        syncLocalStorage()
    }, [reminders])

    useEffect(() => {
        // Set up an interval to refresh reminders every minute (60000 ms)
        const intervalId = setInterval(() => {
            getReminders();
        }, 60000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const getCalendarPermission = async () => {
        try {
            const writePermission = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
                {
                    title: 'Calendar Write Permission',
                    message: 'MyReminderBuddy app needs write access to your calendar',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );

            const readPermission = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
                {
                    title: 'Calendar Read Permission',
                    message: 'MyReminderBuddy app needs read access to your calendar',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );

            if (
                writePermission === PermissionsAndroid.RESULTS.GRANTED &&
                readPermission === PermissionsAndroid.RESULTS.GRANTED
            ) {
                setCalendarAccess(true);
            } else {
                setCalendarAccess(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getReminders = async () => {
        try {
            let localRemindersArray = [];
            let googleRemindersArray = [];

            // Fetch reminders from local storage
            const localReminders = await AsyncStorage.getItem('reminders');
            if (localReminders !== null) {
                let parsedReminders = JSON.parse(localReminders);

                // Convert start and end times to Date objects and push to localRemindersArray
                parsedReminders.forEach(reminder => {
                    let adaptedReminder = { ...emtptyReminderTemplate }; // Copy template object
                    adaptedReminder.title = reminder.title;
                    adaptedReminder.startTime = new Date(reminder.startTime);
                    adaptedReminder.endTime = new Date(reminder.endTime);
                    adaptedReminder.isDailyReminder=reminder.isDailyReminder
                    localRemindersArray.push(adaptedReminder);
                });
            } else {
                console.log('No reminders found in AsyncStorage.');
            }
            // Fetch reminders from Google Calendar
            if (loginType === "google") {
                const startDate = new Date().toISOString();
                const endDate = new Date('2100-01-01T00:00:00.000Z').toISOString();
                let deviceReminders = await RNCalendarEvents.fetchAllEvents(startDate, endDate);

                // Filter out events from Google Calendar that are not holidays
                const filteredEvents = deviceReminders.filter(reminder => {
                    return !reminder.calendar.title.includes("Holidays");
                });
                console.log("filteredEvents", filteredEvents)
                // Adapt filtered events into application's reminder format
                filteredEvents.forEach(event => {
                    let adaptedReminder = { ...emtptyReminderTemplate }; // Copy template object
                    adaptedReminder.title = event.title;
                    adaptedReminder.startTime = new Date(event.startDate);
                    adaptedReminder.endTime = new Date(event.endDate);
                    adaptedReminder.id = event.calendar.id; // Add the Google Calendar ID
                    googleRemindersArray.push(adaptedReminder);
                });
            }

            // Combine arrays with Local reminders having priority
            let combinedReminders = [...localRemindersArray];

            // Add google reminders only if they do not already exist in combinedReminders
            googleRemindersArray.forEach(googleReminder => {
                const exists = combinedReminders.some(localReminder =>
                    localReminder.title === googleReminder.title
                );

                if (!exists) {
                    combinedReminders.push(googleReminder);
                } else {
                    // If exists, add the Google Calendar ID to the local reminder
                    combinedReminders = combinedReminders.map(localReminder => {
                        if (localReminder.title === googleReminder.title) {
                            return {
                                ...localReminder,
                                id: googleReminder.id
                            };
                        }
                        return localReminder;
                    });
                }
            });

            // Set state with combinedReminders array
            setReminders(combinedReminders);
        } catch (error) {
            console.log('Error fetching or parsing reminders:', error);
        }
    };




    const syncLocalStorage = async () => {
        try {
            await AsyncStorage.removeItem('reminders')
            const remindersJSON = JSON.stringify(reminders);
            await AsyncStorage.setItem('reminders', remindersJSON);
        } catch (e) {
            console.log(e)
        }
    }

    // Add a new reminder to the list
    const addReminder = (reminder) => {
        setReminders([...reminders, reminder]);
        const calendarEvent = {
            title: reminder.title,
            startDate: reminder.startTime.toISOString(),
            endDate: reminder.endTime.toISOString(),
            location: "",
            notes: "",
            url: "",
        };
        if (loginType == "google") AddCalendarEvent.presentEventCreatingDialog(calendarEvent)
    };

    // Remove a reminder that matches both title and startTime
    const removeReminder = async (reminder) => {
        try {
            if (reminder.id) {
                let response = await RNCalendarEvents.removeCalendar(reminder.id);
                console.log(response)
            }
            if (reminders.length == 1) {
                setReminders([])
            } else setReminders(reminders.filter(
                (rem) => !(rem.title === reminder.title && rem.startTime.toISOString() === reminder.startTime.toISOString())
            ));
        }
        catch (err) {
            console.log(err)
        }
    };

    // Toggle the isChecked property of a reminder
    const handleCheckBox = (reminder) => {
        setReminders(reminders.map((rem) =>
            rem.title === reminder.title && rem.startTime.toISOString() === reminder.startTime.toISOString()
                ? { ...rem, isChecked: !rem.isChecked }
                : rem
        ));
    };

    // Edit a reminder that matches both title and startTime
    const editReminder = (originalReminder, updatedReminder) => {
        setReminders(reminders.map((rem) =>
            rem.title === originalReminder.title && rem.startTime.toISOString() === originalReminder.startTime.toISOString()
                ? updatedReminder
                : rem
        ));
    };
    return (
        <ReminderContext.Provider value={{ reminders, addReminder, removeReminder, editReminder, handleCheckBox, calendarAccess }}>
            {props.children}
        </ReminderContext.Provider>
    )
}
export default ReminderContextProvider

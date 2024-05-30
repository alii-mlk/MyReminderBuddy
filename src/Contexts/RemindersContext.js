import React, { createContext, useEffect, useRef, useState } from 'react';
import { MAIN_API } from '../utils/main_api';

export const WeatherContext = createContext();

const WeatherContextProvider = (props) => {
    const apiCall = useRef(undefined)
    const [reminders, setReminders] = useState([])
    
    useEffect(() => {
        return () => {
            if (apiCall.current !== undefined) {
                apiCall.current.cancel()
            }
        }
    }, [])

    return (
        <WeatherContext.Provider value={{}}>
            {props.children}
        </WeatherContext.Provider>
    )
}
export default WeatherContextProvider

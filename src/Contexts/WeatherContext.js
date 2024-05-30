import React, { createContext, useEffect, useRef, useState } from 'react';
import { MAIN_API } from '../utils/main_api';

export const WeatherContext = createContext();

const WeatherContextProvider = (props) => {
    const [currentWeather, setCurrentWeather] = useState(undefined)
    const [loading, setLoading] = useState(undefined)
    const [weatherError, setError] = useState(undefined)
    const apiCall = useRef(undefined)

    useEffect(() => {
        getWeatherData()
        return () => {
            if (apiCall.current !== undefined) {
                apiCall.current.cancel()
            }
        }
    }, [])
    const getWeatherData = async () => {
        setLoading(true)
        try {
            let lat = "41.9055294"

            let long = "12.515239"

            apiCall.current = MAIN_API.request({
                path: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=6b278b83e00ef66a594512f246dd6525`,
                method: 'get'
            })
            const response = await apiCall.current.promise
            if (!response.isSuccess)
                throw response
            console.log(response)
            setCurrentWeather(response)
        }
        catch (err) {
            console.log(err)
            setError("Failed to load Weather data.")
            setLoading(false)
        }
    }
    useEffect(() => {
        if (currentWeather !== undefined) {
            setLoading(false)
        }
    }, [currentWeather])
    return (
        <WeatherContext.Provider value={{ currentWeather, loading, weatherError }}>
            {props.children}
        </WeatherContext.Provider>
    )
}
export default WeatherContextProvider

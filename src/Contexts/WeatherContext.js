import React, { createContext, useEffect, useRef, useState } from 'react';
import { MAIN_API } from '../utils/main_api';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';

export const WeatherContext = createContext();

const WeatherContextProvider = (props) => {
    const [currentWeather, setCurrentWeather] = useState(undefined)
    const [loading, setLoading] = useState(undefined)
    const [weatherError, setWeatherError] = useState(undefined)
    const apiCall = useRef(undefined)
    const [locationAccess, setLocationAccess] = useState(false)
    const [location, setLocation] = useState(undefined)
    useEffect(() => {
        if (!locationAccess) {
            requestLocationPermission()
        }
        if (!location) {
            getLocation()
        } else {
            setLocationAccess(true)
            getWeatherData()
        }
    }, [location, locationAccess])
    useEffect(() => {
        return () => {
            if (apiCall.current !== undefined) {
                apiCall.current.cancel()
            }
        }
    }, [])
    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'MyReminderBuddy App location Permission',
                    message:
                        'Cool Photo App needs access to your location ' +
                        'so you can be aware of weather information.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setLocationAccess(true)
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const getLocation = async () => {
        Geolocation.getCurrentPosition(info => {
            setLocation(info)
        });
        return
    }
    const getWeatherData = async () => {
        setLoading(true)
        setWeatherError(undefined)
        try {
            apiCall.current = MAIN_API.request({
                path: `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=6b278b83e00ef66a594512f246dd6525`,
                method: 'get'
            })
            const response = await apiCall.current.promise
            if (!response.isSuccess)
                throw response
            setCurrentWeather(response)
            setLoading(false)
        }
        catch (err) {
            console.log("*******error here*****")
            console.log(err)
            setWeatherError("Failed to load Weather data.")
            setLoading(false)
        }
    }
    useEffect(() => {
        if (currentWeather !== undefined) {
            setLoading(false)
        }
    }, [currentWeather])
    return (
        <WeatherContext.Provider value={{ currentWeather, loading, weatherError, locationAccess, getWeatherData }}>
            {props.children}
        </WeatherContext.Provider>
    )
}
export default WeatherContextProvider

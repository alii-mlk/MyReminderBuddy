import React, { useContext, useEffect, useState } from 'react'
import { WeatherContext } from '../Contexts/WeatherContext';
import { weatherConditions } from '../utils/weatherConditions';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { kelvinToCelius } from '../utils/utils';

export default function WeatherCard() {
    const [currentWeatherCondition, setCurrentWeatherCondition] = useState(undefined)
    const [additionalWeatherDetails, setAdditionalWeatherDetails] = useState(undefined)
    const { loading, weatherError, currentWeather, getWeatherData } = useContext(WeatherContext);

    useEffect(() => {
        if (loading || weatherError) return
        for (var i = 0; i < weatherConditions.length; i++) {
            if (weatherConditions[i].name == currentWeather.weather[0].main) {
                setAdditionalWeatherDetails(currentWeather.main)
                setCurrentWeatherCondition(weatherConditions[i])
                return
            }
        }
    }, [currentWeather, loading, weatherError])

    return (
        <View style={{ display: "flex", flex: 1, width: "100%", height: "100%" }}>
            {
                weatherError ?
                    <View style={{ display: "flex", justifyContent: "center", alignItems: 'center', flex: 1, gap: 10 }}>
                        <Ionicons size={48} name={"sad-outline"} color="black" />
                        <Text>Failed to load weather information!</Text>
                        <Button onPress={getWeatherData} title='Retry' />
                    </View>
                    : (!currentWeatherCondition || loading) ?
                        <View style={{ display: "flex", justifyContent: "center", alignItems: 'center', flex: 1, }}>
                            <ActivityIndicator />
                            <Text>Loading weather info</Text>
                        </View>
                        :
                        <View style={[styles.weatherContainer,
                        { backgroundColor: currentWeatherCondition.color }
                        ]}>
                            <View style={styles.conditionWrapper}>
                                <Ionicons size={48} name={currentWeatherCondition.icon} color={"white"} />
                                <Text style={{ color: "white", fontSize: 20 }}>{Math.round(kelvinToCelius(additionalWeatherDetails.temp))}˚</Text>

                            </View>
                            <View style={styles.bodyContainer}>

                                <Text style={styles.title}>Current weather: {currentWeather.weather[0].main}</Text>
                                <Text style={styles.subtitle}>Feels Like: {Math.round(kelvinToCelius(additionalWeatherDetails.feels_like))}</Text>
                                <Text style={styles.subtitle}>humidity: {additionalWeatherDetails.humidity}</Text>
                                <Text style={styles.subtitle}>Tips: {currentWeatherCondition.subtitle}</Text>

                            </View>
                        </View>


            }
        </View>
    )
}
const styles = StyleSheet.create({
    bodyContainer: {
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    weatherContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 10

    },
    conditionWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: 'center',
        width: "100%",
    },
    title: {
        fontSize: 18,
        color: '#fff'
    },
    subtitle: {
        fontSize: 15,
        color: '#fff'
    },

});
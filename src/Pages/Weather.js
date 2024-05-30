import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { weatherConditions } from '../utils/weatherConditions'
import { WeatherContext } from '../Contexts/WeatherContext';
import { kelvinToCelius } from '../utils/utils';

export default function Weather() {
  const [currentWeatherCondition, setCurrentWeatherCondition] = useState(undefined)
  const [additionalWeatherDetails, setAdditionalWeatherDetails] = useState(undefined)
  const { loading, weatherError, currentWeather } = useContext(WeatherContext);

  useEffect(() => {
    for (var i = 0; i < weatherConditions.length; i++) {
      if (weatherConditions[i].name == currentWeather.weather[0].main) {
        setAdditionalWeatherDetails(currentWeather.main)
        setCurrentWeatherCondition(weatherConditions[i])
        return
      }
    }
  }, [currentWeather])
  if (!currentWeatherCondition || loading) {
    return <View style={{ display: "flex", justifyContent: "center", alignItems: 'center', flex: 1 }}>
      <ActivityIndicator />
      <Text>Loading weather info</Text>
    </View>
  }
  else if (weatherError) return <View style={{ display: "flex", justifyContent: "center", alignItems: 'center', flex: 1 }}>
    <ActivityIndicator />
    <Text>Failed to load weather</Text>
  </View>
  else return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Current weather: {currentWeather.weather[0].main}</Text>
      <Text>temperature: {Math.round(kelvinToCelius(additionalWeatherDetails.temp))}</Text>
      <Text>Feels Like: {Math.round(kelvinToCelius(additionalWeatherDetails.feels_like))}</Text>
      <Text>humidity: {additionalWeatherDetails.humidity}</Text>
      <Text>Tips: {currentWeatherCondition.subtitle}</Text>
    </View>
  )
}

import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { WeatherContext } from '../Contexts/WeatherContext';
import { weatherConditions } from '../utils/weatherConditions';

export default function Home({ navigation }) {

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

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "row" }}>
      <View style={{ display: "flex", borderRightWidth: 1, borderRightColor: "grey", flex: 1 }}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 1 }} >
          <View style={{ display: "flex", padding: 4, flex: 1, gap: 2, justifyContent: "center", alignItems: 'center' }}>
            <Text style={{ alignSelf: "center" }}>Today reminders:</Text>
            <Text style={{ alignSelf: "center" }}>No Reminders set for today.</Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Pressable onPress={() => { navigation.navigate('Calendar') }} >
            <Ionicons name={'add-circle-outline'} size={80} color={"black"} />
          </Pressable>
        </View>
      </View>

      <View style={{ display: "flex", flex: 1, padding: 4 }}>
        {
          (!currentWeatherCondition || loading) ? <View style={{ display: "flex", justifyContent: "center", alignItems: 'center', flex: 1 }}>
            <ActivityIndicator />
            <Text>Loading weather info</Text>
          </View>
            : weatherError ? <View style={{ display: "flex", justifyContent: "center", alignItems: 'center', flex: 1 }}>
              <ActivityIndicator />
              <Text>Failed to load weather</Text>
            </View>
              : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Current weather: {currentWeather.weather[0].main}</Text>
                <Text>Tips: {currentWeatherCondition.subtitle}</Text>
              </View>

        }
      </View>
    </SafeAreaView>
  )
}

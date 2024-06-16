import Ionicons from 'react-native-vector-icons/Ionicons';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
    ActivityIndicator,
    Button,
    PermissionsAndroid,
    Pressable,
    Text,
    View,
} from 'react-native';

const Stack = createNativeStackNavigator();

import Home from '../Pages/Home';
import { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';
import Settings from '../Pages/Settings';
import LoginPage from '../Pages/LoginPage';
import { WeatherContext } from '../Contexts/WeatherContext';
import Info from '../Pages/Info';
import { ReminderContext } from '../Contexts/RemindersContext';
import RemindersList from '../Pages/RemindersList';

export default function AppRouter() {
    const { userLoading, userLoadingError, userSession } = useContext(AuthContext)
    const { locationAccess } = useContext(WeatherContext)
    const { calendarAccess } = useContext(ReminderContext);

    if (!locationAccess) {
        return <View style={{ display: "flex", justifyContent: 'center', alignItems: "center", flex: 1, padding: "20px" }}>
            <Ionicons name={'navigate-outline'} size={20} color={"black"} />
            <Text>We need you to grant location access in order to provide weather information </Text>
            <Text>Please grant location access in settings and reload the app. </Text>
        </View>
    }
    if (!calendarAccess) {
        return <View style={{ display: "flex", justifyContent: 'center', alignItems: "center", flex: 1, padding: "20px" }}>
            <Ionicons name={'calendar-outline'} size={20} color={"black"} />
            <Text>We need you to grant calendar access in order to syncronize calendar events </Text>
            <Text>Please grant calendar access in settings and reload the app. </Text>
        </View>
    }

    if (userLoading) {
        return <View style={{ display: "flex", justifyContent: 'center', alignItems: "center", flex: 1 }}>
            <ActivityIndicator />
        </View>
    }

    if (userLoadingError) {
        <View style={{ display: "flex", justifyContent: 'center', alignItems: "center", flex: 1 }}>
            <Text style={{ color: 'red' }}>{userLoadingError}</Text>
        </View>
    }
    if (!userSession) {
        return <LoginPage />
    }
    else return <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home}
                options={({ navigation, route }) => ({
                    headerRight: () => (
                        <>
                            <Pressable
                                onPress={() => navigation.push('Settings')}
                            >
                                <Ionicons name={"settings"} size={20} color={"black"} />
                            </Pressable>
                            <Pressable
                                onPress={() => navigation.push('Info')}
                            >
                                <Ionicons name={"information-circle"} size={20} color={"black"} />
                            </Pressable>
                        </>
                    ),
                })}
            />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Info" component={Info} />
            <Stack.Screen name="RemindersList" component={RemindersList} />
        </Stack.Navigator>
    </NavigationContainer>

}

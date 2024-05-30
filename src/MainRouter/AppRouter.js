import Ionicons from 'react-native-vector-icons/Ionicons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
    ActivityIndicator,
    PermissionsAndroid,
    Text,
    View,
} from 'react-native';
const Tab = createBottomTabNavigator();

import Home from '../Pages/Home';
import Weather from '../Pages/Weather';
import CalendarTab from '../Pages/Calendar';
import { useContext } from 'react';
import { PermissionContext } from '../Contexts/PermissionContext';
import { AuthContext } from '../Contexts/AuthContext';
import Settings from '../Pages/Settings';
import LoginPage from '../Pages/LoginPage';

export default function AppRouter() {
    const { locationAccess, cameraAccess } = useContext(PermissionContext)
    const { userLoading, userLoadingError, userSession } = useContext(AuthContext)
    // if (cameraAccess == undefined) {
    //     return <View style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
    //         <ActivityIndicator />
    //         <Text>Waiting for camera access.</Text>
    //     </View>
    // }
    // if (cameraAccess == false) {
    //     return <View style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
    //         <Text>Please grant camera access to continue.</Text>
    //     </View >
    // }
    // if (!locationAccess) {
    //     return <View style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
    //         <Text>Please grant location access to continue.</Text>
    //     </View >
    // }
    // else 

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
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused
                            ? 'home'
                            : 'home-outline';
                    } else if (route.name === 'Weather') {
                        iconName = focused ? 'cloud' : 'cloud-outline';
                    }
                    else if (route.name === 'Calendar') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    }
                    else {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'black',
            })}
        >

            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Weather" component={Weather} />
            <Tab.Screen name="Calendar" component={CalendarTab} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    </NavigationContainer>

}

import { createContext, useEffect, useState } from 'react';

export const PermissionContext = createContext();

const PermissionContextProvider = (props) => {
    const [cameraAccess, setCameraAccess] = useState(undefined)
    const [locationAccess, setLocationAccess] = useState(undefined)

    useEffect(() => {
        requestCameraPermission()
    }, [])

    useEffect(() => {
        if (cameraAccess) requestLocationPermission()
        else return
    }, [cameraAccess])

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'My Reminder Buddy Location Permission',
                    message:
                        'My Reminder Buddy needs to detect your location to fetch accurate weather data.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setCameraAccess(true)
            } else {
                setCameraAccess(false)
            }
        } catch (err) {
            setCameraAccess(false)
        }
    };

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'My Reminder Buddy Camera Permission',
                    message:
                        'My Reminder Buddy needs to detect you when you pass by device to remind you to pick things.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setLocationAccess(true)
            } else {
                setLocationAccess(false)
            }
        } catch (err) {
            setLocationAccess(false)
        }
    };



    return (
        <PermissionContext.Provider value={{ locationAccess, cameraAccess }}>
            {props.children}
        </PermissionContext.Provider>
    )
}
export default PermissionContextProvider

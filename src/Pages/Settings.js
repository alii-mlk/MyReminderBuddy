import React, { useState } from 'react';
import { View, Switch, StyleSheet, Text } from 'react-native';

import { Slider } from '@miblanchard/react-native-slider';

export default function Settings() {
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [isAlwaysOnScreen, setIsAlwaysOnScreen] = useState(false)
    const [sensitivity, setSensitivity] = useState(0.2)
    const toggleSwitch = (type) => {
        if (type == "audio") setIsAudioEnabled(previsAudioEnabled => !previsAudioEnabled)
        else setIsAlwaysOnScreen(previsAlwaysOnScreen => !previsAlwaysOnScreen)
    }


    return (
        <View style={{ display: "flex", gap: 40, padding: 10 }}>
            <View style={styles.row}>

                <View style={styles.rowItem}>
                    <Text>Audio Notification:</Text>
                </View>

                <View style={styles.rowItem}>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isAudioEnabled ? '#4682B4' : 'white'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => { toggleSwitch("audio") }}
                        value={isAudioEnabled}
                    />
                </View>
            </View>


            <View style={styles.row}>

                <View style={styles.rowItem}>
                    <Text>Always on screen:</Text>
                </View>

                <View style={styles.rowItem}>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isAlwaysOnScreen ? '#4682B4' : 'white'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isAlwaysOnScreen}
                    />
                </View>
            </View>

            <Text>Sensor sensitivity:</Text>
            <Slider
                value={sensitivity}
                onValueChange={value => setSensitivity(value)}
                minimumTrackStyle={{backgroundColor:"#4682B4"}}
                thumbStyle={{backgroundColor:"#4682B4"}}
            />
        </View >

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        display: 'flex',
        flexDirection: "row"
    },
    rowItem: {
        display: "flex",
        flex: 1
    },
});

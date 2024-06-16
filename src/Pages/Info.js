import React from 'react'
import { Image, Text, View } from 'react-native'

export default function Info() {
    return (
        <View style={{ display: 'flex', flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Image style={{ width: 100,height:100 }} source={require('../Images/sapienza.png')} />
            <Text>Project made by:</Text>
            <Text>Ali Maleki Ghahfarokhi</Text>
            <Text>Vincenzo Di Stasio</Text>
            <Text>Andrea Lucchesi</Text>
        </View>
    )
}

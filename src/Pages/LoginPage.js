import React, { useContext } from 'react'
import { Button, Text, View, Pressable } from 'react-native'
import { AuthContext } from '../Contexts/AuthContext'

export default function LoginPage() {
    const { userLoading, userLoadingError, userSession, handleGoogleSignIn, offlineSignIn } = useContext(AuthContext)

    return (
        <View style={{ display: "flex", justifyContent: 'center', alignItems: "center", flex: 1 ,gap:10}}>
            <Button onPress={handleGoogleSignIn} title='Login with Google' />
            <Button onPress={offlineSignIn} title='Continue with offline mode' />
        </View>
    )
}

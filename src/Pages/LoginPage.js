import React, { useContext } from 'react';
import { Button, View, ImageBackground, StyleSheet, useWindowDimensions } from 'react-native';
import { AuthContext } from '../Contexts/AuthContext';

export default function LoginPage() {
    const { userLoading, userLoadingError, userSession, handleGoogleSignIn, offlineSignIn } = useContext(AuthContext);
    const { width, height } = useWindowDimensions();

    const isPortrait = height >= width;
    const backgroundImage = isPortrait ? require('../Images/vertical1.jpg') : require('../Images/landscape1.jpg')

    return (
        <ImageBackground
            source={backgroundImage}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Button onPress={handleGoogleSignIn} title='Login with Google' />
                <Button onPress={offlineSignIn} title='Continue with offline mode' />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        padding: 20,
        borderRadius: 10,
    },
});

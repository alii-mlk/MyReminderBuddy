import React, { createContext, useEffect, useRef, useState } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  statusCodes,
  isErrorWithCode,
  GoogleSignin,
} from "@react-native-google-signin/google-signin";

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '../utils/config';

GoogleSignin.configure({
  // webClientId: GOOGLE_WEB_CLIENT_ID,
  androidClientId: ANDROID_CLIENT_ID,
  // iosClientId: GOOGLE_IOS_CLIENT_ID,
  scopes: ['profile', 'email'],
});




export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [userLoading, setUserLoading] = useState(true)
  const [userLoadingError, setUserLoadingError] = useState(undefined)
  const [userSession, setUserSession] = useState(undefined)
  const [loginType, setLoginType] = useState(undefined)
  useEffect(() => {
    retrieveUserSession()
  }, [])
  async function retrieveUserSession() {
    try {
      const session = await EncryptedStorage.getItem("user_session");

      if (session !== undefined && session !== null) {
        console.log(session)
      }
      else {
        setUserSession(undefined)
        setUserLoading(false)
      }
    } catch (error) {
      setUserSession(undefined)
      setUserLoadingError("Failed to load user")
      setUserLoading(false)

    }
  }
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserSession({ userInfo });
      setLoginType("google")
    } catch (error) {
      console.log(error)
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.NO_SAVED_CREDENTIAL_FOUND:
            // Android only. No saved credential found, try calling `createAccount`
            console.log("No saved credential found, try calling `createAccount`")
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            console.log("sign in was cancelled")
            break;
          case statusCodes.ONE_TAP_START_FAILED:
            console.log("ONE_TAP_START_FAILED")
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("PLAY_SERVICES_NOT_AVAILABLE")
            // Android-only: play services not available or outdated
            break;
          default:
            // something else happened
            console.log("something else happened")
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };
  const offlineSignIn = () => {
    setUserSession({ username: "Offline User" });
    setLoginType("offline")
    setUserLoading(false)
  }

  return (
    <AuthContext.Provider value={{ userSession, userLoading, userLoadingError, handleGoogleSignIn, offlineSignIn, loginType, setLoginType }}>
      {props.children}
    </AuthContext.Provider>
  )
}
export default AuthContextProvider

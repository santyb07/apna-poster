import { View, Text, Appearance } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack } from './AppNavigation'
import Login from '../screens/auth/Login'
import VerifyOtp from '../screens/auth/OtpScreen'
import SplashScreen from 'react-native-splash-screen'

const AuthStack = () => {    
  useEffect(()=>{
    SplashScreen.hide();  
},[])
  return (
    
    <Stack.Navigator {...{initialRouteName:'Login'}} 
    screenOptions={{ 
        contentStyle: {backgroundColor: 'white'},
        animationTypeForReplace:"pop",
        animation:"slide_from_right",
     }}
    >
    <Stack.Screen name="Login" options={{headerShown:false}} component={Login}/>
    <Stack.Screen name="VerifyOtp" options={{headerShown:false}} component={VerifyOtp}/>
    </Stack.Navigator>

  )
}

export default AuthStack


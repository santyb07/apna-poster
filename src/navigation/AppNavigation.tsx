import React, { useEffect } from 'react'
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from 'react-native-splash-screen';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';

export type RootStackParamList={
  Home:undefined,
  Language:undefined,
  UploadProfile:undefined,
  Onboarding:undefined,
  Login:undefined,
  VerifyOtp:{
    mobileNumber:string,
    // confirmData:FirebaseAuthTypes.ConfirmationResult | null
  },
  TemplateEditor:{
    templateImg:string,
    promotion:boolean,
  } | undefined,
  EditBusinessDetails:undefined,
  DownloadShareTemplate:{
    templateLocation:string,
  },
  ChooseFrame:undefined,
  TestNotification:undefined
}

export const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const isUserLoggedIn = useSelector((state:RootState)=>state.auth.userId)

  
  useEffect(()=>{
    if(isUserLoggedIn){
      SplashScreen.hide(); 
    }
  },[])
  return (
    <NavigationContainer>
      {
        isUserLoggedIn ? <AppStack/> : <AuthStack/>
      }
    </NavigationContainer>
  )
}

export default AppNavigation
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigation from './src/navigation/AppNavigation';
import FlashMessage from 'react-native-flash-message';
import { persistor, store } from './src/redux/store/store';
import CheckInternet from './src/screens/CheckInternet';
import messaging from '@react-native-firebase/messaging';
import { getToken, notificationListner, requestUserPermission } from './src/utils/firebase/CommonUtils';


function App(): React.JSX.Element {
  const [isConnected, setIsConnected] = useState<Boolean>(true);

  
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const title= JSON.stringify(remoteMessage.notification?.title)
      const body= JSON.stringify(remoteMessage.notification?.body)
      Alert.alert('A new FCM message arrived!',title+body );
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    requestUserPermission()
    notificationListner()
    getToken()
  }, []);
  return (
    <SafeAreaView className='flex-1 bg-white'>
       <Provider store={store}>
      <PersistGate persistor={persistor}>
        {
        isConnected===true ?
      <AppNavigation/>:null
        }
         <CheckInternet
       isConnected={isConnected}
       setIsConnected={setIsConnected}
     />
      <FlashMessage position="top" /> 
      </PersistGate>
    </Provider>
    </SafeAreaView>
  );
}

export default App;

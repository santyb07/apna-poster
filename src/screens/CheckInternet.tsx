import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo'; // Updated import
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import SplashScreen from 'react-native-splash-screen';

const CheckInternet = ({ isConnected, setIsConnected }: any) => {
  const isUserLoggedIn = useSelector((state:RootState)=>state.auth.userLoggedIn)


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, [setIsConnected]); // Adding setIsConnected to dependency array

  useEffect(()=>{
    if(isUserLoggedIn){
      SplashScreen.hide(); 
    }
  },[])
  // const checkConnection = () => {
  //   NetInfo.fetch().then(state => {
  //     console.log("Connection type", state.type);
  //     console.log("Is connected?", state.isConnected);
  //     setIsConnected(state.isConnected)
  //   });
  // };
  return (
    <>
    {
      isConnected===true ? null:
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',rowGap:30 }}>
      <Image
        source={require('../assets/images/no-internet.png')}
        style={{ width: 300, height: 300 }}
        // width={400}
        // height={400}
      />
      <View style={{ paddingHorizontal: 18, paddingVertical: 10,rowGap:20, justifyContent: 'center', alignItems: 'center', marginTop: 4 }}>
        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 20 }}>
          No Internet!
        </Text>
        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 18 }}>
          Please Check your internet connection and try again
        </Text>
      </View>
      {/* Internet Reload Button  */}
      {/* <TouchableOpacity
        style={{ paddingHorizontal: 60, paddingVertical: 10, borderRadius: 8, backgroundColor: '#FFA500' }}
        onPress={checkConnection}>
        <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 18, color: 'white' }}>
          Reload
        </Text>
      </TouchableOpacity> */}
    </View>
    }
    </>
  );
};

export default CheckInternet;
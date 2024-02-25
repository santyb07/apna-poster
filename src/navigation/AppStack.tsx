import React from 'react'
import { Stack } from './AppNavigation';
import HomeScreen from '../screens/home/HomeScreen';
import Language from '../screens/language/Language';
import UploadProfile from '../screens/userDetails/UploadProfile';
import { useSelector } from 'react-redux';


function AppStack() {
  const isUploaded = useSelector((state:any)=>state.auth.isUploadedDetails)
    
  return (
    <Stack.Navigator
    {...{initialRouteName:isUploaded? 'Home':'Language'}} 
    screenOptions={{ 
              contentStyle: {backgroundColor: 'white'},
              animationTypeForReplace:"pop",
              animation:"slide_from_right",
              headerTitleStyle:{fontFamily:'Montserrat-Medium'}
           }}
    >
      <Stack.Screen name="Language" component={Language} options={{headerShown:false}}/>
      <Stack.Screen name="UploadProfile" component={UploadProfile} 
      options={{
        headerShown:true,
        title:'',
        headerShadowVisible:false,
      }}
      />
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false,title:'Back'}}/>
  </Stack.Navigator>
  );
}

export default AppStack;
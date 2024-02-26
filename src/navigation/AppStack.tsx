import React from 'react'
import { Stack } from './AppNavigation';
import HomeScreen from '../screens/home/HomeScreen';
import Language from '../screens/language/Language';
import UploadProfile from '../screens/userProfile/UploadProfile';
import { useSelector } from 'react-redux';
import ProfileDetails from '../screens/userProfile/ProfileDetails';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';
import IonicIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Settings from '../screens/settings/Settings';
import EditProfile from '../screens/userProfile/EditProfile';
import ChangeLanguage from '../screens/language/ChangeLanguage';


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
      <Stack.Screen name="Profile" component={ProfileDetails} 
      options={({ navigation })=>({
        headerShown:true,
        headerShadowVisible:false,
        title:'Your Profile',
        headerRight:()=>(
          <TouchableOpacity className='flex-row space-x-2' onPress={()=>navigation.navigate('Settings')}>
            <IonicIcons name='logout' size={20}/>
            <Text className='font-[Montserrat-Regular]'>Logout</Text>
          </TouchableOpacity>
        ),
      })}
      />
      <Stack.Screen name="Settings" component={Settings} options={{headerShown:true,title:'Settings'}}/>
      <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown:true,title:'Edit Profile'}}/>
      <Stack.Screen name="ChangeLanguage" component={ChangeLanguage} options={{headerShown:true,title:'Change Language'}}/>
  </Stack.Navigator>
  );
}

export default AppStack;
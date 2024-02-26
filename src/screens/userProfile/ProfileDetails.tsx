import { View, Text, StatusBar, Touchable, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { RootStackParamList } from '../../navigation/AppNavigation'
import { StackNavigationProp } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store/store'
import { colors } from '../../utils/constant'
import FeatherIcons from 'react-native-vector-icons/Feather'
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import Auth from "@react-native-firebase/auth"
import { logoutUser } from '../../redux/features/authSlice'
import { clearProfileDetails } from '../../redux/features/profileDetailsSlice'
import { showMessage } from 'react-native-flash-message'

interface UserDetailsProps {
  navigation: StackNavigationProp<RootStackParamList,"Profile">,
}

const UserDetails = ({navigation}:UserDetailsProps) => {
  const profileDetails = useSelector((state:RootState)=>state.profileDetails)
  const dispatch = useDispatch();

  console.log(profileDetails.name)

  const handleLogout=async()=>{
    try{

      const signOut = await Auth().signOut();
      dispatch(logoutUser());
      dispatch(clearProfileDetails());
      showMessage({
        message: "Details updated Successfully",
        // description: "This is our second message",
        type: "success",
        titleStyle:{fontFamily:'Montserrat-Bold',textAlign:"center",color:'#FFFFFF'},
        // backgroundColor:"#000000"
      });
    }catch(err){
      console.log(err)
      showMessage({
        message: "Something went wrong, contact developer",
        // description: "This is our second message",
        type: "danger",
        titleStyle:{fontFamily:'Montserrat-Bold',textAlign:"center",color:'#FFFFFF'},
        // backgroundColor:"#000000"
      });
    }
  }
  return (
    <View className='flex-1 py-4 px-4'>
      <StatusBar  backgroundColor='#dadada' barStyle='light-content'/>
      <View className='w-full justify-center items-center space-y-4'>
        <View style={styles.card}>
          <Image source={{uri:profileDetails.logo}} height={110} width={110}/>
          <View className='absolute p-1 top-0 right-0'>
            <FeatherIcons name='edit' size={25} color={'white'}/>
          </View>
        </View>
        <View className='justify-center items-start px-8 space-y-3'>
          <View>
          <Text className='text-lg font-[Montserrat-SemiBold]'>{profileDetails.name}</Text>
          <Text className='text-xs font-[Montserrat-SemiBold]'>{profileDetails.mobileNumber1}</Text>
          </View>
        </View>
        <TouchableOpacity className='border  px-12 py-3 rounded-xl bg-white'
        onPress={()=>navigation.navigate('EditProfile')}
        >
          <Text className='font-[Montserrat-SemiBold] text-gray-600'>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.settingCard}>
        <Text className='font-[Montserrat-Regular] text-gray-600 px-4 py-2'>Settings</Text>
        <TouchableOpacity className='flex-row justify-start items-center px-8 space-x-8 py-4'>
          <MaterialComIcons name='download-box' size={20}/>
          <Text className='font-[Montserrat-SemiBold] text-gray-600 '>Downloads</Text>
        </TouchableOpacity>
        <View style={{
              height: 1,
              marginLeft:70,
              backgroundColor: '#CCCCCC',
            }}/>
        <TouchableOpacity className='flex-row justify-start items-center px-8 space-x-8 py-4' onPress={()=>navigation.navigate('ChangeLanguage')}>
          <FontAwesome6 name='language' size={20}/>
          <Text className='font-[Montserrat-SemiBold] text-gray-600 '>Change Language</Text>
        </TouchableOpacity>
        <View style={{
              height: 1,
              marginLeft:70,
              backgroundColor: '#CCCCCC',
            }}/>
        <TouchableOpacity className='flex-row justify-start items-center px-8 space-x-8 py-4'>
          <MaterialComIcons name='message-alert' size={20}/>
          <Text className='font-[Montserrat-SemiBold] text-gray-600 '>About Us</Text>
        </TouchableOpacity>
        <View style={{
              height: 1,
              marginLeft:70,
              backgroundColor: '#CCCCCC',
            }}/>
        <TouchableOpacity className='flex-row justify-start items-center px-8 space-x-8 py-4'>
          <MaterialComIcons name='message-question' size={20}/>
          <Text className='font-[Montserrat-SemiBold] text-gray-600 '>Contact Us</Text>
        </TouchableOpacity>
      </View> 
      <View className='flex-grow justify-center items-center space-y-2'>
        <Text className='font-[Montserrat-Regular] text-base'>Version : 1.0.0</Text>
      <TouchableOpacity className='flex-row space-x-2 px-10 py-2 border-2 bg-orange-400 border-orange-400 rounded-md' onPress={handleLogout}>
          <MaterialComIcons name='logout' size={30} color={'white'}/>
          <Text className='font-[Montserrat-SemiBold] text-base text-white'>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default UserDetails

const styles = StyleSheet.create({
  card: {
    // maxWidth: 340,
  //   width:'45%',
  //   height:'25%',
  position:'relative',
    marginHorizontal: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth:5,
    borderColor:colors.ActiveColor,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginTop:9
  },
  settingCard: {position:'relative',
  marginHorizontal: 'auto',
  backgroundColor: '#ffffff',
  borderRadius: 12,
  // borderWidth:5,
  // borderColor:colors.ActiveColor,
  overflow: 'hidden',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 5,
  marginTop:9
},
})
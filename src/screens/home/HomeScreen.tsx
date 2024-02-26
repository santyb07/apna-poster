import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { RootState } from '../../redux/store/store';
import Auth from "@react-native-firebase/auth"
import { useTranslation } from 'react-i18next';
import firestore from "@react-native-firebase/firestore"
import { addProfileDetails } from '../../redux/features/profileDetailsSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigation';
import HeaderBar from '../components/HeaderBar';
import { colors } from '../../utils/constant';
import { Image } from 'react-native';
import IonicIcons from "react-native-vector-icons/Ionicons"
import { Input } from '@rneui/themed';

interface HomeScreenProps {
  navigation: StackNavigationProp<RootStackParamList,"Home">,
}

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const userData = useSelector((state:RootState)=>state.auth)
  const profileDetails = useSelector((state:RootState)=>state.profileDetails)
  const {t,i18n} = useTranslation();
  const dispatch = useDispatch();
  const [textSearch,setTextSearch] = useState('');

  useEffect(()=>{
    const getBusinessData=async ()=>{      
      const documentRef = await  (firestore() as any).collection('users').doc(userData.userId);
      await documentRef.get()
      .then((docSnapshot:any) => {
        if (docSnapshot.exists) {
          const data = docSnapshot._data;
      console.log('Document already exists',data);
      i18n.changeLanguage(data.language);
      dispatch(addProfileDetails({
        name:data.name,
        email:data.email,
        location:data.location,
        logo:data.logo,
        mobileNumber1:data.mobileNumber1,
        mobileNumber2:data.mobileNumber2,
        website:data.website,
        designation:data.designation,
        logoMetadata:data.logoMetadata,
        accountType:data.accountType,
        language:data.language,
        aboutYourself:data.aboutYourself,
        partyName:data.partyName,
      }))
    }
  }) .catch((error:any) => {
    console.log('Error checking document:', error);
  });
}
     getBusinessData();
  },[])

// useEffect(()=>{
//   if(profileDetails.language){
//     console.log(profileDetails.language)
//     i18n.changeLanguage(profileDetails.language);
//   }
// },[])
  const getCurrentUser=async()=>{
    const user = Auth().currentUser;
    console.log(user);
  }
  const logoutUser=async()=>{
    const logout= Auth().signOut();
    console.log(logout)
  }

  const changeLanguage=()=>{
    i18n.changeLanguage('mr') 
  }
  const changeLanguageHi=()=>{
    i18n.changeLanguage('hi') 
  }
  const navigateToProfile=()=>{
    navigation.navigate('Profile')
  }
  return (
    <SafeAreaView className='flex-1'>
    <View className='flex-1'>
    <StatusBar  backgroundColor={colors.StatusBarLightGray} barStyle='light-content'/>
    <View className='w-full space-x-2 px-4 py-1 flex-row justify-center items-center bg--400'>
    <View className=' flex-grow'>
        <Input
        placeholder='Search'
        maxLength={30}
        value={textSearch}
        onChangeText={(val:string)=>setTextSearch(val)}
        rightIcon={
          <IonicIcons
          name='search-circle'
          size={30}
          color='gray'
        />}
          inputContainerStyle={{
            // borderBottomWidth:1,
            borderTopWidth:1,
            borderLeftWidth:1,
            borderRightWidth:1,
            borderBottomWidth:1,
            // width:50,
            backgroundColor:'white',
            borderColor:'gray',
            height:40,
            // borderWidth:2,
            justifyContent:'center',
            alignItems:'center',
            paddingHorizontal:5,
            // paddingVertical:2,
            borderRadius:20,
            marginBottom:0,
            marginVertical:10,
          }}
          inputStyle={{
            fontSize:14
          }}
        containerStyle={{
          paddingHorizontal:0,
          paddingBottom:0,
          width:'100%',
          height:60,
          // backgroundColor:'red'
        }}
        underlineColorAndroid='transparent'        
        />
      </View>
      <TouchableOpacity className='border-2 rounded-full border-orange-400' onPress={navigateToProfile}>
      <Image source={{uri:profileDetails.logo? profileDetails.logo:'https://res.cloudinary.com/drxhgcqvw/image/upload/v1705428150/ysxh4cpuke6va2sqhou8.png'}} className='h-10 w-10 rounded-full' resizeMode={'cover'}/>
      </TouchableOpacity>
    </View>
      <Text>{t('greet')}</Text>
      <Button title='getCurrentUser' onPress={getCurrentUser}/>
      <Button title='logoutUser' onPress={logoutUser}/>

      <Button title='change Marathi' onPress={changeLanguage}/>
      <Button title='change Hindi' onPress={changeLanguageHi}/>

    </View>
    </SafeAreaView>
  )
}

export default HomeScreen
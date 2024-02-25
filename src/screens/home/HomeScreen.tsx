import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { RootState } from '../../redux/store/store';
import Auth from "@react-native-firebase/auth"
import { useTranslation } from 'react-i18next';
import firestore from "@react-native-firebase/firestore"
import { addBusinessDetails } from '../../redux/features/businessDetailsSlice';

interface HomeScreenProps {
  // navigation: StackNavigationProp<RootStackParamList,"Home">,
}

const HomeScreen = (props: HomeScreenProps) => {
  const userData = useSelector((state:RootState)=>state.auth)
  const {t,i18n} = useTranslation();
  const dispatch = useDispatch();

  useEffect(()=>{
    const getBusinessData=async ()=>{      
      const documentRef = await  (firestore() as any).collection('users').doc(userData.userId);
      await documentRef.get()
      .then((docSnapshot:any) => {
        if (docSnapshot.exists) {
          const data = docSnapshot._data;
      console.log('Document already exists',data);
      i18n.changeLanguage(data.language);
      dispatch(addBusinessDetails({
        businessName:data.name,
        email:data.email,
        location:data.location,
        logo:data.logo,
        mobileNumber1:data.mobileNumber1,
        mobileNumber2:data.mobileNumber2,
        website:data.website,
        designation:data.designation,
        logoMetadata:data.logoMetadata,
        accountType:data.accountType,
        language:data.language
      }))
    }
  }) .catch((error:any) => {
    console.log('Error checking document:', error);
  });
}
     getBusinessData();
  },[])
 
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
  return (
    <SafeAreaView className='flex-1'>
    <View>
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
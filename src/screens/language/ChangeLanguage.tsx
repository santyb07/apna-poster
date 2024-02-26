import { View, Text, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderBar from '../components/HeaderBar'
import { RootStackParamList } from '../../navigation/AppNavigation'
import { StackNavigationProp } from '@react-navigation/stack'
import { useAppDispatch } from '../../redux/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { setLanguage as setLanguageState } from '../../redux/features/authSlice'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../redux/store/store'
import { addProfileDetails } from '../../redux/features/profileDetailsSlice'
import { getToken } from '../../utils/firebase/CommonUtils'
import firestore from "@react-native-firebase/firestore"


const lang=[
    // {code:'en',name:'English',translation:'इंग्लिश'},
    {code:'hi',name:'Hindi',translation:'हिंदी'},
    {code:'mr',name:'Marathi',translation:'मराठी '},
]

interface LanguageProps{
    navigation: StackNavigationProp<RootStackParamList,'Language'>,
  }
const ChangeLanguage = ({navigation}:LanguageProps) => {
    const [language, setLanguage]= useState('');
    const dispatch = useDispatch();
    const {t,i18n} = useTranslation();

    const handleLang=(val:string)=>{
        setLanguage(val);
        dispatch(setLanguageState(val))
        i18n.changeLanguage(val);
        dispatch(setLanguageState(val));
        navigation.goBack();
    }
  return (
    <SafeAreaView className='flex-1'>
    <StatusBar  backgroundColor="#dadada" barStyle='light-content'/>    
    <View className='flex-1 justify-center items-center space-y-12'>
        <View className='flex-col space-y-2'>
            <Text className='text-2xl font-[Montserrat-SemiBold] text-gray-700'>Language</Text>
            <Text className='text-sm font-[Montserrat-Regular] text-gray-700'>Select Your language</Text>
        </View>
        <View className='w-full justify-center items-center px-12 space-y-3'>
            {
            lang.map((val,index)=>(
                <TouchableOpacity key={index} className={`w-full py-2 rounded-xl justify-center items-center border  ${language==val.code? 'border-orange-500':'border-gray-500'}`} onPress={()=>handleLang
                
                (val.code)}>
                <Text className={`text-xl font-[Montserrat-SemiBold] ${language==val.code? 'text-orange-500':'text-gray-500'}`}>{val.name}</Text>
                <Text className={`text-base font-[Montserrat-SemiBold] ${language==val.code? 'text-orange-500':'text-gray-500'}`}>{val.translation}</Text>
                </TouchableOpacity>
            ))
            }
        </View>
    </View>
    </SafeAreaView>
  )
}

export default ChangeLanguage
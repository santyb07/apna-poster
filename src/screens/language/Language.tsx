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
import { addBusinessDetails } from '../../redux/features/businessDetailsSlice'
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
const Language = ({navigation}:LanguageProps) => {
    const [language, setLanguage]= useState('');
    const userData = useSelector((state:RootState)=>state.auth)
    const dispatch = useDispatch();
    const {t,i18n} = useTranslation();

    useEffect(()=>{
        const getBusinessData=async ()=>{
          const fcmtoken= getToken();
          
          const documentRef = await  (firestore() as any).collection('users').doc(userData.userId);
          await documentRef.get()
          .then((docSnapshot:any) => {
            if (docSnapshot.exists) {
              const data = docSnapshot._data;
          console.log('Document already exists',data);
    
          //store fcmtoken
          firestore()
          .collection('tokens')
          .doc(userData.userId)
          .update({token:fcmtoken})
          .then(() => {
            console.log('Token added');
          })
    
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
          }))
        } else {
          // Document doesn't exist, save the data
          documentRef.set({
            createdAt: firestore.FieldValue.serverTimestamp(),
            mobileNumber1:userData.mobileNumber
          })
            .then(() => {
              firestore()
              .collection('tokens')
              .doc(userData.userId)
              .set({token:fcmtoken})
              .then(() => {
                console.log('Token added');
              })
    
              console.log('Document saved successfully');
              dispatch(addBusinessDetails({
                businessName:"",
                email:"",
                location:"",
                logo:"https://res.cloudinary.com/drxhgcqvw/image/upload/v1705428150/ysxh4cpuke6va2sqhou8.png",
                mobileNumber1:userData.mobileNumber,
                mobileNumber2:"",
                website:"",
                designation:""
              }))
            })
            
            .catch((error:any )=> {
              console.log('Error saving document:', error);
            });
        }
      }) .catch((error:any) => {
        console.log('Error checking document:', error);
      });
    }
          getBusinessData();
      },[])

    const handleLang=(val:string)=>{
        setLanguage(val);
        dispatch(setLanguageState(val))
        i18n.changeLanguage(val);
        dispatch(setLanguageState(val));
        navigation.navigate('UploadProfile');
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

export default Language
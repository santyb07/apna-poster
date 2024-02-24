import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import firestore from "@react-native-firebase/firestore"
import { RootState } from '../../redux/store/store';
import { getToken } from '../../utils/firebase/CommonUtils';
import { addBusinessDetails } from '../../redux/features/businessDetailsSlice';
// import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"

interface HomeScreenProps {
  // navigation: StackNavigationProp<RootStackParamList,"Home">,
}

const HomeScreen = (props: HomeScreenProps) => {
  const userData = useSelector((state:RootState)=>state.auth)
  const dispatch = useDispatch();

  // console.warn(auth().currentUser?.uid)

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
        businessName:data.businessName,
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
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen
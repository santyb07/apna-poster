import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useRef, useState } from 'react'
import { Text, TextInput, TextInputComponent, TextInputProps, TouchableOpacity, View } from 'react-native'
import { RootStackParamList } from '../../navigation/AppNavigation'
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome"
import { showMessage } from 'react-native-flash-message'
// import { useDispatch, useSelector } from 'react-redux'
// import { loginUser } from '../redux/features/authSlice'
import HeaderBar from '../components/HeaderBar'
import { useRoute } from '@react-navigation/native'
import { Button, Input } from '@rneui/themed'
import Auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import * as yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { colors } from '../../utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store/store'
import { loginUser } from '../../redux/features/authSlice'
import firestore from "@react-native-firebase/firestore"

const validationSchema = yup.object().shape({
  otp: yup.string().matches(/^\d+$/, 'Invalid otp').min(6, 'OTP Must be at least 6 digits').max(6,'OTP Must be 6 digits').required('OTP is required'),
 
});

interface VerifyOtpProps{
  navigation: StackNavigationProp<RootStackParamList,'VerifyOtp'>,
}
interface VerifyOtp {
  mobileNumber: string;
  // confirmData:FirebaseAuthTypes.ConfirmationResult | null
}

const VerifyOtp = ({navigation}:VerifyOtpProps) => {
  const route= useRoute();
  const { mobileNumber } = route.params as VerifyOtp;
  const [loading,setLoading] = useState<boolean>(false);
  const confirmation = useSelector((state:RootState)=>state.auth)
  const dispatch = useDispatch();
  const [seconds,setSeconds] = useState(60);

  const backToLogin=()=>{
    navigation.pop(1);
  }
  const handleSubmit =async(values: any) => {
    try{
      setLoading(true)
      const response = await confirmation.confirmData?.confirm(values.otp)

      showMessage({
        message: "Logged In Successfully",
        // description: "This is our second message",
        type: "success",
        titleStyle:{fontFamily:'Montserrat-Bold',textAlign:"center",color:'#FFFFFF'},
        // backgroundColor:"#000000"
      });

      //check if it is old user and redirect to home page after successfull auth
      const documentRef = await  (firestore() as any).collection('users').doc(response?.user.uid);
      await documentRef.get()
      .then((docSnapshot:any) => {
        if (docSnapshot.exists) {
          dispatch(loginUser({mobileNumber,userId:response?.user.uid,isUploadedDetails:true}))
        }else{
          dispatch(loginUser({mobileNumber,userId:response?.user.uid,isUploadedDetails:false}))
        }
        })
      setLoading(false)
      // console.warn(Auth().currentUser?.uid);
    }catch(err){
      setLoading(false);
      console.log('Error in verifying the Otp',err)
    }
  }


  async function onAuthStateChanged(user:any) {
  }
  useEffect(() => {
    const subscriber = Auth().onAuthStateChanged(onAuthStateChanged);
    // return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
          clearInterval(interval);
        }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <View className='flex-1 pb-10 px-4 container'>
    <HeaderBar name={''} logo={true} help={true} search={false}/>

      <View className='flex flex-col gap-2'>
        <Text className='text-2xl font-["Montserrat-Bold"]'>
            Verify OTP
        </Text>
        <View className='flex-row justify-start items-center gap-2'>

        <Text className='text-md font-["Montserrat-Medium"]'>
            A OTP message was sent to {mobileNumber}
            {/* <Text onPress={backToLogin}>goback</Text> */}
        </Text>
        <TouchableOpacity onPress={backToLogin}>
         {/* style={{marginHorizontal:30,width:'70%',alignItems:'flex-end',justifyContent:'center'}}  */}
          <View>
             <FontAwesomeIcon name="edit" color={"#4287f5"} size={25} />
         </View>
     </TouchableOpacity>
        </View>
      </View>
      <View className='flex flex-col py-10'>
        <Text className='text-md mb-3 font-["Montserrat-SemiBold"]'>
            Enter OTP
        </Text>
         <Formik
      initialValues={{
        otp:"",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }: FormikProps<any>): React.ReactNode => (
          <View>
            <View className='px-2'>
         
         <Input
        placeholder='Enter OTP'
        value={values.otp}
        onChangeText={handleChange('otp')}
        errorMessage={(errors.otp && typeof errors.otp === 'string') ? errors.otp:''}
        keyboardType='numeric'
        maxLength={6}
          inputContainerStyle={{
            borderBottomWidth:2,
            borderWidth:2,
            justifyContent:'center',
            alignItems:'center',
            paddingHorizontal:20,
            paddingVertical:2,
            borderRadius:10,
            marginBottom:0,
            borderColor:colors.ActiveColor
          }}
          inputStyle={{
            fontSize:16            
          }}
        containerStyle={{
          paddingHorizontal:0,
          paddingBottom:0
        }}
        underlineColorAndroid='transparent'        
        />
        </View>
        <Text className='text-md text-center mt-8 font-["Montserrat-SemiBold"]'>
          {
            seconds===0 ? 
            <Text onPress={()=> setSeconds(30)}>Resend OTP</Text>
            :`${seconds}s`
          }
        </Text>
        {
          loading ? 
          <View className='w-full justify-center items-center py-8'>
          <Button
          title="Verify"
          loading={true}
          disabled
          loadingProps={{
            size: 'large',
            color: 'rgb(255, 255, 255)',
          }}
          titleStyle={{ fontFamily:'Montserrat-SemiBold',fontSize:20 }}
          buttonStyle={{
            backgroundColor: 'rgb(59,130,246)',
            width:'100%',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius:20,
            // paddingVertical: 10,
          }}
          containerStyle={{
            width: '100%',
          }}
        />
        </View>:
         <View className='w-full justify-center items-center py-8'>
         <Button
         title="Verify"
        //  loading={true}
         onPress={()=>handleSubmit()}
         loadingProps={{
           size: 'large',
           color: 'rgba(111, 202, 186, 1)',
         }}
         titleStyle={{ fontFamily:'Montserrat-SemiBold',fontSize:20 }}
         buttonStyle={{
          //  backgroundColor: 'rgb(59,130,246)',
          backgroundColor:colors.ActiveColor,
           width:'100%',
           borderColor: 'transparent',
           borderWidth: 0,
           borderRadius: 30,
           paddingVertical: 14,
         }}
         containerStyle={{
           width: '100%',
         }}
       />
       </View>
       }
        
          </View>
      )}


    </Formik>
      </View>
     
      <View>
      </View>

    </View>
  )
}

export default VerifyOtp
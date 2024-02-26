import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigation';
import { Button, Input } from '@rneui/themed';
import { colors } from '../../utils/constant';
import ImagePicker from 'react-native-image-crop-picker';
import { setUploadedDetails } from '../../redux/features/authSlice';
import { Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import FontAwesomeIcon5 from "react-native-vector-icons/FontAwesome5"
import storage from '@react-native-firebase/storage';
import firestore from "@react-native-firebase/firestore"
import { RootState } from '../../redux/store/store';
import { addProfileDetails, updateLogo } from '../../redux/features/profileDetailsSlice';
import { showMessage } from 'react-native-flash-message';
import auth from '@react-native-firebase/auth';


interface UploadProfileProp{
    navigation: StackNavigationProp<RootStackParamList,'UploadProfile'>,
  }

  const validationSchema = yup.object().shape({
    businessName: yup.string().required('Business Name is required'),  
  });
const UploadProfile = ({navigation}:UploadProfileProp) => {
  const userData = useSelector((state:RootState)=>state.auth)
    const [accountType,setAccountType]= useState('Personal');
    const [selectLocalImg,setSelectLocalImg] = useState<string | undefined>(undefined);
    const [loading,setLoading] = useState(false);
    const [imgError,setImgError] = useState('');
    const dispatch = useDispatch();

    const pickImage =()=>{
      ImagePicker.openPicker({
        // width: null,
        // height: 'auto',
        cropping: true,
        compressImageQuality:0.3
      }).then(image => {
        console.log(image);
        setSelectLocalImg(image.path)
      }).catch((err:any)=>{
        console.log('error in uploading the image',err)
      });
    }

    const handleUplaod=async()=>{
        dispatch(setUploadedDetails(true));
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
    }
    const uploadImage =async()=>{
      try{
        setLoading(true)
        const response = storage().ref(`/logo/apnaPoster-${userData.userId}.jpg`)
        if(selectLocalImg!= undefined){
          const put = await response.putFile(selectLocalImg);
          const url = await response.getDownloadURL();
          console.log("metadata : ",put.metadata.fullPath)
          console.log("image uploaded successfully",url);
  
          //store logo uri in database
          const logoDetails={logo:url,logoMetadata:put.metadata.fullPath}
          const res = await firestore()
          .collection('users')
          .doc(userData.userId)
          .update(logoDetails);
  
          dispatch(updateLogo(logoDetails))
          setSelectLocalImg(url);
          setLoading(false)
        }else{
          console.log('image not available')
        }
      }catch(err){
        console.log(err)
      }
    }

    const handleSubmit=async(values:any)=>{
      try{
      if(selectLocalImg===undefined){
        setImgError(`Please Choose your ${accountType==='Personal'? 'Profile Photo':'Logo'}`)
      }else{
        setImgError('')
        await uploadImage();
          //updating the details
          const details={
            name:values.businessName,
            accountType:accountType,
            language:userData.language
          }
          dispatch(addProfileDetails(details))
          const res = await firestore()
        .collection('users')
        .doc(userData.userId)
        .update(details);

        showMessage({
          message: "Details updated Successfully",
          // description: "This is our second message",
          type: "success",
          titleStyle:{fontFamily:'Montserrat-Bold',textAlign:"center",color:'#FFFFFF'},
          // backgroundColor:"#000000"
        });
        // console.log('Form submitted successfully:', values);
        setLoading(false);
      }
      }catch(err){
        showMessage({
          message: "Somethign went wrong",
          // description: "This is our second message",
          type: "danger",
          titleStyle:{fontFamily:'Montserrat-Bold',textAlign:"center",color:'#FFFFFF'},
          // backgroundColor:"#000000"
        });
        // console.log('something went wrong while updating the details',err)
      }
      
    }


  return (
    <SafeAreaView className='flex-1'>
    <View className='flex-1 items-center space-y-8'>
    <View className='flex-row justify-center space-x-4 items-center py-2 '>
      <TouchableOpacity className={accountType=='Personal'? 'border-none px-12 py-3 rounded-xl bg-orange-400':'border px-12 py-3 rounded-xl'} onPress={()=>setAccountType('Personal')}>
          <Text className={accountType=='Personal'? 'font-[Montserrat-SemiBold] text-white':'font-[Montserrat-SemiBold] '}>Personal</Text>
        </TouchableOpacity>
        <TouchableOpacity className={accountType=='Business'? 'border-none px-12 py-3 rounded-xl bg-orange-400':'border px-12 py-3 rounded-xl'} onPress={()=>setAccountType('Business')}>
          <Text className={accountType=='Business'? 'font-[Montserrat-SemiBold] text-white':'font-[Montserrat-SemiBold] '}>Business</Text>
        </TouchableOpacity>
    </View>
    <View className='flex-col justify-center items-center space-y-4'>
        <View style={styles.card}>
            <Image source={{uri:selectLocalImg? selectLocalImg : "https://img.freepik.com/free-vector/purple-man-with-blue-hair_24877-82003.jpg?t=st=1708876773~exp=1708880373~hmac=a3944c8f0794d62e32615b2b4bee9fdd898428cc8321b04daee51d6de3035c6a&w=740"}} height={150} width={150} resizeMode='contain'/>
        </View>
        <View>
        <Text className='text-red-600 font-[Montserrat-Regular]'>{imgError}</Text>
        </View>
        <TouchableOpacity onPress={pickImage}>
            <Text className='text-sm font-[Montserrat-Regular] text-gray-600'>Add {accountType=='Personal'? 'Profile Photo':'Business logo'}</Text>
        </TouchableOpacity>
    </View>
    <View className='w-full'>
    <Formik
      initialValues={{
        businessName:'',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }: FormikProps<any>): React.ReactNode => (
          <View className='w-full px-8'>
            <View>
            <Input
        placeholder={accountType==='Personal'? 'Your Name':'Business Name'}
        maxLength={20}
        value={values.businessName}
        onChangeText={handleChange('businessName')}
        errorMessage={(errors.businessName && typeof errors.businessName === 'string') ? errors.businessName:''}
        leftIcon={
          accountType==='Personal' ?
          <FontAwesomeIcon5
            name='user-circle'
            size={18}
            color='black'
          />: 
          <FontAwesomeIcon5
          name='business-time'
          size={18}
          color='black'
        />}
          inputContainerStyle={{
            borderBottomWidth:2,
            borderWidth:2,
            justifyContent:'center',
            alignItems:'center',
            paddingHorizontal:20,
            paddingVertical:2,
            borderRadius:10,
            marginBottom:0
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
         <View className='w-full justify-center items-center py-1'>
         <Button
         title="Continue"
         loading={loading}
         disabled={loading}
         onPress={()=>handleSubmit()}
        //  disabled={!disableLogin}
         titleStyle={{ fontFamily:'Montserrat-SemiBold',fontSize:16}}
         buttonStyle={{
           backgroundColor: '#F39424',
           width:'100%',
           borderColor: 'transparent',
           borderWidth: 0,
           borderRadius: 8,
           paddingVertical: 13,
         }}
         containerStyle={{
           width: '100%',
         }}
       />
       </View>        
          </View>
      )}
    </Formik>
    </View>
    </View>
    </SafeAreaView>
  )
}

export default UploadProfile

const styles = StyleSheet.create({
    card: {
      // maxWidth: 340,
    //   width:'45%',
    //   height:'25%',
      marginHorizontal: 'auto',
      backgroundColor: '#ffffff',
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
      marginTop:9
    }
})
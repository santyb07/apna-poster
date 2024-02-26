import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import ImagePicker from 'react-native-image-crop-picker';
import { Image } from 'react-native';
import FontAwesomeIcon5 from "react-native-vector-icons/FontAwesome5"
import AntDesignIcon from "react-native-vector-icons/AntDesign"
import EvillIcons from "react-native-vector-icons/EvilIcons"
import FontistoIcons from "react-native-vector-icons/Fontisto"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import { Button, Input } from '@rneui/themed';
import * as yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import firestore from "@react-native-firebase/firestore"
import Auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { showMessage } from 'react-native-flash-message'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/appNavigation';
import { useDispatch } from 'react-redux'
import { addProfileDetails, updateLogo, updatePartyLogo, updateProductLogo } from '../../redux/features/profileDetailsSlice';
import storage from '@react-native-firebase/storage';
import { useTranslation } from 'react-i18next';

type businessDetailsProps={
  image:string,
  name:string, 
  mobileNumber:{
    mobileNumber1:string,
    mobileNumber2:string,
  }
  email:string,
  website:string,
  location:string,
}
const validationSchema = yup.object().shape({
  name: yup.string().required('Business Name is required'),
  aboutYourself:yup.string(),
  mobileNumber1: yup.string().matches(/^\d+$/, 'Invalid phone number').min(10, 'Must be at least 10 digits').required('Mobile Number 1 is required'),
  mobileNumber2: yup.string().matches(/^\d+$/, 'Invalid phone number').min(10, 'Must be at least 10 digits'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  website: yup.string(),
  location: yup.string().required('Location is required'),
  partyName:yup.string(),
});

interface EditProfileProps{
  navigation: StackNavigationProp<RootStackParamList,'EditProfile'>,
}

const EditProfile = ({navigation}:EditProfileProps) => {
  const userData = useSelector((state:RootState)=>state.auth)
  const profileDetails = useSelector((state:RootState)=>state.profileDetails)
  const [img, setImg] = useState<string | undefined>(profileDetails.logo);
  // const [uploadedImg, setUploadedImg] = useState<string>("");
  // const [metaData,setMetadat] = useState(profileDetails.logoMetadata? profileDetails.logoMetadata:"");
  const [loading,setLoading] = useState<boolean>(false);
  const [select,setSelect] =useState(false);
  const dispatch = useDispatch();
  const [accountType,setAccountType]= useState(profileDetails.accountType? profileDetails.accountType:'Personal');
  const [partyLogo,setPartyLogo]= useState<string | null>(null);
  const [selectPartyLogo,setSelectPartyLogo] =useState(false);
  const [productLogo,setProductLogo]= useState<string | null>(null);
  const [selectProductLogo,setSelectProductLogo] =useState(false);
  const [partyLoading,setPartyLoading] = useState(false);
  const [productLoading,setProductLoading] = useState(false);
  const {t,i18n} = useTranslation();


  const pickImage =(val:string)=>{
    ImagePicker.openPicker({
      // width: null,
      // height: 'auto',
      cropping: true,
      compressImageQuality:0.3
    }).then(image => {
        if(val==='profile'){
            console.log(image);
            setImg(image.path)
            setSelect(true);
        }else if(val==='partyLogo'){
            setPartyLogo(image.path);
            setSelectPartyLogo(true);
            console.log('party logo selected')
        }else{
            setProductLogo(image.path);
            setSelectProductLogo(true);
            console.log('product logo selected')
        }
    }).catch((err:any)=>{
      console.log('error in uploading the image',err)
    });
  }

  const uploadImage =async()=>{
    try{
      setLoading(true)
      if(profileDetails.logoMetadata){
        try{
          const response = storage().ref(profileDetails.logoMetadata).delete();
          console.log('previous image deleted successfully.',response);
        }catch(err){
          console.log("error in deleting image",err)
        }
      }
      const response = storage().ref(`/logo/webbrand-${userData.userId}.jpg`)
      if(img!= undefined){
        const put = await response.putFile(img);
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
        setImg(url);
        setLoading(false)
        setSelect(false)
      }else{
        console.log('image not available')
      }
    }catch(err){
      console.log(err)
    }
  }
  
  const uploadPartyLogo =async()=>{
    try{
    setPartyLoading(true)
      if(profileDetails.partyLogoMetadata){
        try{
          const response = storage().ref(profileDetails.partyLogoMetadata).delete();
          console.log('previous party logo deleted successfully.',response);
        }catch(err){
          console.log("error in deleting party logo image",err)
        }
      }
      const response = storage().ref(`/logo/webbrand-partylogo-${userData.userId}.jpg`)
      if(partyLogo!= undefined){
        const put = await response.putFile(partyLogo);
        const url = await response.getDownloadURL();
        console.log("metadata : ",put.metadata.fullPath)
        console.log("partylogo uploaded successfully",url);

        //store logo uri in database
        const partyLogoDetails={partyLogo:url,partyLogoMetadata:put.metadata.fullPath}
        const res = await firestore()
        .collection('users')
        .doc(userData.userId)
        .update(partyLogoDetails);

        dispatch(updatePartyLogo(partyLogoDetails))
        setPartyLogo(url);
        setPartyLoading(false)
        setSelectPartyLogo(false)
      }else{
        console.log('image not available')
      }
    }catch(err){
      console.log(err)
    }
  }
  const uploadProductLogo =async()=>{
    try{
    setPartyLoading(true)
      if(profileDetails.productLogoMetadata){
        try{
          const response = storage().ref(profileDetails.productLogoMetadata).delete();
          console.log('previous product logo deleted successfully.',response);
        }catch(err){
          console.log("error in deleting product logo image",err)
        }
      }
      const response = storage().ref(`/logo/webbrand-productlogo-${userData.userId}.jpg`)
      if(productLogo!= undefined){
        const put = await response.putFile(productLogo);
        const url = await response.getDownloadURL();
        console.log("metadata : ",put.metadata.fullPath)
        console.log("productlogo uploaded successfully",url);

        //store logo uri in database
        const productLogoDetails={productLogo:url,productLogoMetadata:put.metadata.fullPath}
        const res = await firestore()
        .collection('users')
        .doc(userData.userId)
        .update(productLogoDetails);

        dispatch(updateProductLogo(productLogoDetails))
        setPartyLogo(url);
        setProductLoading(false)
        setSelectProductLogo(false)
      }else{
        console.log('image not available')
      }
    }catch(err){
      console.log(err)
    }
  }

  
  
  const handleSubmit =async(values: any) => {
    try{
        setLoading(true);
        //updating the details
        const details={
          name:values.name,
          email:values.email,
          location:values.location,
          mobileNumber1:values.mobileNumber1,
          mobileNumber2:values.mobileNumber2,
          website:values.website,
          accountType:accountType,
          aboutYourself:values.aboutYourself,
          partyName:values.partyName,
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
      navigation.goBack();
    }catch(err){
        console.log(err)
      showMessage({
        message: "Somethign went wrong",
        // description: "This is our second message",
        type: "danger",
        titleStyle:{fontFamily:'Montserrat-Bold',textAlign:"center",color:'#FFFFFF'},
        // backgroundColor:"#000000"
      });
      // console.log('something went wrong while updating the details',err)
    }
  };

  console.log(accountType)
  return (
    <View className='flex-1'>
      <ScrollView>
      <View className='flex-row justify-center space-x-4 items-center py-2 '>
      <TouchableOpacity className={accountType=='Personal'? 'border-none px-12 py-3 rounded-xl bg-orange-400':'border px-12 py-3 rounded-xl'} onPress={()=>setAccountType('Personal')}>
          <Text className={accountType=='Personal'? 'font-[Montserrat-SemiBold] text-white':'font-[Montserrat-SemiBold] '}>Personal</Text>
        </TouchableOpacity>
        <TouchableOpacity className={accountType=='Business'? 'border-none px-12 py-3 rounded-xl bg-orange-400':'border px-12 py-3 rounded-xl'} onPress={()=>setAccountType('Business')}>
          <Text className={accountType=='Business'? 'font-[Montserrat-SemiBold] text-white':'font-[Montserrat-SemiBold] '}>Business</Text>
        </TouchableOpacity>
      </View>
      <View className='flex-row justify-around items-center px-4 py-4'>
        <View className='border-4 rounded-xl border-orange-400'>
        <Image source={{uri:img}} height={118} width={118} resizeMode="contain" style={{borderRadius:10}}/>
        </View>
        {
        select ?
        <View className='justify-center items-center mb-4'>
        {
          loading? 
          (<TouchableOpacity className=' justify-center items-center border-none bg-orange-400   py-2 px-16 rounded-xl'>
          <Text className='text-base font-[Montserrat-SemiBold] text-white '><ActivityIndicator size={'small'} color={'white'}/></Text>
        </TouchableOpacity>)
          :
          (<TouchableOpacity className=' justify-center items-center border-none bg-orange-400 py-2 px-6 rounded-xl' onPress={uploadImage}>
          <Text className='text-base font-[Montserrat-SemiBold] text-white'>Save {accountType=='Personal'? 'Profile':'Logo'}</Text>
        </TouchableOpacity>)
        }
      </View>:
      <TouchableOpacity className={'border px-4 py-3 rounded-xl'} onPress={()=>pickImage('profile')}>
      <Text className={'text-base font-[Montserrat-Regular] '}>Choose {accountType=='Personal'? 'Profile':'Logo'}</Text>
    </TouchableOpacity>
      }
      </View>
      <Formik
      initialValues={{
        name: profileDetails.name,
        aboutYourself:profileDetails.aboutYourself || null,
        mobileNumber1: userData.mobileNumber,
        mobileNumber2: profileDetails.mobileNumber2 || null,
        email: profileDetails.email,
        website: profileDetails.website,
        location: profileDetails.location,
        partyName:profileDetails.partyName || null,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }: FormikProps<any>): React.ReactNode => (
          <View className='space-y-4 pb-4'>
            <View className='px-4 space-y-2'>
            <View style={styles.card}>
            <Text className='text-lg'>{accountType==='Personal'? t('personalDetails'):t('businessDetails')}</Text>
         <View className=' px-2'>
            <Text className='text-base'>{accountType==='Personal'? t('name'):t('businessName')}</Text>
        </View>
            <Input
        placeholder={accountType==='Personal'? t('namePlaceholder'):t('businessNamePlaceholder')}
        maxLength={20}
        value={values.name}
        onChangeText={handleChange('name')}
        errorMessage={(errors.name && typeof errors.name === 'string') ? errors.name:''}
        leftIcon={
            accountType==='Personal'?
          <FontAwesomeIcon5
            name='user-alt'
            size={18}
            color='black'
          />:
          <FontAwesomeIcon5
            name='business-time'
            size={18}
            color='black'
          />
        }
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
         <View className=' px-2'>
            <Text className='text-base'>{accountType==='Personal'? t('aboutYourself'):t('aboutYourBusiness')}</Text>
        </View>
            <Input
        placeholder={accountType==='Personal'? t('aboutYourselfPlaceholder'):t('aboutYourBusinessPlaceholder')}
        maxLength={40}
        value={values.aboutYourself}
        onChangeText={handleChange('aboutYourself')}
        errorMessage={(errors.name && typeof errors.name === 'string') ? errors.name:''}
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
        {/* <View className='border px-4 rounded-xl pt-1 bg-gray-100'> */}
        <View style={styles.card}>
            <Text className='text-lg'>{t('contactDetails')}</Text>
         <View className=' px-2'>
            <Text className='text-base'>{t('mobileNumber1')}</Text>
        </View>
         <Input
        placeholder={t('mobileNumber1')}
        value={values.mobileNumber1}
        onChangeText={handleChange('mobileNumber1')}
        disabled
        errorMessage={(errors.mobileNumber1 && typeof errors.mobileNumber1 === 'string') ? errors.mobileNumber1:''}
        keyboardType='numeric'
        maxLength={10}
        leftIcon={
          <SimpleLineIcons
          name='screen-smartphone'
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
            // borderBottomColor:'white',
            // paddingBottom:20
            // paddingVertical:0
            fontSize:16            
          }}
        containerStyle={{
          // borderWidth:1,
          paddingHorizontal:0,
          paddingBottom:0
          // paddingVertical:0,
          // justifyContent:'center',
          // alignItems:'center',
          // borderRadius:10
          // padding:0,
          // margin:0
          
        }}
        underlineColorAndroid='transparent'        
        // inputStyle={{borderWidth:4}}
        />
          <View className=' px-2'>
            <Text className='text-base'>{t('mobileNumber2')}</Text>
            </View>
         <Input
        placeholder={t('mobileNumber2')}
        value={values.mobileNumber2}
        onChangeText={handleChange('mobileNumber2')}
        keyboardType='numeric'
        maxLength={10}
        errorMessage={(errors.mobileNumber2 && typeof errors.mobileNumber2 === 'string') ? errors.mobileNumber2:''}
        leftIcon={
          <SimpleLineIcons
          name='screen-smartphone'
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
            // borderBottomColor:'white',
            // paddingBottom:20
            // paddingVertical:0
            fontSize:16
          }}
        containerStyle={{
          // borderWidth:1,
          paddingHorizontal:0,
          paddingBottom:0
          // paddingVertical:0,
          // justifyContent:'center',
          // alignItems:'center',
          // borderRadius:10
          // padding:0,
          // margin:0
          
        }}
        underlineColorAndroid='transparent'        
        // inputStyle={{borderWidth:4}}
        />
        {
            accountType==='Business' &&
            <>
              <View className=' px-2'>
            <Text className='text-base'>{t('email')}</Text>
            </View>
         <Input
        placeholder={t('emailPlaceholder')}
        value={values.email}
        onChangeText={handleChange('email')}
        keyboardType='email-address'
        maxLength={30}
        errorMessage={(errors.email && typeof errors.email === 'string') ? errors.email:''}
        leftIcon={
          <FontistoIcons
          name='email'
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
            // borderBottomColor:'white',
            // paddingBottom:20
            // paddingVertical:0
            fontSize:16
          }}
        containerStyle={{
          // borderWidth:1,
          paddingHorizontal:0,
          paddingBottom:0
          // paddingVertical:0,
          // justifyContent:'center',
          // alignItems:'center',
          // borderRadius:10
          // padding:0,
          // margin:0
          
        }}
        underlineColorAndroid='transparent'        
        // inputStyle={{borderWidth:4}}
        />
         <View className=' px-2'>
            <Text className='text-base'>{t('website')}</Text>
        </View>
         <Input
        placeholder={t('websitePlaceholder')}
        value={values.website}
        errorMessage={(errors.website && typeof errors.website === 'string') ? errors.website:''}
        onChangeText={handleChange('website')}
        keyboardType='url'
        maxLength={20}
        leftIcon={
          <AntDesignIcon
          name='earth'
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
            // borderBottomColor:'white',
            // paddingBottom:20
            // paddingVertical:0
            fontSize:16
          }}
        containerStyle={{
          // borderWidth:1,
          paddingHorizontal:0,
          paddingBottom:0
          // paddingVertical:0,
          // justifyContent:'center',
          // alignItems:'center',
          // borderRadius:10
          // padding:0,
          // margin:0
          
        }}
        underlineColorAndroid='transparent'        
        // inputStyle={{borderWidth:4}}
        />
            </>
        }
         <View className=' px-2'>
            <Text className='text-base'>{t('location')}</Text>
            </View>
         <Input
        placeholder={t('locationPlaceholder')}
        value={values.location}
        onChangeText={handleChange('location')}
        errorMessage={(errors.location && typeof errors.location === 'string') ? errors.location:''}
        maxLength={70}
        leftIcon={
          <EvillIcons
          name='location'
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
            // borderBottomColor:'white',
            // paddingBottom:20
            // paddingVertical:0
            fontSize:16
          }}
        containerStyle={{
          // borderWidth:1,
          paddingHorizontal:0,
          paddingBottom:0
          // paddingVertical:0,
          // justifyContent:'center',
          // alignItems:'center',
          // borderRadius:10
          // padding:0,
          // margin:0
          
        }}
        underlineColorAndroid='transparent'        
        // inputStyle={{borderWidth:4}}
        />
        </View>
        <View style={styles.card}>
            <Text className='text-lg'>{accountType==='Personal'? t('party'):t('productDetails')}</Text>

        {
            accountType==='Personal'?
            <>
             <View className=' px-2'>
            <Text className='text-base'>{t('partyName')}</Text>
        </View>
            <Input
        placeholder={t('partyNamePlaceholder')}
        maxLength={20}
        value={values.partyName}
        onChangeText={handleChange('partyName')}
        errorMessage={(errors.partyName && typeof errors.partyName === 'string') ? errors.partyName:''}
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
        {/* upload Party logo or product logo  */}
            <Text className='text-base font-[Montserrat-Regular]'>{t('partyLogo')}</Text>
         <View className='flex-row justify-around items-center px-4 py-4'>
        <View className='border-4 rounded-xl border-orange-400'>
        <Image source={{uri:partyLogo || "https://cdn.pixabay.com/photo/2016/11/04/10/31/frame-1797366_1280.png"}} height={118} width={118} resizeMode="contain" style={{borderRadius:10}}/>
        </View>
        {
        selectPartyLogo ?
        <View className='justify-center items-center mb-4'>
        {
          partyLoading? 
          (<TouchableOpacity className=' justify-center items-center border-none bg-orange-400   py-2 px-16 rounded-xl'>
          <Text className='text-base font-[Montserrat-SemiBold] text-white '><ActivityIndicator size={'small'} color={'white'}/></Text>
        </TouchableOpacity>)
          :
          (<TouchableOpacity className=' justify-center items-center border-none bg-orange-400 py-2 px-6 rounded-xl' onPress={uploadPartyLogo}>
          <Text className='text-base font-[Montserrat-SemiBold] text-white'>Save {accountType=='Personal'? 'Profile':'Logo'}</Text>
        </TouchableOpacity>)
        }
      </View>:
      <TouchableOpacity className={'border px-8 py-3 rounded-xl'} onPress={()=>pickImage('partyLogo')}>
      <Text className={'text-base font-[Montserrat-Regular] '}>{t('chooseLogo')}</Text>
    </TouchableOpacity>
      }
      </View>
            </>:
            <>
       {/* upload Party logo or product logo  */}
           <Text className='text-base font-[Montserrat-Regular]'>{t('productLogo')}</Text>
        <View className='flex-row justify-around items-center px-4 py-4'>
       <View className='border-4 rounded-xl border-orange-400'>
       <Image source={{uri:productLogo || "https://cdn.pixabay.com/photo/2016/11/04/10/31/frame-1797366_1280.png"}} height={118} width={118} resizeMode="contain" style={{borderRadius:10}}/>
       </View>
       {
       selectProductLogo ?
       <View className='justify-center items-center mb-4'>
       {
         productLoading? 
         (<TouchableOpacity className=' justify-center items-center border-none bg-orange-400   py-2 px-16 rounded-xl'>
         <Text className='text-base font-[Montserrat-SemiBold] text-white '><ActivityIndicator size={'small'} color={'white'}/></Text>
       </TouchableOpacity>)
         :
         (<TouchableOpacity className=' justify-center items-center border-none bg-orange-400 py-2 px-6 rounded-xl' onPress={uploadProductLogo}>
         <Text className='text-base font-[Montserrat-SemiBold] text-white'>Save {accountType=='Personal'? 'Profile':'Logo'}</Text>
       </TouchableOpacity>)
       }
     </View>:
     <TouchableOpacity className={'border px-8 py-3 rounded-xl'} onPress={()=>pickImage('productLogo')}>
     <Text className={'text-base font-[Montserrat-Regular] '}>{t('chooseLogo')}</Text>
   </TouchableOpacity>
     }
     </View>
           </>
        }
        
        </View>
        </View >
         <View className='w-full justify-center items-center py-1 px-4'>
         <Button
         title="Save"
         loading={loading}
         disabled={loading}
         onPress={()=>handleSubmit()}
        //  disabled={!disableLogin}
         titleStyle={{ fontFamily:'Montserrat-SemiBold',fontSize:20 }}
         buttonStyle={{
           backgroundColor: '#F39424',
           width:'100%',
           borderColor: 'transparent',
           borderWidth: 0,
           borderRadius: 9,
           paddingVertical: loading? 14:10,
         }}
         containerStyle={{
           width: '100%',
         }}
       />
       </View>
        </View>
      )}
    </Formik>
    </ScrollView>
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
    card: {
      // maxWidth: 340,
    //   width:'45%',
    //   height:'25%',
    // position:'relative',
      marginHorizontal: 'auto',
      backgroundColor: '#ffffff',
      borderRadius: 12,
      paddingHorizontal:20,
      paddingVertical:1,
    //   borderWidth:5,
    //   borderColor:colors.ActiveColor,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
    //   marginTop:9
    },
})
import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import type { Action, PayloadAction } from '@reduxjs/toolkit'
import AsyncStorage from "@react-native-async-storage/async-storage"
import {PURGE} from "redux-persist"
export interface businessDetailsProps{
        name:string | null,
        email:string | null,
        location:string | null,
        logo:string | undefined,
        logoMetadata:string | undefined,
        partyLogo:string | null,
        partyLogoMetadata:string | null,
        productLogo:string | null,
        productLogoMetadata:string | null,
        mobileNumber1:string | null,
        mobileNumber2:string | null,
        website:string | null,
        selectedFrame:string | null,
        accountType:string | null,
        language:string | null,
        aboutYourself:string | null,
        partyName:string | null,
}

const initialState: businessDetailsProps= {
    name:null,
    email:null,
    location:null,
    logo:"",
    logoMetadata:undefined,
    partyLogo:null,
    partyLogoMetadata:null,
    productLogo:null,
    productLogoMetadata:null,
    mobileNumber1:null,
    mobileNumber2:null,
    website:null,
    selectedFrame:'frame1',
    accountType:null,
    language:null,
    aboutYourself:null,
    partyName:null,

}

export const profileDetailsSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    addName:(state,action)=>{
      state.name= action.payload
    },
    addProfileDetails:(state,action)=>{
        state.name =action.payload.name;
        state.email =action.payload.email;
        state.mobileNumber1 =action.payload.mobileNumber1;
        state.mobileNumber2 =action.payload.mobileNumber2;
        state.website =action.payload.website;
        state.location =action.payload.location;
        state.accountType = action.payload.accountType ?action.payload.accountType:null;
        state.language= action.payload.language,
        state.aboutYourself=action.payload.aboutYourself ? action.payload.aboutYourself:null;
        state.partyName=action.payload.partyName ? action.payload.partyName:null;
        state.partyLogo= action.payload.partyLogo || null;
        state.partyLogoMetadata= action.payload.partyLogoMetadata || null;
        state.productLogo= action.payload.productLogo || null,
        state.productLogoMetadata = action.payload.productLogoMetadata || null;
        if(action.payload.logoMetadata){
          state.logoMetadata= action.payload.logoMetadata
          state.logo= action.payload.logo
        }
    },
    clearProfileDetails:(state)=>{
        state.name=null,
        state.email =null;
        state.mobileNumber1 =null;
        state.mobileNumber2 =null;
        state.website =null;
        state.location =null;
        state.logoMetadata = undefined;
        state.logo= undefined;
        state.accountType= null;
        state.language= null
        state.aboutYourself=null;
        state.partyName=null;

        // console.warn('user loggedin');
    },
    updateLogo:(state,action)=>{
      state.logo = action.payload.logo;
      state.logoMetadata = action.payload.logoMetadata;
      // console.warn('user loggedin');
    },
    updatePartyLogo:(state,action)=>{
      state.partyLogo= action.payload.partyLogo || null;
      state.partyLogoMetadata= action.payload.partyLogoMetadata || null;
    },
    updateProductLogo:(state,action)=>{
        state.productLogo= action.payload.productLogo || null,
        state.productLogoMetadata = action.payload.productLogoMetadata || null;
    },
    selectFrame:(state,action)=>{
      if(action.payload){
        // console.warn('frame selected',action.payload);
        state.selectedFrame= action.payload;
      }
      // else{
      //   console.warn('frame not selected',action.payload);
      // }
    }
  },
  extraReducers:builder=>{
    builder.addCase(PURGE,()=>{
      AsyncStorage.removeItem('persist:root');
      return initialState;
    })
  }

})

// Action creators are generated for each case reducer function
export const {addProfileDetails, clearProfileDetails, selectFrame,updateLogo,addName,updatePartyLogo,updateProductLogo} = profileDetailsSlice.actions

export default profileDetailsSlice.reducer
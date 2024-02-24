import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import type { Action, PayloadAction } from '@reduxjs/toolkit'
import AsyncStorage from "@react-native-async-storage/async-storage"
import {PURGE} from "redux-persist"
export interface businessDetailsProps{
        businessName:string | null,
        email:string | null,
        location:string | null,
        logo:string | undefined,
        mobileNumber1:string | null,
        mobileNumber2:string | null,
        website:string | null,
        selectedFrame:string | null,
        designation : string | null,
        logoMetadata:string | undefined,
        accountType:string | null,
}

const initialState: businessDetailsProps= {
    businessName:null,
    email:null,
    location:null,
    logo:"",
    mobileNumber1:null,
    mobileNumber2:null,
    website:null,
    selectedFrame:'frame1',
    designation :null,
    logoMetadata:undefined,
    accountType:null,

}

export const businessDetailsSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    addBusinessDetails:(state,action)=>{
        state.businessName =action.payload.businessName;
        state.email =action.payload.email;
        state.mobileNumber1 =action.payload.mobileNumber1;
        state.mobileNumber2 =action.payload.mobileNumber2;
        state.website =action.payload.website;
        state.location =action.payload.location;
        state.designation= action.payload.designation ? action.payload.designation :null;
        state.accountType = action.payload.accountType ?action.payload.accountType:null;
        if(action.payload.logoMetadata){
          state.logoMetadata= action.payload.logoMetadata
          state.logo= action.payload.logo
        }
    },
    clearBusinessDetails:(state)=>{
        state.businessName =null;
        state.email =null;
        state.mobileNumber1 =null;
        state.mobileNumber2 =null;
        state.website =null;
        state.location =null;
        state.logoMetadata = undefined;
        state.logo= undefined;
        state.accountType= null;
        // console.warn('user loggedin');
    },
    updateLogo:(state,action)=>{
      state.logo = action.payload.logo;
      state.logoMetadata = action.payload.logoMetadata;
      // console.warn('user loggedin');
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
export const {addBusinessDetails, clearBusinessDetails, selectFrame,updateLogo} = businessDetailsSlice.actions

export default businessDetailsSlice.reducer
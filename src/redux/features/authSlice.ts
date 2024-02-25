import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import type { Action, PayloadAction } from '@reduxjs/toolkit'
import AsyncStorage from "@react-native-async-storage/async-storage"
import {PURGE} from "redux-persist"
export interface OnboardState {
    userLoggedIn: boolean | null,
    mobileNumber: number | null,
    userId:string | undefined,
    confirmData:any | undefined,
    language:string | null,
    isUploadedDetails:boolean,
}

const initialState: OnboardState = {
    userLoggedIn: false,
    mobileNumber: null,
    userId: undefined,
    confirmData:undefined,
    language:null,
    isUploadedDetails:false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setConfirmData:(state,action)=>{
      state.confirmData= action.payload
    },
    clearConfirmData:(state,action)=>{
      state.confirmData= undefined
    },
    setLanguage:(state,action)=>{
      state.language= action.payload
    },
    setUploadedDetails:(state,action)=>{
      state.isUploadedDetails=action.payload;
    },
    loginUser:(state,action)=>{
        state.userLoggedIn = true;
        state.mobileNumber = action.payload.mobileNumber;
        state.userId = action.payload.userId;
        state.isUploadedDetails= action.payload.isUploadedDetails;
        // console.warn(action.payload)
        // console.warn('user loggedin');
    },
    logoutUser:(state)=>{
        state.userLoggedIn = false;
        state.mobileNumber =null;
        state.userId = '';
        // console.warn('user loggedin');
    },
  },
  extraReducers:builder=>{
    builder.addCase(PURGE,()=>{
      AsyncStorage.removeItem('persist:root');
      return initialState;
    })
  }

})

// Action creators are generated for each case reducer function
export const {loginUser, logoutUser,setConfirmData, clearConfirmData, setLanguage,setUploadedDetails} = authSlice.actions

export default authSlice.reducer
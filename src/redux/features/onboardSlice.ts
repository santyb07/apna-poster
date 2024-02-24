import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import type { Action, PayloadAction } from '@reduxjs/toolkit'
import AsyncStorage from "@react-native-async-storage/async-storage"
import {PURGE} from "redux-persist"
export interface OnboardState {
  alreadyLaunched: string | null,
}

const initialState: OnboardState = {
    alreadyLaunched: null,
}

// export const  setLauched = createAsyncThunk(
//     'setLauched',
//     async()=>{
//         try{
//             await AsyncStorage.setItem('alreadyLaunched',"1");
//         }catch(error){
//             console.warn(error);
//         }
//         return "1";
//     }
// )
// export const  removeLaunch = createAsyncThunk(
//     'removeLaunch',
//     async()=>{
//         try{
//             await AsyncStorage.removeItem('alreadyLaunched');
//             return null;
//         }catch(error){
//             console.warn(error);
//         }
//     }
// )
// export const  getLauched = createAsyncThunk(
//     'getLauched',
//     async()=>{
//         try{
//             let isLauched= await AsyncStorage.getItem('alreadyLaunched');
//             return isLauched;
//         }catch(error){
//             console.warn(error);
//         }
//     }
// )

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setLauched:(state)=>{
        state.alreadyLaunched = '1';
        console.warn('setLauched called');
    },
    removeLaunch:(state)=>{
        state.alreadyLaunched= null;
        
        console.warn('removeLauched called');
        console.log(state.alreadyLaunched);

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
export const {setLauched, removeLaunch} = onboardingSlice.actions

export default onboardingSlice.reducer
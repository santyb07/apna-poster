import { configureStore } from '@reduxjs/toolkit'
import OnboardReducer from '../features/onboardSlice'
import authReducer from '../features/authSlice'
import businessReducer from '../features/businessDetailsSlice'

import { combineReducers } from '@reduxjs/toolkit'
import persistReducer from 'redux-persist/es/persistReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore } from 'redux-persist'
// import persistStore from 'redux-persist/es/persistStore';


let persistConfing={
  key:"root",
  storage: AsyncStorage
}

let rootReducer = combineReducers({
  onboarding: OnboardReducer,
  auth: authReducer,
  businessDetails:businessReducer
})

 

let persistedReducer = persistReducer(persistConfing,rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>
  getDefaultMiddleware({
    serializableCheck:false
  })
})

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
import React, { useCallback, useRef, useState } from 'react'
import { Stack } from './AppNavigation';
import HomeScreen from '../screens/home/HomeScreen';
// import HomeScreen from '../screens/HomeScreen'
// import {BottomTabBar, BottomTabBarProps, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import FeatherIcons from "react-native-vector-icons/Feather"
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
// import FontAwesomeIcons from "react-native-vector-icons/FontAwesome6"

// import { colors } from '../utils/constants';
// import Templates from '../screens/Template/Templates';
// import AdsPackage from '../screens/AdsPackage';
// import AllLeads from '../screens/AllLeads';
// import BusinessDetails from '../screens/business/BusinessDetails';
// import MainScreen from '../screens/MainScreen';
// import TemplateEditor from '../screens/Template/TemplateEditor';
// import { NavigationContainer } from '@react-navigation/native';
// import AccountOverview from '../screens/components/AccountOverview';
// import DownloadShareTemplate from '../screens/Template/components/DownloadShareTemplate';
// import EditBusinessDetails from '../screens/business/EditBusinessDetails';
// import Frame1 from '../screens/Template/components/frames/Frame1';
// import ChooseFrame from '../screens/Template/ChooseFrame';
// import TestNotification from '../screens/TestNotification';

export type BottomTabParamList ={
 Main: undefined,
 Design: undefined,
 Grow: undefined,
 Leads: undefined,
 Business:undefined,
}

// const Tab = createBottomTabNavigator<BottomTabParamList>();

// const HomeTabs=()=>(
//   <Tab.Navigator
//     screenOptions={{
//       tabBarActiveTintColor: colors.ActiveColor,
//       tabBarInactiveTintColor: colors.InactiveColor,
//       tabBarStyle: {
//         position: 'absolute',
//         borderTopColor: 'rgba(0, 0, 0, .2)',
//         paddingBottom:10,
//         paddingTop:3,
//         height:60
//       },
//       headerShown:false,
//       tabBarLabelStyle:{fontFamily:'Montserrat-Medium',fontSize:12},
//     }}
//     backBehavior='initialRoute'
//     initialRouteName='Main'
//     >  
//          <Tab.Screen 
//          name="Main" 
//          component={HomeScreen}
//          options={{
//            tabBarLabel: 'Home',
//            tabBarIcon: ({focused ,color, size}) => (
//              <FeatherIcons name="home" color={color} size={24} />
//          ),
    
//        }
//        } 
//          />
//          <Tab.Screen 
//          name="Design" 
//          component={Templates}
//          options={()=>({
//            tabBarLabel: 'Design',
//           //  tabBarVisible: false,
//            tabBarIcon: ({color, size}) => (
//              <FeatherIcons name="layout" color={color} size={24} />
//          ),
//         })} 
//          />
//          <Tab.Screen 
//          name="Grow" 
//          component={AdsPackage}
//          options={()=>({
//            tabBarLabel: 'Grow',
//            tabBarIcon: ({color, size}) => (
//              <MaterialCommunityIcons name="rocket-launch" color={color} size={24} />
//              ),        
//             })} 
//             />
//          <Tab.Screen 
//          name="Leads" 
//          component={AllLeads}
//          options={()=>({
//            tabBarLabel: 'Leads',
//            tabBarIcon: ({color, size}) => (
//              <MaterialCommunityIcons name="account-group-outline" color={color} size={24} />
//              ),
//             })}
//          />
//           <Tab.Screen 
//          name="Business" 
//          component={BusinessDetails}
//          options={()=>({
//            tabBarLabel: 'Business',
//            tabBarIcon: ({color, size}) => (
//              <FontAwesomeIcons name="building" color={color} size={24} />
//              ),
//        })}
//          /> 
//      </Tab.Navigator>
// )


function AppStack() {
  return (
    <Stack.Navigator
    screenOptions={{ 
              contentStyle: {backgroundColor: 'white'},
              animationTypeForReplace:"pop",
              animation:"slide_from_right",
              headerTitleStyle:{fontFamily:'Montserrat-Medium'}
           }}
    >
      {/* <Stack.Screen name="Home" component={HomeTabs} options={{headerShown:false}} /> */}
      {/* <Stack.Screen name="TemplateEditor" component={TemplateEditor} options={{headerShown:false,title:'Edit Template'}}/> */}
      {/* <Stack.Screen name="EditBusinessDetails" component={EditBusinessDetails} options={{headerShown:true,title:'Edit Your Business'}}/> */}
      {/* <Stack.Screen name="ChooseFrame" component={ChooseFrame} options={{headerShown:true,title:'Choose Frame'}}/> */}
      {/* <Stack.Screen name="DownloadShareTemplate" component={DownloadShareTemplate} options={{headerShown:true,title:'Share & Post'}}/> */}
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false,title:'Back'}}/>
  </Stack.Navigator>
  );
}

export default AppStack;
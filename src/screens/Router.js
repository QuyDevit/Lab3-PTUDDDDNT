import 'react-native-gesture-handler'
import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login'
import Register from './Register';
import RouterService from './RouterService';
import RouterServiceCustomer from './RouterServiceCustomer';


const Stack = createNativeStackNavigator();

const Router = () => {
  return (

   <Stack.Navigator inititalRouteName ='Login' screenOptions={{ headerTitleAlign:'center'}}>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="RouterService" component={RouterService}  options={{ headerShown: false }} />
        <Stack.Screen name="RouterServiceCustomer" component={RouterServiceCustomer}  options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default Router
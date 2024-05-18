import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useMyContextController } from '../context';
import Setting from './Setting';
import Customer from './Customer';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Tab = createBottomTabNavigator();
const RouterServiceCustomer = ({navigation}) => {

    const [controller,dispatch] = useMyContextController();
    const {userLogin} = controller;

    useEffect(() => {
      if(userLogin == null){
        navigation.navigate('Login')
      }
    },[userLogin])
  return (
    <Tab.Navigator initialRouteName='Customer' screenOptions={{
                tabBarIconStyle: { display: 'flex' },
                tabBarActiveTintColor: 'tomato',
                headerShown:false
            }}
            
      >
           <Tab.Screen
                name="Customer"
                component={Customer}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" color={color} size={size} />
                    )
                }}
            />

            <Tab.Screen
                name="Setting"
                component={Setting}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="settings" color={color} size={size} />
                    )
                }}
            />
            
      </Tab.Navigator>
  )
}

export default RouterServiceCustomer
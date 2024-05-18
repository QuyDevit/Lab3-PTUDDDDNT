import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useMyContextController } from '../context';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Home from './Home';
import AddNewService from './AddNewService';
import ServiceDetail from './ServiceDetail';
import { Menu, Provider } from 'react-native-paper';
import { useNavigation  } from '@react-navigation/native';
import UpdateService from './UpdateService';

const Stack = createNativeStackNavigator();
const Customer = () => {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const [controller,dispatch] = useMyContextController();
    const {userLogin} = controller;

    useEffect(() => {
      if(userLogin == null){
        navigation.navigate('Login')
      }
    },[userLogin])

  return (
    <Provider>
    <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} options={{
                    headerStyle: {
                      backgroundColor: 'tomato', 
                    },
                    headerTintColor: 'white', 
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                    title: userLogin ? userLogin.name : "Logout",
                    headerRight:() =>(<Icon name="person-pin"
                    size={30}
                    color="white"
                    style={{ marginRight: 10 }}></Icon>)
                }}></Stack.Screen>
        <Stack.Screen name='AddNewService' component={AddNewService} options={{title:'Add New Service',headerStyle: {
                      backgroundColor: 'tomato', 
                    },
                    headerTintColor: 'white', 
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    }}}></Stack.Screen>
        <Stack.Screen name='ServiceDetail' component={ServiceDetail} options={{
                    headerStyle: {
                      backgroundColor: 'tomato', 
                    },
                    headerTintColor: 'white', 
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                    title: "Service Detail"
                }}>
        </Stack.Screen>
        <Stack.Screen name='UpdateService' component={UpdateService} options={{title:'Update Service',headerStyle: {
                      backgroundColor: 'tomato', 
                    },
                    headerTintColor: 'white', 
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    }}}></Stack.Screen>
    </Stack.Navigator>
    </Provider>
  );
};


export default Customer;

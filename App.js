import 'react-native-gesture-handler';
import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { MyContextControllerProvider } from './src/context/'
import Login from './src/screens/Login'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Router from './src/screens/Router';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const Stack = createNativeStackNavigator();

  const initial = () =>{
  const USER = firestore().collection("USERS")
    const admin = {
      name:'admin',
      phone:'012356485',
      address:'Binh Duong',
      email:'quyngocit@gmail.com',
      password:'qqq123',
      role:'admin'
    }
    const user = {
      name:'customer',
      phone:'02315648',
      address:'Binh Duong',
      email:'pingvocuc123@gmail.com',
      password:'qqq123',
      role:'customer'
    }
    USER.doc(admin.email)
    .onSnapshot(u=> {
      if(!u.exists){
        auth().createUserWithEmailAndPassword(admin.email,admin.password)
        .then(()=> USER.doc(admin.email).set(admin).then(()=> console.log("Add new user admin!")))
         .catch(error => console.error("Failed to add admin user:", error));
      }
    })
     USER.doc(user.email)
    .onSnapshot(u=> {
      if(!u.exists){
        auth().createUserWithEmailAndPassword(user.email,user.password)
        .then(()=> USER.doc(user.email).set(user).then(()=> console.log("Add new user customer!!")))
        .catch(error => console.error("Failed to add customer user:", error));
      }
    })
  }
const App = () => {

  useEffect(() =>{
    initial()
  },[])
  return (
    <MyContextControllerProvider>
      <NavigationContainer>
        <Router></Router>
      </NavigationContainer>
    </MyContextControllerProvider>
    
  )
}

export default App
import { View, Text, Alert } from 'react-native'
import React, { createContext, useContext, useMemo, useReducer } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const MyContext = createContext();
MyContext.displayName = 'MyContextContext';

function reducer(state, action) {
  switch (action.type) {
    case 'USER_LOGIN':
      return { ...state, userLogin: action.value };
    case 'LOGOUT':
      return { ...state, userLogin: null };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function MyContextControllerProvider({ children }) {
  const initialState = { userLogin: null };
  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);
  console.log("Context value:", value); // This should log an array with two items
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

function useMyContextController() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContextController must be used within a MyContextControllerProvider.');
  }
  return context;
}

const USERS = firestore().collection('USERS');
const SERVICES = firestore().collection('SERVICES');
const ORDERSERVICES = firestore().collection('ORDERSERVICES');

const login = (dispatch, email, password) => {
  auth().signInWithEmailAndPassword(email, password)
    .then(() => USERS.doc(email).onSnapshot(snapshot => {
      const user = snapshot.data();
      console.log("Successfully logged in with user: ", user);
      dispatch({ type: "USER_LOGIN", value: user });
    }))
    .catch(error => Alert.alert("Incorrect username or password"));
};

const logout = (dispatch) => {
   auth().signOut()
    .then(() => dispatch({ type: "LOGOUT" }))
};

const createNewService = (newService) => {
  SERVICES.add(newService)
    .then(() => Alert.alert("Thêm dịch vụ thành công!"))
    .catch(error => Alert.alert("Error adding service: " + error.message));
};

const createOrderService = (orderService) => {
  ORDERSERVICES.add(orderService)
    .then(() => Alert.alert("Đặt dịch vụ thành công!"))
    .catch(error => Alert.alert("Error adding service: " + error.message));
};

export {
  MyContextControllerProvider,
  useMyContextController,
  login,
  logout,
  createNewService,
  createOrderService
};

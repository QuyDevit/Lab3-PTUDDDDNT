import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Button } from 'react-native-paper'
import { logout, useMyContextController } from '../context'

const Setting = ({navigation}) => {
    const [controller,dispatch] = useMyContextController();
    const {userLogin} = controller;
    useEffect(()=>{
        if(userLogin == null){
            navigation.navigate('Login')
            return;
        }
    },[userLogin])

    const handleSignOut  = () =>{
        logout(dispatch);
    }
  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <Image
        style={styles.avatar}
        source={{ uri: 'https://www.shareicon.net/data/512x512/2016/08/05/806962_user_512x512.png' }}
      />
      <View style={styles.body}>
          <Text style={styles.name}>{userLogin?.name}</Text>   

          <TouchableOpacity style={styles.buttonContainer} onPress={handleSignOut}>
            <Text style={{color:'white',fontWeight:'bold',fontSize:20}}>Đăng Xuất</Text>
          </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'tomato',
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130,
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    marginTop: 40,
        paddingHorizontal:10,
        backgroundColor:"unset"
  },
  name: {
    marginTop:20,
    fontSize: 28,
    color: '#696969',
    fontWeight: '600',
    textAlign:'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'tomato',
  },
})
export default Setting
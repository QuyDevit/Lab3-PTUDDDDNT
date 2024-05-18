import { View, Text,StyleSheet,Button,TouchableOpacity } from 'react-native'
import React, { useState ,useEffect} from 'react'
import auth from '@react-native-firebase/auth'
import { TextInput } from 'react-native-paper';
import { GoogleSignin,GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { login, useMyContextController } from '../context';

const Login = ({navigation}) => {
    const [email, setEmail] = useState('quyngocit@gmail.com');
    const [password, setPassword] = useState('qqq123');
    const [showPassword, setShowPassword] = useState(false);
    const [controller,dispatch] = useMyContextController();
    const {userLogin} = controller;

    useEffect(() => {
        if(userLogin!= null){
            if(userLogin.role == "admin")
                navigation.navigate("RouterService")
            else
                navigation.navigate("RouterServiceCustomer")
        }
    },[userLogin])

    const onSubmit= () =>{
        login(dispatch,email,password);
    }

  
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng Nhập</Text>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
            />
           <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)} />}
            />
          
            <Button
                title="Login"
                onPress={onSubmit}
            />

            <View style={styles.view}>
                    <Text>Bạn chưa có tài khoản?</Text>
                     <TouchableOpacity style = {{marginLeft:10}} >
                        <Text style={styles.text} onPress={()=> navigation.navigate('Register')}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
          
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor:'#66cdaa'
    },
    input: {
        marginBottom: 10,
    },
    title:{
         textAlign: 'center',
         fontSize:25,
         color:"white",
         fontWeight:'bold',
         marginBottom:50
    },view:{
        justifyContent:'center',
        flexDirection:'row',
        marginTop:20
    },
    text:{
        fontWeight:'bold'
    }
});

export default Login;
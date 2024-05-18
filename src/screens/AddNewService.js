import { View, Text, Image,Button, TouchableOpacity,Alert } from 'react-native'
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import TabNavigatior from './RouterService'
import { HelperText, TextInput } from 'react-native-paper';
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import ImagePicker from 'react-native-image-crop-picker';
import {createNewService} from '../context/index'

const AddNewService = () => {
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [pathImage,setPathImage] = useState('');
  const hasErrorserviceName = () => serviceName.length < 1;
  const hasErrorPrice = () => {
    return price.length < 1 || isNaN(price);
  };

  const getErrorMessage = () => {
    if (price.length < 1) {
      return "Vui lòng nhập giá";
    } else if (isNaN(price)) {
      return "Vui lòng nhập đúng định dạng số";
    }
    return "";
  };
  const upLoadImage = () =>{
    ImagePicker.openPicker({
      cropping:true,
      width:300,
      height:400,
      mediaType:'photo'
    })
    .then(image => setPathImage(image.path))
    .catch(e => console.log(e.message))
  }

  const storageRef = storage().ref('services/')
  const AddService = () => {
  if (!serviceName || !price || !pathImage) {
    Alert.alert("Vui lòng nhập đầy đủ!");
    return;
  }
  if(hasErrorPrice()){
    Alert.alert("Vui lòng nhập đúng định dạng giá tiền!");
    return;
  }

  try {
    const fileName = `${Date.now()}_${price}.jpg`;
    const imageRef = storageRef.child(fileName);

    const uploadTask = imageRef.putFile(pathImage);

    uploadTask.on('state_changed',
      () => {
      },
      (error) => {
        console.error(error);
        Alert.alert("Error uploading image: " + error.message);
      },
      async () => {
        try {
          const downloadUrl = await imageRef.getDownloadURL();
          const newService = {
            servicename: serviceName,
            price: parseFloat(price),
            imageUrl: downloadUrl,
            finalUpdate: firestore.FieldValue.serverTimestamp()
          };
          await createNewService(newService);
          setServiceName('');
          setPrice('');
          setPathImage('');
        } catch (error) {
          console.error(error);
          Alert.alert("Error getting download URL: " + error.message);
        }
      }
    );

  } catch (error) {
    console.error(error);
    Alert.alert("Error adding service: " + error.message);
  }
};
  return (
    <View style={{paddingHorizontal:15}}>
      <View style={{marginTop:20}}>
        <Text style={{fontSize:18,fontWeight:'bold',color:'black',marginBottom:5}}>Tên dịch vụ *</Text>
        <TextInput 
          mode='outlined' 
          value={serviceName}
          onChangeText={text => setServiceName(text)}>
        </TextInput>
        <HelperText style={{textAlign:'center'}} type='error' visible={hasErrorserviceName()}>Vui lòng nhập tên dịch vụ</HelperText>
      </View>
      <View style={{marginVertical:10}}>
        <Text style={{fontSize:18,fontWeight:'bold',color:'black',marginBottom:10}}>Giá *</Text>
        <TextInput 
          mode='outlined' 
          value={price}
          onChangeText={text => setPrice(text)}>
        </TextInput>
        <HelperText style={{textAlign:'center'}} type='error' visible={hasErrorPrice()}>{getErrorMessage()}</HelperText>
      </View>
      <View style={{ marginVertical: 10,alignSelf:'center',borderWidth:1,borderColor:'#000',padding:10,borderRadius:5}}>
        <TouchableOpacity
          onPress={upLoadImage}
        >
          <Text>UpLoad Image</Text>
        </TouchableOpacity>
      </View>
      {(pathImage != '') &&
        <Image 
          source={{uri: pathImage}} 
          style={{ width: 380, height: 200, marginTop: 20,resizeMode:'contain',marginBottom:20 }}>
        </Image>
      }
    
      <Button 
          title="Thêm sản phẩm"
          onPress={AddService}
          color={'tomato'}
      />
    </View>
  )
}

export default AddNewService
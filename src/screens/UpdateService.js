
import { View, Text, StyleSheet, Image, TouchableOpacity, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { TextInput ,HelperText} from 'react-native-paper';
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import ImagePicker from 'react-native-image-crop-picker';

const UpdateService = () => {
  const route = useRoute();
  const {service}  = route.params;
  const [serviceName, setServiceName] = useState(service.servicename);
  const [price, setPrice] = useState(service.price.toString());
  const [pathImage,setPathImage] = useState(service.imageUrl);

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
  const storageRef = storage().ref('services/')
  const handleUpdate = async () =>{
    if (!serviceName || !price || !pathImage) {
        Alert.alert("Vui lòng nhập đầy đủ!");
        return;
    }
    if(hasErrorPrice()){
        Alert.alert("Vui lòng nhập đúng định dạng giá tiền!");
        return;
    }

    try {
      if (pathImage === service.imageUrl) {
        await firestore().collection('SERVICES').doc(service.id).update({
          servicename: serviceName,
          price: parseFloat(price),
          finalUpdate: firestore.FieldValue.serverTimestamp(),
        });
        Alert.alert('Cập nhật thành công');
      } else {
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
                const updateService = {
                    servicename: serviceName,
                    price: parseFloat(price),
                    imageUrl: downloadUrl,
                    finalUpdate: firestore.FieldValue.serverTimestamp()
                };
                await firestore().collection('SERVICES').doc(service.id).update(updateService);
                Alert.alert('Cập nhật thành công');
                } catch (error) {
                console.error(error);
                Alert.alert("Error getting download URL: " + error.message);
                }
            }
            );
      }
    } catch (e) {
      console.error(e.message);
      Alert.alert('Cập nhật thất bại', e.message);
    }
  }
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
  return (
    <View style={{padding:15}}>
        <View style={styles.box}>
            <Text style={styles.text}>Tên dịch vụ</Text>
            <TextInput mode='outlined' value={serviceName} onChangeText={setServiceName}></TextInput>
            <HelperText style={{textAlign:'center'}} type='error' visible={hasErrorserviceName()}>Vui lòng nhập tên dịch vụ</HelperText>
        </View>
        <View style={styles.box}>
            <Text style={styles.text}>Giá tiền</Text>
            <TextInput mode='outlined' value={price} onChangeText={setPrice} keyboardType="numeric"></TextInput>
            <HelperText style={{textAlign:'center'}} type='error' visible={hasErrorPrice()}>{getErrorMessage()}</HelperText>
        </View>
        <View style={styles.box}>
            <Image style={styles.image} source={{uri:pathImage}}></Image>
            <View style={{ marginVertical: 10,alignSelf:'center',borderWidth:1,borderColor:'#000',padding:10,borderRadius:5}}>
                <TouchableOpacity
                onPress={upLoadImage}
                >
                <Text>UpLoad Image</Text>
                </TouchableOpacity>
            </View>
        </View>
       <Button 
          title="Cập nhật" color={'tomato'}
          onPress={handleUpdate}

      />    
    </View>
  )
}

export default UpdateService

const styles = StyleSheet.create({
    box: {
       marginBottom:10
    },
    text:{
      fontWeight:'bold',
      color:'black',
      fontSize:20,
      marginBottom:5
    },
    image:{
      width: 380, 
      height: 250, 
      marginTop: 20,
      resizeMode:'contain',
      marginBottom:20 
    }
});
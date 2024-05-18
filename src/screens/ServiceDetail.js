import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image ,Alert, Button} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Menu, Provider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createOrderService, useMyContextController } from '../context';

const ServiceDetail = ({ navigation }) => {
  const [controller,dispatch] = useMyContextController();
  const {userLogin} = controller;
  const route = useRoute();
  const { item } = route.params;
  const id = item.id;
  const [visible, setVisible] = useState(false);
  const [service, setService] = useState(null);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useEffect(() => {
    const unsubscribe = firestore().collection('SERVICES').doc(id)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          setService({ id: documentSnapshot.id, ...documentSnapshot.data() });
        } else {
          console.log('No such document!');
          navigation.goBack();
        }
      }, error => {
        console.error("Failed to fetch service:", error);
      });

    return () => unsubscribe(); // Cleanup on unmount
  }, [id, navigation]);
  useEffect(() => {
    if(userLogin?.role != 'customer')
      {
      navigation.setOptions({
          headerRight: () => (
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Icon name="more-vert" size={30} color="white" onPress={openMenu} style={{ marginRight: 10 }} />
              }>
              <Menu.Item onPress={handleEdit} title="Sửa" />
              <Menu.Item onPress={confirmDelete } title="Xóa" />
            </Menu>
          ),
        });
      }
  
  }, [visible, navigation]);

  const confirmDelete = () => {
    Alert.alert(
    'Xác nhận xóa dịch vụ',
    'Bạn có muốn xóa dịch vụ này không?',
    [
      {
        text: 'Hủy',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Xác nhận', onPress: handleDelete },
    ],
    { cancelable: false }
  );
  };
  const confirmOrder = () => {
    Alert.alert(
    'Xác nhận đặt dịch vụ',
    'Bạn có muốn sử dụng dịch vụ này không?',
    [
      {
        text: 'Hủy',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Xác nhận', onPress: handleOrderService },
    ],
    { cancelable: false }
  );
  };

  const handleOrderService = async() =>{
    const orderService = {
            email: userLogin.email,
            username:userLogin.name,
            idservice:id,
            status:0,
            servicename:service.servicename,
            timeorder: firestore.FieldValue.serverTimestamp()
          };
    await createOrderService(orderService);
  }

  const handleEdit = () => {
    if (service) {
      navigation.navigate('UpdateService', { service });
      closeMenu();
    }
  };
  const handleDelete = async () =>{
      await firestore().collection('SERVICES').doc(id).delete();
        Alert.alert('Xóa dịch vụ thành công!!!');
  }

  const getFormattedDate = () => {
    if (service && service.finalUpdate) {
      return `${service.finalUpdate.toDate().toLocaleDateString()} ${service.finalUpdate.toDate().toLocaleTimeString()}`;
    }
    return '';
  };

  if (!service) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ padding: 15 }}>
      <View style={styles.box}>
        <Image style={styles.image} source={{ uri: service.imageUrl }} />
      </View>
      <View style={styles.box}>
        <Text style={styles.text}>Tên dịch vụ:</Text>
        <Text style={{ fontSize: 20 }}>{service.servicename}</Text>
      </View>
      <View style={styles.box}>
        <Text style={styles.text}>Giá tiền:</Text>
        <Text style={{ fontSize: 20 }}>{`${service.price} VND`}</Text>
      </View>
      <View style={styles.box}>
        <Text style={styles.text}>Ngày cập nhật:</Text>
        <Text style={{ fontSize: 20 ,marginBottom:20}}>{getFormattedDate()}</Text>
      </View>
      {userLogin?.role === 'customer' && <Button 
          title="Đặt dịch vụ"
          onPress={confirmOrder}
          color={'tomato'}
      />}
       
    </View>
  );
}

export default ServiceDetail;

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    marginBottom: 10
  },
  text: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
    marginRight: 10
  },
  image: {
    width: 380, 
    height: 300, 
    marginTop: 20,
    resizeMode: 'contain',
    marginBottom: 20 
  }
});

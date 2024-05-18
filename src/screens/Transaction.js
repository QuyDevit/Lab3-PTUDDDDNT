import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import { useMyContextController } from '../context';

const Orders = ( item ) => {
  const ref = firestore().collection('ORDERSERVICES');
  const handleAceptStatusOrder = async() =>{
     const updateStatusOrder = {
        status: 1
     };
    await ref.doc(item.id).update(updateStatusOrder);           
  }

  const handleCancelStatusOrder = async() =>{
     const updateStatusOrder = {
        status: 2
     };
    await ref.doc(item.id).update(updateStatusOrder);           
  }
  return (
    <View style={styles.item} >
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <View>
          <View style={{flexDirection:'row'}}>
          <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>Khách hàng: </Text>
          <Text style={{fontSize:16}}>{item.username}</Text>
          </View>
          <View style={{flexDirection:'row'}}> 
          <Text style={{color:'black',fontSize:16,fontWeight:'bold'}}>Yêu cầu dịch vụ: </Text>
          <Text style={{fontSize:16}}>{item.servicename}</Text>
          </View>
        </View>
        <View>
            <Text style={{fontSize:16,fontWeight:'bold',color:'black'}}>Trạng thái</Text>
            <Text style={{fontSize:16,fontWeight:'bold',color: item.status === 0 ?  'orange': item.status === 1 ? 'green' : 'red'}}>{item.status ===0 ? 'Đang chờ' : item.status === 1 ? 'Sẵn sàng' :'Hủy'}</Text>
        </View>

      </View>
      {item.status ===0 && 
        <View style={{flexDirection:'row',justifyContent:'center',marginTop:10,gap:10}}>
          <TouchableOpacity style={[styles.button,{backgroundColor:'green'}]} onPress={handleAceptStatusOrder}>
            <Text style={{color:'white'}}>Chấp nhận</Text>
          </TouchableOpacity>
            <TouchableOpacity style={[styles.button,{backgroundColor:'red'}]} onPress={handleCancelStatusOrder}>
            <Text style={{color:'white'}}>Hủy</Text>
          </TouchableOpacity>
        </View>
      }
      
    </View>
  );
};

const Transaction = ({navigation}) => {
  const [controller,dispatch] = useMyContextController();
  const {userLogin} = controller;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = firestore().collection('ORDERSERVICES');
  useEffect(() => {
    if (userLogin == null) {
      navigation.navigate("Login");
      return;
    }

    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { email, idservice,servicename,timeorder,username,status } = doc.data();
        list.push({
          id: doc.id,
          email,
          idservice,
          servicename,
          timeorder,
          username,
          status
        });
      });
      setOrders(list);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, [userLogin, navigation]);

  if (loading) {
    return null;
  }
  return (
    <View style={{ paddingHorizontal: 15 }}>
      <Text style={styles.title}>Danh sách đặt dịch vụ</Text>
      <FlatList
        style={{ marginTop: 10 }}
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Orders {...item} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    flexDirection:'col',
    justifyContent:'space-between',
    padding:15,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    marginBottom: 8,
    borderRadius: 8
  },
  logo: {
    resizeMode: "cover",
    width: 320,
    height: 50,
    alignSelf: 'center',
    marginVertical: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    marginTop:20,
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  },
  button:{
  paddingHorizontal:10,paddingVertical:4,borderRadius:5
  }
});

export default Transaction
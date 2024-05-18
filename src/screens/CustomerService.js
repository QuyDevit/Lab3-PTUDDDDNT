import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { useMyContextController } from '../context'


const Users = (item) =>{
    return(
        <View style={{marginBottom:15,flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,paddingVertical:5,borderWidth:1,borderRadius:5}}>
            <View style={{flexDirection:'column'}}>
                <View style={{flexDirection:'row'}}>
                    <Text style={{ fontWeight: 'bold',color:'black' }}>Tên: </Text>
                    <Text>{item.name}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={{ fontWeight: 'bold',color:'black' }}>Địa chỉ: </Text>
                    <Text>{item.address}</Text>
                </View>
            </View>
            <View>
                 <View style={{flexDirection:'row'}}>
                    <Text style={{ fontWeight: 'bold' ,color:'black'}}>Điện thoại: </Text>
                    <Text>{item.phone}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={{ fontWeight: 'bold' ,color:'black'}}>Email: </Text>
                    <Text>{item.email}</Text>
                </View>
            </View>
        </View>
    )
}

const CustomerService = ({navigation}) => {
  const ref = firestore().collection('USERS').where('role', '==', 'customer');
  const [{ userLogin }, dispatch] = useMyContextController();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (userLogin == null) {
      navigation.navigate("Login");
      return;
    }

    const unsubscribe = ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const { name, email,address,phone } = doc.data();
        list.push({
          id: doc.id,
          name,
          email,
          address,
          phone
        });
      });
      setUsers(list);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, [userLogin, navigation]);

  if (loading) {
    return null;
  }
  return (
    <View style={{padding:15}}>
      <Text style={{alignSelf:'center',fontSize:20,color:'black',fontWeight:'bold'}}>Danh sách Khách hàng</Text>
        <FlatList
        style={{ marginTop: 10 }}
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Users {...item} />}
      />

    </View>
  )
}

export default CustomerService
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Header, Input, ListItem, Button, Icon } from 'react-native-elements';

const db = SQLite.openDatabase('shoppinglist.db');

export default function App() {

  const [shoppinglist, setShoppinglist] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect( () => {
    db.transaction( tx => {
      tx.executeSql('create table if not exists product (id integer primary key not null, amount text, name text);');
    }, null, updateList);
  }, []);

  const updateList = () => {
    db.transaction( tx => {
      tx.executeSql('select * from product;', [], (_, { rows }) => 
        setShoppinglist(rows._array)
      );
    }, null, null)
  };

  const saveItem = () => {
    if(!name){
      return;
    }
    db.transaction( tx => {
      tx.executeSql('insert into product (amount, name) values (?, ?);',
        [amount, name]);
    }, null, updateList)
  };

  const deleteItem = (id) => {
    db.transaction( tx => {
      tx.executeSql('delete from product where id = ?;', [id]);
    }, null, updateList )
  };


  const renderItem = ({item}) => {
    return (
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
          <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
        </ListItem.Content>
        <Icon 
          type='material' 
          name='delete' 
          color='#d00'
          onPress={() => deleteItem(item.id)}/>
      </ListItem>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'SHOPPING LIST', style:styles.headertext }}
      />


      <Input 
        label='PRODUCT'
        placeholder='Product' 
        onChangeText={ (name) => setName(name) }
        value={name}
      />

      <Input 
        label='AMOUNT'
        placeholder='Amount' 
        onChangeText={ (amount) => setAmount(amount) }
        value={amount}
      />

      <Button 
        title='Save'
        onPress={saveItem} 
        containerStyle={styles.button}
        icon={{type:'material', name:'save', color:'#fff'}}
      />
      


      <FlatList
        style={styles.list}
        data={shoppinglist}
        renderItem={ renderItem }
        keyExtractor={ (item) => item.id.toString()}
          
          
        
      />


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
  textHeader: {
    marginTop: 25,
    fontSize: 20,
  },
  list: {
    width:'100%',
  },
  bought: {
    fontSize: 18,
    color: '#0000dd',
    marginLeft: 20,
  },
  listContainer: {
    flexDirection: 'row',
    alignItems:'center'
  },
  headertext: {
    color: '#fff',
    marginTop: 20,
    marginBottom: 5,
    fontSize: 16,
  },
  button: {
    width:'40%',
  },
});

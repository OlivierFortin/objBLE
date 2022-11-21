import { StatusBar } from 'expo-status-bar';
import {SafeAreaView, Button, FlatList, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



let manager = new BleManager();

function HomeScreen({navigation}) {
  const [devices, setDevices] = useState([]);

  const RenderItem = ({item}) => {
    return (
      <TouchableWithoutFeedback onPress={() =>
        navigation.navigate("Device", {
          deviceID: item.id,
        })}>
        <View style={styles.item} >
        <Text style={styles.item}>{item.name}</Text>
        <Text>{item.id}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  return (
    <View style={styles.container}>
        <Button title="Ble Scan" onPress={() => {
          console.log('test');
          manager.startDeviceScan(null,null, (error,device) => {
            if(error)                      {
              console.log("ble error",     error);
              return;
            }
            if(!devices.some(item => item.id == device.id)) {
              setDevices(bleList => [...bleList,device]); 
            }
          });

          }}>Ble Scan</Button>
          <Button onPress={() => { 
            manager.stopDeviceScan();
            console.log(devices.length);

          }} title="Stop Scan">Stop Scan</Button>


         <FlatList data={devices} 
              renderItem={RenderItem}
              extraData={devices}
          />
    </View>);
}

function DeviceScreen({route,navigation}) {
   const {deviceID} = route.params;
  const [device, setDevice] = useState({}); 
  manager.startDeviceScan(null,null,(error,bleDev) => {
    if (bleDev.id == deviceID)
    {
       setDevice(bleDev); 
       manager.stopDeviceScan();
    }
    
  });
  if (device) {
    device.connect()
      .then((ble) => {
        return ble.discoverAllServicesAndCharacteristics()
      });
  }

  return (
    <View style={styles.container}>
        <Text>{device.name}</Text>
    </View>
  );
}

const Stack =  createNativeStackNavigator();
export default function App() {

    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen}/>
          <Stack.Screen name="Device" component={DeviceScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  }
});

import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator} from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const {width:SCREEN_WIDTH} = Dimensions.get('window')
const API_KEY ='995a0d6cc0a15bf624a3c77a163229dd'
const icons = {
  Clouds : "cloudy",
  Clear: "day-sunny",
  Rain: "rains",
  Snow: "snowflake",
  Atmosphere: "cloudy-gusts",
  Drizzle: "rain",
  Thunderstorm: "lightning",
  
}

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays]= useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() =>{
    const {granted} =  await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude,longitude}} = await Location.getCurrentPositionAsync({accuracy:5})
    const location = await Location.reverseGeocodeAsync({latitude, longitude},{useGoogleMaps :false});
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alert&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(()=>{
    getWeather();
  },[])
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
      horizontal 
      pagingEnabled 
      showsHorizontalScrollIndicator="false"
      contentContainerStyle={styles.weather}>
      {days.length === 0 ? (
        <View style={{...styles.day, alignItems:"center"}}>
          <ActivityIndicator color="white" styles={{marginTop: 10}} size="large" />
        </View>
      ) : (
      days.map((day, index)=>(
        <View key={index} style={styles.day}>
          <View style={{
            flexDirection:'row', 
            alignItems:'flex-end',
            width:'100%',
            justifyContent:'space-between'}}>
          <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
          <Fontisto name={icons[day.weather[0].main]} size={60} color="white" />
          </View>
          <Text style={styles.description}>{day.weather[0].main}</Text>
          <Text style={styles.tinyText}>{day.weather[0].description}</Text>
        </View>
      ))
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'tomato',
  },
  city:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
  },
  cityName:{
    fontSize:38,
    fontWeight: "500",
    color:'white',
  },
  weather:{
  },
  day:{
    width: SCREEN_WIDTH,
    alignItems:"center",
    alignItems:'flex-start',
    paddingHorizontal:20,
  },
  temp:{
    marginTop:50,
    fontWeight:"600",
    fontSize:100,
    color:'white',
  },
  description:{
    marginTop:-30,
    marginTop:-10,
    fontSize:30,
    color:'white',
    fontWeight:'500',
  },
  tinyText:{
    fontSize:25,
    marginTop:-5,
    color:'white',
    fontWeight:'500',

  }
})
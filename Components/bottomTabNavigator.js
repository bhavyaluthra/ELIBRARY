import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TransactionScreen from '../Screens/IandRscreen';
import SearchScreen from '../Screens/SearchScreen';
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator()

export default class BottomTabNavigator extends React.Component {
    render(){
        return(
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({route})=>({
                        tabBarIcon:({focused,color,size})=>{
                          let IconName
                          if(route.name==="Transcation"){
                              IconName="book"

                          }
                          else if (route.name==="Search"){
                              IconName="search"
                          }
                           return(
                            <Ionicons 
                            name={IconName}
                            size={size}
                            color={color} />
                           )
                          
                        }
                    })}
                    tabBarOptions={{
                        activeTintColor:"green",
                        inactiveTintColor:"grey",
                        style:{
                            height:130,
                            borderTopWidth:0,
                            backgroundColor:"white"
                        },
                        labelStyle:{
                            fontSize:20,
                            fontFamily:"Rajdhani_600SemiBold"
                        },
                        labelPosition:"beside-icon",
                        tabStyle:{
                            marginTop:25,
                            marginLeft:10,
                            marginRight:10,
                            borderRadius:30,
                            borderWidth:2,
                            alignItems:"center",
                             justifyContent:"center"
                        }
                    }}
                    >

                    <Tab.Screen name="Transcation" component={TransactionScreen} />
                    <Tab.Screen name="Search" component={SearchScreen} />                    
                </Tab.Navigator>
            </NavigationContainer>
        )
    }
}
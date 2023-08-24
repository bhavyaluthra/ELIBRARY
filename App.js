import * as React from 'react';
import BottomTabNavigator from './Components/bottomTabNavigator';
import { Rajdhani_600SemiBold } from '@expo-google-fonts/rajdhani';
import * as Font from "expo-font";

export default class App extends React.Component {

constructor(){
  super()
  this.state={
    fontLoaded:false
  }
}

async LoadFont (){
  await Font.loadAsync({
    Rajdhani_600SemiBold:Rajdhani_600SemiBold
  })
  this.setState({
    fontLoaded:true
  })
}

componentDidMount(){
  this.LoadFont()
}
  render(){
    const{fontLoaded}=this.state
    if( fontLoaded){
    return(
      <BottomTabNavigator
      />
     
    )
    }
    return null;
  }
}
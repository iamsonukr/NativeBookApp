import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'

export default function Signup() {
  return (
    <View>
      <Text style={styles.fontSize}>Signup Screen</Text>
    </View>
  )
}

const styles=StyleSheet.create({
  container:{
    display:'flex',
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  title:{
    color:"blue"
  },
  fontStyle:{
    fontSize:'43px'
  }
})
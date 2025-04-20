import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import {Link} from 'expo-router'
import {Image} from 'expo-image'

export default function index() {
  return (
    <View style={styles.container}> 
      <Text style={styles.title} >index</Text>
      <Link href="/(auth)/signup">Sign Up</Link>
      <Link href="/(auth)/">Login</Link>
      <Link href="/">Jin</Link>
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
  }
})
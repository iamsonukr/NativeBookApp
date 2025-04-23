import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import {Link} from 'expo-router'
import {Image} from 'expo-image'
import { useAuthStore } from '../store/authStore'

export default function index() {
  const {user,token, checkAuth}=useAuthStore()

  useEffect(()=>{
    console.log("Checking auth")
    checkAuth()
  },[])

  return (
    <View style={styles.container}> 
      <Text style={styles.title} >Hello {user?.username}</Text>
      <Text style={styles.title} >Hello {}</Text>
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
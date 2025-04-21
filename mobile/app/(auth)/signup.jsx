import { View, Text, Platform, TextInput,TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native'
import {Link, useRouter} from 'expo-router'
import React, { useState } from 'react'
import styles from '../../assets/styles/signup.styles.js'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors.js'
import { router } from 'expo-router'
import { useAuthStore } from '../../store/authStore.js'


export default function Signup() {
  const {user, sayHello,setUser, register}=useAuthStore()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [Username, setUsername] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const router=useRouter()

  const handleSignUp = async () => {
    console.log("Attempting to register...");
    const result = await register(Username, email, password);
    console.log("Register result:", result);
    
    if (!result.success) {
      console.log("Showing error alert");
      Alert.alert("Error", result.error);
    } else {
      console.log("Showing success alert");
      Alert.alert("Success", "User created successfully");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? "padding" : "height"}
    >
      <View style={styles.container} >
        <View style={styles.card}>
          {/* header */}
          <View style={styles.header}>
            <Text style={styles.title}>BookWorm</Text>
            <Text style={styles.subtitle}>Share your favourite reads</Text>
          </View>
          {/* Signup form */}
          <View style={styles.formContainer}>
            {/* Username input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name='person-outline'
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder='Enter your username'
                    placeholderTextColor={COLORS.placeholderText}
                    value={Username}
                    onChangeText={setUsername}
                    keyboardType='abc'
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name='mail-outline'
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder='Enter your email'
                    placeholderTextColor={COLORS.placeholderText}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    autoCapitalize='none'
                  />
                </View>
              </View>

              {/* password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name='mail-outline'
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder='Enter your password'
                    placeholderTextColor={COLORS.placeholderText}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}

                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* SIGNUP BUTTON */}
            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading} >
              {
                isLoading?(
                  <  ActivityIndicator/>
                ):(
                  <Text style={styles.buttonText} >Sign Up</Text>
                )
              }
            </TouchableOpacity>

            <View>
              <Text>Already have an account?</Text>
              <TouchableOpacity onPress={()=>router.back()}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import {Link} from 'expo-router'
import React, { useState } from 'react'
import styles from "../../assets/styles/login.styles.js"
import { Image } from 'expo-image'
import { Ionicons } from "@expo/vector-icons"
import COLORS from '../../constants/colors.js'
import { useAuthStore } from '../../store/authStore.js'

export default function Login() {
  const {login} =useAuthStore()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async() => {
    try {
      const result=await login(email,password)
      if (!result.success) {
           console.log("Showing error alert");
           Alert.alert("Error", result.error);
         } else {
           console.log("Showing success alert");
           Alert.alert("Success", "User Logged in successfully");
         }
    } catch (error) {
      console.log(error)
      Alert.alert("Error", error.message || "Something went wrong.");
    }

  }
  return (
    <KeyboardAvoidingView
      style={{flex:1}}
      behavior={Platform.OS==='ios'?"padding":"height"}
    >


    <View style={styles.container}>

      {/* Top Image */}
      <View style={styles.topIllustration}>
        <Image
          source={require("../../assets/images/i.png")}
          style={styles.illustrationImage}
        />
      </View>

      {/* Form */}
      <View style={styles.card}>
        <View style={styles.formContainer}>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading} >
          {isLoading ? (
            <ActivityIndicator color="fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account</Text>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Signup</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  )
}

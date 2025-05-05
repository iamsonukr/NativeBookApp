import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeScreen from '../components/SafeScreen'
import {useAuthStore} from '../store/authStore'


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const router=useRouter()
  const segments=useSegments()
  const {token, checkAuth, user} = useAuthStore()

  console.log("segments",segments)

  useEffect(()=>{
    checkAuth()
  },[])

  // handle navigation
  useEffect(()=>{
    const inAuthScreen = segments [0] === "(auth)";
    const inTabScreen = segments [0] === "(tab)";

    const isSignedIn=token && user

    if(!isSignedIn && !inAuthScreen) router.replace("/(auth)");
    else if(isSignedIn && inAuthScreen) router.replace("/(tabs)")

  },[user,token,segments])

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }} >
          <Stack.Screen name="(tabs)" options={{ title: "Home" }} />
          <Stack.Screen name="(auth)" options={{ title: "About" }} />
        </Stack>
      </SafeScreen>
      <StatusBar style='dark' />
    </SafeAreaProvider>

  )
}
 
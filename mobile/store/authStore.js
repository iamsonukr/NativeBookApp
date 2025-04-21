import {create} from "zustand"
import AsyncStorage from '@react-native-async-storage/async-storage'


// The create function is Zustand's core API that takes a callback function and returns a custom hook useAuthUser()
// This callback receives several parameters, with 'set' being the primary way to update state

export const useAuthStore=create((set)=>({
    token:null,
    user:null,
    isLoading:false,
    
    register:async(username,email, password)=>{
        set({isLoading:true})
        try {
            const response=await fetch("http://localhost:3001/api/auth/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    username,
                    email,
                    password
                })
            })

            const data=await response.json()
            if(!response.ok)throw new Error(data.message || "Something went wrong.");
            await AsyncStorage.setItem("user", JSON.stringify(data.user))
            await AsyncStorage.setItem("token", data.token)

            set({token: data.token, user:data.user, isLoading:false});
            return { sucess:true, message:"User created successfully" }
        } catch (error) {
            set({isLoading:false})
            return ({success:false, error:error.message})
            
        }
    }

}))


// NOTE: The 'set' function:
// 1. Merges updates with existing state (shallow merge)
// 2. Triggers re-renders only in components using the updated values
// 3. Can be used with a function for updates based on previous state: set((state) => ({ count: state.count + 1 }))
  
// USAGE EXAMPLE:
// In components: const { user, setUser } = useAuthStore()
// Access specific slice: const userName = useAuthStore((state) => state.user.name)
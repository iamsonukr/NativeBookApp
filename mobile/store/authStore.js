import {create} from "zustand"
import AsyncStorage from '@react-native-async-storage/async-storage'


// The create function is Zustand's core API that takes a callback function and returns a custom hook useAuthUser()
// This callback receives several parameters, with 'set' being the primary way to update state
const LiveUrl="https://nativebookapp.onrender.com/api"
const  LocalUrl="http://localhost:3001/api"

export const useAuthStore=create((set)=>({
    
    token:null,
    user:null,
    isLoading:false,
    
    register:async(username,email, password)=>{
        set({isLoading:true})
        try {
            const response=await fetch(`${LiveUrl}/auth/register`,{
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
            console.log("This is data",data)
            console.log("This is data.data",data.data)
            console.log("This is data.token",data.token)
            if(!response.ok)throw new Error(data.message || "Something went wrong.");
            await AsyncStorage.setItem("user", JSON.stringify(data.data))
            await AsyncStorage.setItem("token", data.token)

            set({token: data.token, user:data.user, isLoading:false});
            return { sucess:true, message:"User created successfully" }
        } catch (error) {
            set({isLoading:false})
            return ({success:false, error:error.message})
            
        }
    },

    checkAuth:async()=>{
        try {
            console.log("Fetching token and user")
            const token=await AsyncStorage.getItem("token");
            const userJson=await AsyncStorage.getItem("user");
            const user=userJson?JSON.parse(userJson):null;
            console.log("Fetching done", token, user)
            set({token,user})
        } catch (error) {
            console.log(error)
        }
    },

    login:async(email,password)=>{
        try {
            console.log("data received for login",email, password)
            const response= await fetch(`${LocalUrl}/auth/login`,
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        email,
                        password
                    })
                }
            )
            const data=await response.json()
            if(!response.ok)throw new Error(data.message || "Something went wrong.");
            await AsyncStorage.setItem("user", JSON.stringify(data.data))
            await AsyncStorage.setItem("token", data.token)

            set({token: data.token, user:data.user, isLoading:false});
            return { sucess:true, message:"User Logged in successfully" }
        } catch (error) {
            console.log(error)
        }
    },

    logout:async ()=>{
        await AsyncStorage.removeItem("token")
        await AsyncStorage.removeItem("user")
        set({token:null, user:null})
    }

}))


// NOTE: The 'set' function:
// 1. Merges updates with existing state (shallow merge)
// 2. Triggers re-renders only in components using the updated values
// 3. Can be used with a function for updates based on previous state: set((state) => ({ count: state.count + 1 }))
  
// USAGE EXAMPLE:
// In components: const { user, setUser } = useAuthStore()
// Access specific slice: const userName = useAuthStore((state) => state.user.name)
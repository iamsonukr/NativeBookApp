import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LiveUrl = "https://nativebookapp.onrender.com/api";
// const LocalUrl = "http://localhost:3001/api";

export const useAuthStore = create((set) => ({
    token: null,
    user: null,
    isLoading: false,
    isCheckingAuth: true,
    
    register: async (username, email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${LiveUrl}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Something went wrong.");
            
            await AsyncStorage.setItem("user", JSON.stringify(data.data));
            await AsyncStorage.setItem("token", data.token);
            
            set({ token: data.token, user: data.data, isLoading: false });
            return { success: true, message: "User created successfully" };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },
    
    checkAuth: async () => {
        try {
            console.log("Fetching token and user");
            
            const token = await AsyncStorage.getItem("token");
            const userJson = await AsyncStorage.getItem("user");
            const user = userJson ? JSON.parse(userJson) : null;
            
            console.log("Fetching done", token, user);
            set({ token, user, isCheckingAuth: false });
        } catch (error) {
            console.log(error);
            set({ isCheckingAuth: false });
        }
    },
    
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            console.log("data received for login", email, password);
            const response = await fetch(`${LiveUrl}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            
            const data = await response.json();
            console.log("This is login data", data);
            
            if (!response.ok) throw new Error(data.message || "Something went wrong.");
            
            await AsyncStorage.setItem("user", JSON.stringify(data.data));
            await AsyncStorage.setItem("token", data.token);
            
            set({ token: data.token, user: data.data, isLoading: false });
            return { success: true, message: "User Logged in successfully" };
        } catch (error) {
            console.log(error);
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },
    
    logout: async () => {
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            set({ token: null, user: null });
            return { success: true };
        } catch (error) {
            console.log(error);
            return { success: false, error: error.message };
        }
    }
}));

// USAGE EXAMPLE:
// In components: const { user, token, login, logout } = useAuthStore();
// Access specific slice: const userName = useAuthStore((state) => state.user?.username);
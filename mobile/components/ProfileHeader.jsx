import { View, Text } from 'react-native'
import React from 'react'
import styles from '../assets/styles/profile.styles'
import { formatMemeberSince } from '../lib/utils'
import { useAuthStore } from '../store/authStore'

export default function ProfileHeader() {
  const {user}=useAuthStore();
  if(!user)return null;
  return (
    <View style={styles.profileHeader}>
        <Image source={{uri:UserActivation.profileImage}} style={styles.profileImage}/>
        <View style={styles.profileInfo} >
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.memberSince} >Joined {formatMemeberSince(user.createdAt)}</Text>
        </View>
      <Text>ProfileHeader</Text>
    </View>
  )
}
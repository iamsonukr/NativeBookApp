import { View, Text } from 'react-native'
import React from 'react'

export default function TabLayouts() {
  return (
    <Tabs>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="create" />
        <Tabs.Screen name="profile" />
    </Tabs>
  )
}
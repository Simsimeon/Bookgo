import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Tabs } from 'expo-router'
import Savescreen from '@/component/Savescreen'
import COLORS from '@/constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Tablayout = () => {
  const inserts = useSafeAreaInsets()
  return (

    <Savescreen>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.gray,
          headerTitleStyle: {
            color: COLORS.textPrimary,
            fontWeight: "600",
          },
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: COLORS.cardBackground,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            paddingTop: 5,
            height: 60 + inserts.bottom,
            paddingBottom: inserts.bottom,
          }
        }}
      >
        <Tabs.Screen name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => {
              return <Ionicons name="home-outline" size={size} color={color} />
            }
          }}
        />
        <Tabs.Screen name="create"
          options={{
            title: "Create",
            tabBarIcon: ({ color, size }) => {
              return <Ionicons name="add-circle-outline" size={size} color={color} />
            }
          }}

        />
        <Tabs.Screen name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => {
              return <Ionicons name="person-outline" size={size} color={color} />
            }
          }}
        />
      </Tabs>
    </Savescreen>
  )
}

export default Tablayout
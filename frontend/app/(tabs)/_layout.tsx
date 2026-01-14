import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { COLORS } from '../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.grey,
            tabBarStyle: {
                backgroundColor: "black",
                borderTopWidth: 0,
                position: "absolute",
                elevation: 0,
                height: 40,
                paddingBottom: 8,
            },
        }}
    >
        <Tabs.Screen name="index"
            options={{tabBarIcon: ({size,color})=> <Ionicons name="home" size={size} color="green" /> 
            ,}}
        />
        <Tabs.Screen name="companies" 
            options={{tabBarIcon: ({size,color})=> <FontAwesome5 name="building" size={size} color="brown" /> 
            ,}}
        />
        <Tabs.Screen name="internships" 
            options={{tabBarIcon: ({size,color})=> <Ionicons name="school" size={26} color="green" /> 
            ,}}
        />
        <Tabs.Screen name="faqs"
            options={{tabBarIcon: ({size,color})=> <FontAwesome5 name="question" size={24} color="brown" /> 
            ,}}
        />
        <Tabs.Screen name="profile" 
            options={{tabBarIcon: ({size,color})=> <Ionicons name="person-circle-outline" size={30} color="red" />
            ,}}
        />

    </Tabs>
  )
}
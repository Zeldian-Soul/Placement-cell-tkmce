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
            tabBarShowLabel: true,
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.grey,
            tabBarStyle: {
                backgroundColor: "black",
                borderTopWidth: 0,
                position: "absolute",
                elevation: 0,
                height: 60,
                paddingBottom: 8,
            },
        }}
    >
        <Tabs.Screen name="index"
            options={{
                title: "Home",
                tabBarIcon: ({size,color})=> <Ionicons name="home" size={size} color={color} /> 
            }}
        />
        <Tabs.Screen name="internships" 
            options={{
                title: "Internships",
                tabBarIcon: ({size,color})=> <Ionicons name="briefcase" size={size} color={color} /> 
            }}
        />
        <Tabs.Screen name="experiences" 
            options={{
                title: "Experiences",
                tabBarIcon: ({size,color})=> <Ionicons name="chatbubbles" size={size} color={color} /> 
            }}
        />
        <Tabs.Screen name="faqs"
            options={{
                title: "Help",
                tabBarIcon: ({size,color})=> <FontAwesome5 name="question-circle" size={size} color={color} /> 
            }}
        />
        <Tabs.Screen name="profile" 
            options={{
                title: "Profile",
                tabBarIcon: ({size,color})=> <Ionicons name="person-circle-outline" size={size} color={color} />
            }}
        />

    </Tabs>
  )
}
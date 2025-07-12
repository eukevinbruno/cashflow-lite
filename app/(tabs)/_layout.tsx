// mobile/app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          ...styles.tabBar,
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          ...(Platform.OS === 'ios' ? styles.iosTabBar : styles.androidWebTabBar),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIconStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          // Certifique-se de que não há nenhuma margem negativa ou posicionamento absoluto aqui
          // que possa estar "empurrando" o ícone para fora da visualização
          // Remove any previous explicit marginTop/marginBottom if they were set here
          marginTop: 0,
          marginBottom: 0,
        }
      }}>
      {/* 1. Início */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
      {/* 2. Investimentos */}
      <Tabs.Screen
        name="investments"
        options={{
          title: 'Invest.',
          tabBarIcon: ({ color }) => <Ionicons name="trending-up-outline" size={24} color={color} />,
        }}
      />
      {/* 3. Adicionar Transação (Botão Central) */}
      <Tabs.Screen
        name="add"
        options={{
          title: 'Adicionar',
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.addTabButton,
                focused && { backgroundColor: Colors[colorScheme ?? 'light'].tint },
              ]}
            >
              <Ionicons name="add" size={30} color={focused ? '#fff' : Colors[colorScheme ?? 'light'].tabIconDefault} />
            </View>
          ),
          tabBarLabel: () => null, // Ocultar o label para este botão
        }}
      />
      {/* 4. Extrato */}
      <Tabs.Screen
        name="extract"
        options={{
          title: 'Extrato',
          tabBarIcon: ({ color }) => <Ionicons name="receipt-outline" size={24} color={color} />,
        }}
      />
      {/* 5. Conta */}
      <Tabs.Screen
        name="profile" // O nome do arquivo da tela é 'profile.tsx'
        options={{
          title: 'Conta', // <--- Garante que o rótulo seja 'Conta'
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />, // <--- Garante que o ícone seja 'person-outline'
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 90 : 60, // Altura base da barra
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'visible', // Permite que o botão central não seja cortado
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  iosTabBar: {
    backgroundColor: 'transparent',
  },
  androidWebTabBar: {
    backgroundColor: Colors.light.background,
  },
  addTabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
    marginTop: Platform.OS === 'ios' ? -30 : -20, // Ajuste para levantar o botão
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 4,
    borderColor: Colors.light.background,
  },
});
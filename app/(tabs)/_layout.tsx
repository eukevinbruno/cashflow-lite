// mobile/app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Importar useSafeAreaInsets

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets(); // Hook para obter as safe areas

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
          // Ajustar a altura total da tabBar para incluir a safe area e um padding visual
          height: Platform.OS === 'ios' ? 60 + insets.bottom + 15 : 60, // 60 (base) + safeArea + padding visual
          paddingBottom: Platform.OS === 'ios' ? insets.bottom + 15 : 0, // Padding extra para safe area
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIconStyle: {
          justifyContent: 'center',
          alignItems: 'center',
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
          title: 'Conta', // O rótulo da aba será 'Conta'
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />, // Ícone de pessoa
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    // A altura é ajustada dinamicamente no `screenOptions` usando `useSafeAreaInsets`
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
    // paddingBottom será definido via `screenOptions`
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
    // Ajuste de margem para o botão central ficar visivelmente "separado" da navbar
    marginBottom: Platform.OS === 'ios' ? 10 : 0, // Ajustar para mais espaço entre o botão e a base da tela no iOS
    marginTop: Platform.OS === 'ios' ? -35 : -25, // Levanta o botão. Ajuste este valor para centralizar verticalmente.
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 4,
    borderColor: Colors.light.background,
  },
});
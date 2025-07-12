// components/HapticTab.tsx (COM ALTERAÇÕES)
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native'; // Importar Platform

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      // Ajustes para remover sombra/feedback visual ao clicar
      android_ripple={Platform.OS === 'android' ? { borderless: true, foreground: false, color: 'transparent' } : undefined}
      // Para iOS, activeOpacity controla a opacidade do próprio botão ao ser pressionado
      activeOpacity={Platform.OS === 'ios' ? 1 : props.activeOpacity} // Use 1 para não ter alteração de opacidade no iOS
      style={[props.style, { backgroundColor: 'transparent' }]} // Garante que o fundo do botão seja transparente
      onPressIn={(ev) => {
        if (Platform.OS === 'ios') { // Usar Platform diretamente
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
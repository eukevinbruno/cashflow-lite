// mobile/app/(tabs)/investments.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

const InvestmentsScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>Meus Investimentos</ThemedText>
        <ThemedView style={styles.contentCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>Em breve!</ThemedText>
          <ThemedText style={styles.descriptionText}>
            Esta será a sua central de investimentos.
            Aqui você poderá acompanhar seus rendimentos e gerenciar suas aplicações.
            Fique ligado para as próximas atualizações!
          </ThemedText>
          {/* Adicionar componentes de investimento aqui futuramente */}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center', // Centralizar conteúdo verticalmente
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  contentCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    width: '100%', // Ocupar a largura total disponível
    alignItems: 'center',
  },
  cardTitle: {
    marginBottom: 10,
    color: Colors.light.text,
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default InvestmentsScreen;
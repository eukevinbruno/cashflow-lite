// mobile/app/(tabs)/home.tsx (APENAS A SEÇÃO balanceCard E STYLES RELACIONADOS)
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const HomeScreen = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setBalance(5432.75);
      setTransactions([
        { id: '1', description: 'Venda de consultoria', value: 2500.00, type: 'entrada', date: '2025-07-10' },
        { id: '2', description: 'Aluguel do escritório', value: -1200.00, type: 'saida', date: '2025-07-08' },
        { id: '3', description: 'Freelance Design', value: 1800.00, type: 'entrada', date: '2025-07-05' },
        { id: '4', description: 'Material de escritório', value: -150.00, type: 'saida', date: '2025-07-03' },
      ]);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <ThemedText>Carregando dados...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ThemedText type="title" style={styles.header}>Olá, Autônomo!</ThemedText>

      <ThemedView style={styles.balanceCard}>
        <View style={styles.balanceCardTopRow}>
          <ThemedText style={styles.balanceLabel}>Saldo Atual</ThemedText>
          <TouchableOpacity onPress={() => console.log('Navegar para extrato')} style={styles.extractButtonTop}>
            <ThemedText style={styles.extractButtonTextTop}>Ir ao extrato</ThemedText>
            <Ionicons name="chevron-forward-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.balanceValueWithToggle}>
          <View style={styles.balanceValueWrapper}>
            <ThemedText style={styles.currencySymbol}>R$</ThemedText>
            <ThemedText style={styles.balanceValue}>
              {balance ? balance.toFixed(2).replace('.', ',') : '0,00'}
            </ThemedText>
            {!showBalance && (
              <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFillObject} />
            )}
          </View>
          <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.eyeIconContainer}>
            <Ionicons
              name={showBalance ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.yieldText}>
          <Ionicons name="trending-up-outline" size={16} color="#fff" /> Rende 105% do CDI
        </ThemedText>
      </ThemedView>

      <ThemedText type="subtitle" style={styles.sectionHeader}>Últimas Transações:</ThemedText>
      {transactions.length > 0 ? (
        transactions.map((item) => (
          <ThemedView key={item.id} style={styles.transactionItem}>
            <ThemedText style={styles.transactionDescription}>{item.description}</ThemedText>
            <ThemedText style={[
              styles.transactionValue,
              item.type === 'entrada' ? styles.transactionValueIn : styles.transactionValueOut
            ]}>
              {item.type === 'entrada' ? '+' : ''} R$ {item.value.toFixed(2).replace('.', ',')}
            </ThemedText>
            <ThemedText style={styles.transactionDate}>{item.date}</ThemedText>
          </ThemedView>
        ))
      ) : (
        <ThemedText style={styles.noTransactionsText}>Nenhuma transação registrada ainda.</ThemedText>
      )}
    </ScrollView>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  balanceCard: {
    backgroundColor: Colors.light.tint,
    borderRadius: 15,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  balanceCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'normal',
  },
  extractButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  extractButtonTextTop: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    marginRight: 5,
  },
  balanceValueWithToggle: { // Novo container para o valor e o toggle
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    paddingVertical: 2, // Espaçamento interno para evitar corte
  },
  balanceValueWrapper: { // Wrapper para o valor do saldo para aplicar o blur
    flexDirection: 'row',
    alignItems: 'flex-end', // Alinha R$ e o valor na base
    position: 'relative',
    overflow: 'hidden', // Importante para o blur não vazar
    borderRadius: 5, // Pequeno arredondamento para o blur
  },
  currencySymbol: {
    fontSize: 24, // Tamanho menor para o "R$"
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 5, // Espaço entre R$ e o valor
    marginBottom: 2, // Alinhar R$ com a base do número
  },
  balanceValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 45, // Ajustar line height para evitar corte vertical
  },
  eyeIconContainer: {
    padding: 5,
    // Remover marginLeft se estiver desalinhando.
    // O justifyContent no balanceValueWithToggle já cuida do espaçamento.
  },
  yieldText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  sectionHeader: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  transactionItem: {
    backgroundColor: Colors.light.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionDescription: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.light.text,
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  transactionValueIn: {
    color: '#28a745',
  },
  transactionValueOut: {
    color: '#dc3545',
  },
  transactionDate: {
    fontSize: 14,
    color: Colors.light.icon,
    marginTop: 5,
  },
  noTransactionsText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.light.icon,
    marginTop: 20,
  },
});

export default HomeScreen;
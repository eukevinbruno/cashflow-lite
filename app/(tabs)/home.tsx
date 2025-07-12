// mobile/app/(tabs)/home.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState<number | null>(null);
  const [monthlyExpense, setMonthlyExpense] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]); // Limitar a 4 no fetch ou na renderização
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true); // Estado para ocultar/mostrar saldo

  const fetchDashboardData = async () => {
    try {
      // Dados mockados para simular um dashboard mais completo
      setBalance(5432.75);
      setMonthlyIncome(4800.00); // Ex: total de entradas do mês
      setMonthlyExpense(1500.00); // Ex: total de saídas do mês
      const fetchedTransactions = [
        { id: '1', description: 'Consultoria Web - Projeto X', value: 2500.00, type: 'entrada', date: '2025-07-10' },
        { id: '2', description: 'Aluguel Co-working Espaço Z', value: -1200.00, type: 'saida', date: '2025-07-08' },
        { id: '3', description: 'Projeto App Mobile - Cliente Y', value: 1800.00, type: 'entrada', date: '2025-07-05' },
        { id: '4', description: 'Material Escritório - Papelaria', value: -150.00, type: 'saida', date: '2025-07-03' },
        { id: '5', description: 'Marketing Digital - Campanha', value: -300.00, type: 'saida', date: '2025-07-01' },
        { id: '6', description: 'Venda de e-Book', value: 100.00, type: 'entrada', date: '2025-06-28' },
      ];
      setTransactions(fetchedTransactions.slice(0, 4)); // Limita às últimas 4 transações
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

      {/* Novo Card de Saldo Central - Estilo Dinâmico */}
      <ThemedView style={styles.newBalanceCard}>
        <View style={styles.balanceCardTopRow}>
          <ThemedText style={styles.newBalanceLabel}>Seu Saldo Atual</ThemedText>
          <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.newEyeIconContainer}>
            <Ionicons
              name={showBalance ? 'eye-outline' : 'eye-off-outline'}
              size={26}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.newBalanceValueWrapper}>
          <ThemedText style={styles.newCurrencySymbol}>R$</ThemedText>
          {showBalance ? (
            <ThemedText type="title" style={styles.newBalanceValue}>
              {balance ? balance.toFixed(2).replace('.', ',') : '0,00'}
            </ThemedText>
          ) : (
            <ThemedText style={styles.newHiddenBalancePlaceholder}>{'*****.**'}</ThemedText>
          )}
        </View>

        <TouchableOpacity onPress={() => console.log('Navegar para extrato')} style={styles.newExtractButton}>
          <ThemedText style={styles.newExtractButtonText}>Ver Extrato Detalhado</ThemedText>
          <Ionicons name="chevron-forward-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </ThemedView>

      {/* Visão Geral do Mês - Nova Apresentação */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>Sua Visão Geral do Mês</ThemedText>
      <ThemedView style={styles.monthlySummaryCard}>
        <View style={styles.monthlySummaryRow}>
          <View style={styles.monthlySummaryItem}>
            <Ionicons name="arrow-up-circle-outline" size={30} color="#28a745" />
            <ThemedText style={styles.monthlySummaryLabel}>Entradas</ThemedText>
            <ThemedText style={[styles.monthlySummaryValue, styles.overviewValueIn]}>
              R$ {monthlyIncome ? monthlyIncome.toFixed(2).replace('.', ',') : '0,00'}
            </ThemedText>
          </View>
          <View style={styles.monthlySummaryItem}>
            <Ionicons name="arrow-down-circle-outline" size={30} color="#dc3545" />
            <ThemedText style={styles.monthlySummaryLabel}>Saídas</ThemedText>
            <ThemedText style={[styles.monthlySummaryValue, styles.overviewValueOut]}>
              R$ {monthlyExpense ? monthlyExpense.toFixed(2).replace('.', ',') : '0,00'}
            </ThemedText>
          </View>
        </View>
        <View style={styles.monthlySummaryNetBalance}>
          <ThemedText style={styles.monthlySummaryNetLabel}>Saldo Líquido do Mês:</ThemedText>
          <ThemedText style={[styles.monthlySummaryNetValue, (monthlyIncome || 0) - (monthlyExpense || 0) >= 0 ? styles.overviewValueIn : styles.overviewValueOut]}>
            R$ {((monthlyIncome || 0) - (monthlyExpense || 0)).toFixed(2).replace('.', ',')}
          </ThemedText>
        </View>
      </ThemedView>

      {/* Ações Rápidas - 4 na mesma linha (grade compacta) */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>Ações Rápidas</ThemedText>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => console.log('Navegar para Adicionar Transação')}>
          <Ionicons name="add-circle-outline" size={36} color={Colors.light.tint} />
          <ThemedText style={styles.quickActionButtonText}>Adicionar</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => console.log('Navegar para Relatórios')}>
          <Ionicons name="stats-chart-outline" size={36} color={Colors.light.tint} />
          <ThemedText style={styles.quickActionButtonText}>Relatórios</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => console.log('Navegar para Gerenciar Investimentos')}>
          <Ionicons name="trending-up-outline" size={36} color={Colors.light.tint} />
          <ThemedText style={styles.quickActionButtonText}>Investir</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => console.log('Navegar para Configurações')}>
          <Ionicons name="settings-outline" size={36} color={Colors.light.tint} />
          <ThemedText style={styles.quickActionButtonText}>Ajustes</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Últimas 4 Transações */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>Últimas Transações</ThemedText>
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
        <ThemedText style={styles.noTransactionsText}>Nenhuma transação recente.</ThemedText>
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
    marginBottom: 25,
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: 15,
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 25, // Mais espaço antes de cada nova seção principal
  },

  // --- Novo Card de Saldo Central ---
  newBalanceCard: {
    backgroundColor: Colors.light.tint, // Cor principal do tema
    borderRadius: 20, // Cantos mais arredondados
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 }, // Sombra mais pronunciada para "flutuar"
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  balanceCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  newBalanceLabel: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'normal',
    opacity: 0.9,
  },
  newEyeIconContainer: {
    padding: 5,
  },
  newBalanceValueWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20, // Mais espaço abaixo do valor principal
  },
  newCurrencySymbol: {
    fontSize: 32, // Símbolo R$ maior
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
    lineHeight: 48, // Ajustar para alinhar com o valor grande
  },
  newBalanceValue: {
    fontSize: 56, // Valor muito maior para destaque
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 60, // Ajustar line height para não cortar
  },
  newHiddenBalancePlaceholder: {
    fontSize: 56,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 60,
  },
  newYieldText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20, // Espaço antes do botão
    alignSelf: 'flex-start',
  },
  newExtractButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centralizar texto e ícone no botão
    backgroundColor: 'rgba(255,255,255,0.25)', // Fundo semitransparente mais forte
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // Mais arredondado
    alignSelf: 'center', // Centralizar o botão no card
    minWidth: '70%', // Largura mínima
  },
  newExtractButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },

  // --- Visão Geral do Mês - Nova Apresentação ---
  monthlySummaryCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  monthlySummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  monthlySummaryItem: {
    alignItems: 'center',
    flex: 1, // Ocupa espaço igual
    paddingHorizontal: 5,
  },
  monthlySummaryLabel: {
    fontSize: 14,
    color: Colors.light.icon,
    marginTop: 8,
    marginBottom: 5,
  },
  monthlySummaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  monthlySummaryNetBalance: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault,
    paddingTop: 15,
    marginTop: 10,
    alignItems: 'center', // Centraliza o saldo líquido
  },
  monthlySummaryNetLabel: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 5,
  },
  monthlySummaryNetValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  overviewValueIn: {
    color: '#28a745',
  },
  overviewValueOut: {
    color: '#dc3545',
  },

  // --- Ações Rápidas - Grade Compacta ---
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Distribui os itens uniformemente
    marginBottom: 30,
  },
  quickActionButton: {
    width: (screenWidth / 2) - 35, // Calcula a largura para 2 colunas com padding
    aspectRatio: 1.1, // Mantém proporção próxima de quadrado
    backgroundColor: Colors.light.background,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15, // Espaçamento entre as linhas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    padding: 10, // Padding interno para não espremer conteúdo
  },
  quickActionButtonText: {
    fontSize: 13, // Menor para caber em 2 colunas
    fontWeight: '500',
    color: Colors.light.text,
    marginTop: 8,
    textAlign: 'center',
  },

  // --- Últimas Transações (reusado e adaptado) ---
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
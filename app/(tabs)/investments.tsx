// mobile/app/(tabs)/investments.tsx
import { Ionicons } from '@expo/vector-icons'; // Para ícones
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit'; // Para placeholders de gráficos

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const screenWidth = Dimensions.get('window').width;

// Dados mockados para simular um portfólio
const MOCKED_PORTFOLIO_SUMMARY = {
  totalInvested: 15000.00,
  currentValue: 15850.75,
  dailyChange: 0.85, // %
  totalProfitLoss: 850.75,
};

const MOCKED_ASSETS = [
  { name: 'Fundo A (CDB)', value: 7000.00, profit: 150.00, color: '#4CAF50', legendFontColor: Colors.light.text, legendFontSize: 12 },
  { name: 'Ações B (BOVA11)', value: 5000.00, profit: -50.00, color: '#F44336', legendFontColor: Colors.light.text, legendFontSize: 12 },
  { name: 'Cripto C (BTC)', value: 3850.75, profit: 750.75, color: '#2196F3', legendFontColor: Colors.light.text, legendFontSize: 12 },
];

const MOCKED_LINE_CHART_DATA = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      data: [
        Math.random() * 1000 + 5000,
        Math.random() * 1000 + 5500,
        Math.random() * 1000 + 6000,
        Math.random() * 1000 + 6500,
        Math.random() * 1000 + 7000,
        Math.random() * 1000 + 7500,
      ],
      color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`, // Cor da linha
      strokeWidth: 2,
    },
  ],
};


// --- Componente auxiliar para seções colapsáveis (reutilizado do profile.tsx) ---
// Pode ser movido para components/SettingSection.tsx se for usado em muitas telas
interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  iconName?: keyof typeof Ionicons.glyphMap; // Nome do ícone Ionicons (opcional)
  defaultOpen?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children, iconName, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <ThemedView style={sectionCardStyles.card}>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={sectionCardStyles.cardHeader}>
        {iconName && <Ionicons name={iconName} size={24} color={Colors.light.tint} style={sectionCardStyles.cardIcon} />}
        <ThemedText type="subtitle" style={sectionCardStyles.cardTitle}>{title}</ThemedText>
        <Ionicons
          name={isOpen ? 'chevron-down-outline' : 'chevron-forward-outline'}
          size={20}
          color={Colors.light.icon}
        />
      </TouchableOpacity>
      {isOpen && <ThemedView style={sectionCardStyles.cardContent}>{children}</ThemedView>}
    </ThemedView>
  );
};

const sectionCardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  cardIcon: {
    marginRight: 10,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault,
  },
});
// --- Fim do componente auxiliar ---


const InvestmentsScreen = () => {
  const colorScheme = useColorScheme();

  const chartConfig = {
    backgroundGradientFrom: Colors[colorScheme ?? 'light'].background,
    backgroundGradientTo: Colors[colorScheme ?? 'light'].background,
    decimalPlaces: 2,
    color: (opacity = 1) => Colors[colorScheme ?? 'light'].text,
    labelColor: (opacity = 1) => Colors[colorScheme ?? 'light'].text,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForLabels: {
      fontSize: 10,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Colors.light.tint,
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>Meus Investimentos</ThemedText>

        {/* Card de Resumo do Portfólio */}
        <ThemedView style={styles.portfolioSummaryCard}>
          <ThemedText style={styles.summaryLabel}>Valor Total Investido</ThemedText>
          <ThemedText style={styles.summaryValue}>R$ {MOCKED_PORTFOLIO_SUMMARY.totalInvested.toFixed(2).replace('.', ',')}</ThemedText>
          
          <ThemedText style={styles.summaryLabel}>Valor Atual do Portfólio</ThemedText>
          <ThemedText style={styles.summaryValueBig}>R$ {MOCKED_PORTFOLIO_SUMMARY.currentValue.toFixed(2).replace('.', ',')}</ThemedText>
          
          <View style={styles.dailyChangeRow}>
            <Ionicons name="trending-up-outline" size={20} color={MOCKED_PORTFOLIO_SUMMARY.dailyChange >= 0 ? '#28a745' : '#dc3545'} />
            <ThemedText style={[
              styles.dailyChangeText,
              MOCKED_PORTFOLIO_SUMMARY.dailyChange >= 0 ? styles.positiveChange : styles.negativeChange
            ]}>
              {MOCKED_PORTFOLIO_SUMMARY.dailyChange.toFixed(2).replace('.', ',')}% (Hoje)
            </ThemedText>
          </View>
        </ThemedView>

        {/* Meus Ativos (Gráfico de Pizza e Lista) */}
        <SectionCard title="Meus Ativos" iconName="wallet-outline" defaultOpen={true}>
          <ThemedText style={styles.sectionDescription}>Distribuição do seu portfólio atual.</ThemedText>
          <PieChart
            data={MOCKED_ASSETS}
            width={screenWidth - 80}
            height={220}
            chartConfig={chartConfig}
            accessor={"value"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 0]}
            absolute
            style={styles.chart}
          />
          {MOCKED_ASSETS.map((asset, index) => (
            <View key={index} style={styles.assetItem}>
              <View style={[styles.assetColorDot, { backgroundColor: asset.color }]} />
              <ThemedText style={styles.assetName}>{asset.name}</ThemedText>
              <ThemedText style={styles.assetValue}>R$ {asset.value.toFixed(2).replace('.', ',')}</ThemedText>
              <ThemedText style={[
                styles.assetProfit,
                asset.profit >= 0 ? styles.positiveChange : styles.negativeChange
              ]}>
                {asset.profit >= 0 ? '+' : ''}R$ {asset.profit.toFixed(2).replace('.', ',')}
              </ThemedText>
            </View>
          ))}
        </SectionCard>

        {/* Histórico de Performance */}
        <SectionCard title="Histórico de Performance" iconName="bar-chart-outline">
          <ThemedText style={styles.sectionDescription}>Veja a evolução do seu portfólio ao longo do tempo.</ThemedText>
          <LineChart
            data={MOCKED_LINE_CHART_DATA}
            width={screenWidth - 80}
            height={220}
            chartConfig={{
              ...chartConfig,
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              backgroundGradientFrom: Colors[colorScheme ?? 'light'].background,
              backgroundGradientTo: Colors[colorScheme ?? 'light'].background,
              color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`, // Cor da linha do gráfico
              labelColor: (opacity = 1) => Colors[colorScheme ?? 'light'].text,
            }}
            bezier // Para uma linha suavizada
            style={styles.chart}
          />
          <ThemedText style={styles.chartCaption}>Exemplo de evolução mensal do portfólio</ThemedText>
        </SectionCard>

        {/* Explorar Opções de Investimento */}
        <SectionCard title="Explorar Opções de Investimento" iconName="search-outline">
          <ThemedText style={styles.sectionDescription}>Encontre novas oportunidades de investimento.</ThemedText>
          <TouchableOpacity style={styles.exploreButton}>
            <Ionicons name="bulb-outline" size={20} color="#fff" />
            <ThemedText style={styles.exploreButtonText}>Ver Recomendações</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exploreButton}>
            <Ionicons name="swap-horizontal-outline" size={20} color="#fff" />
            <ThemedText style={styles.exploreButtonText}>Investir em Renda Fixa</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exploreButton}>
            <Ionicons name="stats-chart-outline" size={20} color="#fff" />
            <ThemedText style={styles.exploreButtonText}>Comprar Ações</ThemedText>
          </TouchableOpacity>
        </SectionCard>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
    color: Colors.light.text,
  },
  portfolioSummaryCard: {
    backgroundColor: Colors.light.tint, // Cor de destaque para o resumo
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  summaryValueBig: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  dailyChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  dailyChangeText: {
    fontSize: 16,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  positiveChange: {
    color: '#28a745', // Verde
  },
  negativeChange: {
    color: '#dc3545', // Vermelho
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 15,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
    // Note: o background do chart já vem do chartConfig
  },
  chartCaption: {
    fontSize: 12,
    color: Colors.light.icon,
    textAlign: 'center',
    marginTop: -5,
    marginBottom: 10,
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.tabIconDefault,
    justifyContent: 'space-between', // Alinhar itens
  },
  assetColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  assetName: {
    flex: 1, // Ocupa o espaço restante
    fontSize: 16,
    color: Colors.light.text,
  },
  assetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginRight: 10,
  },
  assetProfit: {
    fontSize: 14,
    fontWeight: '500',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default InvestmentsScreen;
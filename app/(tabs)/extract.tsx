// mobile/app/(tabs)/extract.tsx
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit'; // Importar BarChart e PieChart

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons'; // Para ícones

const screenWidth = Dimensions.get('window').width;

// Dados mockados para demonstração
const MOCKED_TRANSACTIONS = [
  { id: '1', description: 'Venda de consultoria', value: 3000, type: 'entrada', category: 'Receitas', subcategory: 'Serviços', date: '2025-07-01' },
  { id: '2', description: 'Aluguel Escritório', value: -1500, type: 'saida', category: 'Moradia', subcategory: 'Aluguel', date: '2025-07-05' },
  { id: '3', description: 'Mercado Mensal', value: -400, type: 'saida', category: 'Alimentação', subcategory: 'Mercado', date: '2025-07-10' },
  { id: '4', description: 'Jantar com cliente', value: -180, type: 'saida', category: 'Alimentação', subcategory: 'Restaurantes', date: '2025-07-12' },
  { id: '5', description: 'Gasolina', value: -120, type: 'saida', category: 'Transporte', subcategory: 'Combustível', date: '2025-07-15' },
  { id: '6', description: 'Software SaaS', value: -80, type: 'saida', category: 'Material de Trabalho', subcategory: 'Softwares', date: '2025-07-20' },
  { id: '7', description: 'DAS MEI', value: -70.60, type: 'saida', category: 'Impostos', subcategory: 'DAS', date: '2025-07-20' },
  { id: '8', description: 'Projeto Web', value: 2000, type: 'entrada', category: 'Receitas', subcategory: 'Serviços', date: '2025-07-25' },
  { id: '9', description: 'Cinema', value: -60, type: 'saida', category: 'Lazer', subcategory: 'Cinema', date: '2025-07-28' },
  { id: '10', description: 'Material de Limpeza', value: -50, type: 'saida', category: 'Moradia', subcategory: 'Manutenção', date: '2025-07-30' },
  { id: '11', description: 'Receita Ago', value: 1000, type: 'entrada', category: 'Receitas', subcategory: 'Serviços', date: '2025-08-01' },
  { id: '12', description: 'Aluguel Ago', value: -1000, type: 'saida', category: 'Moradia', subcategory: 'Aluguel', date: '2025-08-05' },
];

// --- Componente auxiliar para seções colapsáveis (reutilizado do profile.tsx) ---
// Idealmente, este seria um componente em `components/SectionCard.tsx` para reutilização
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


const ExtractScreen = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const colorScheme = useColorScheme();

  const months = [
    { label: 'Janeiro', value: 1 }, { label: 'Fevereiro', value: 2 }, { label: 'Março', value: 3 },
    { label: 'Abril', value: 4 }, { label: 'Maio', value: 5 }, { label: 'Junho', value: 6 },
    { label: 'Julho', value: 7 }, { label: 'Agosto', value: 8 }, { label: 'Setembro', value: 9 },
    { label: 'Outubro', value: 10 }, { label: 'Novembro', value: 11 }, { label: 'Dezembro', value: 12 },
  ];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  useEffect(() => {
    const filtered = MOCKED_TRANSACTIONS.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() + 1 === selectedMonth && tDate.getFullYear() === selectedYear;
    });
    setTransactions(filtered);
    setSelectedCategory(null);
    setLoading(false);
  }, [selectedMonth, selectedYear]);

  // Cálculos para o Resumo Financeiro
  const totalIncome = transactions.filter(t => t.type === 'entrada').reduce((sum, t) => sum + t.value, 0);
  const totalExpense = transactions.filter(t => t.type === 'saida').reduce((sum, t) => sum + Math.abs(t.value), 0);
  const balance = totalIncome - totalExpense;

  // Função para processar os dados para o gráfico de pizza (gastos por categoria principal)
  const getCategoryData = () => {
    const expenses = transactions.filter(t => t.type === 'saida');
    const categoryTotals: { [key: string]: number } = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Math.abs(curr.value);
      return acc;
    }, {});

    const chartColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#CD5C5C', '#6A5ACD', '#20B2AA',
      '#FF6384B0', '#36A2EBB0', '#FFCE56B0', '#4BC0C0B0', '#9966FFB0', '#FF9F40B0'
    ];
    let colorIndex = 0;

    return Object.keys(categoryTotals).map(categoryName => {
      const color = chartColors[colorIndex % chartColors.length];
      colorIndex++;
      return {
        name: categoryName,
        population: categoryTotals[categoryName],
        color: color,
        legendFontColor: Colors[colorScheme ?? 'light'].text,
        legendFontSize: 12,
      };
    });
  };

  // Função para processar os dados para o gráfico de barras (subcategorias de uma categoria selecionada)
  const getSubcategoryData = () => {
    if (!selectedCategory) return { labels: [], datasets: [{ data: [] }] };

    const filteredExpenses = transactions.filter(t =>
      t.type === 'saida' && t.category === selectedCategory
    );

    const subcategoryTotals: { [key: string]: number } = filteredExpenses.reduce((acc, curr) => {
      const subcat = curr.subcategory || 'Outros Não Categorizados';
      acc[subcat] = (acc[subcat] || 0) + Math.abs(curr.value);
      return acc;
    }, {});

    const labels = Object.keys(subcategoryTotals);
    const data = Object.values(subcategoryTotals);

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          colors: data.map((_, i) => `rgba(${parseInt(Colors.light.tint.slice(1,3), 16)}, ${parseInt(Colors.light.tint.slice(3,5), 16)}, ${parseInt(Colors.light.tint.slice(5,7), 16)}, ${1 - (i * 0.1)})`),
        },
      ],
    };
  };

  // Dados para o Gráfico de Fluxo de Caixa (Entradas vs Saídas)
  const getFlowChartData = () => {
    return {
      labels: ["Entradas", "Saídas"],
      datasets: [
        {
          data: [totalIncome, totalExpense],
          colors: [(opacity = 1) => `rgba(40, 167, 69, ${opacity})`, (opacity = 1) => `rgba(220, 53, 69, ${opacity})`], // Verde para entradas, Vermelho para saídas
          barPercentage: 0.8,
        }
      ]
    };
  };

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

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <ThemedText>Carregando extrato...</ThemedText>
      </ThemedView>
    );
  }

  const categoryData = getCategoryData();
  const subcategoryData = getSubcategoryData();
  const flowChartData = getFlowChartData();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>Meu Extrato</ThemedText>

        {/* Card de Resumo do Período */}
        <ThemedView style={styles.summaryPeriodCard}>
          <ThemedText type="subtitle" style={styles.summaryCardTitle}>Resumo do Período</ThemedText>
          <ThemedView style={styles.pickerRow}>
            <ThemedView style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                style={styles.picker}
                itemStyle={Platform.OS === 'ios' ? { color: Colors[colorScheme ?? 'light'].text } : {}}
              >
                {months.map(m => <Picker.Item key={m.value} label={m.label} value={m.value} />)}
              </Picker>
            </ThemedView>
            <ThemedView style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => setSelectedYear(itemValue)}
                style={styles.picker}
                itemStyle={Platform.OS === 'ios' ? { color: Colors[colorScheme ?? 'light'].text } : {}}
              >
                {years.map(y => <Picker.Item key={y} label={String(y)} value={y} />)}
              </Picker>
            </ThemedView>
          </ThemedView>

          <View style={styles.summaryMetricsContainer}>
            <View style={styles.summaryMetricItem}>
              <ThemedText style={styles.metricLabel}>Entradas</ThemedText>
              <ThemedText style={[styles.metricValue, styles.metricValueIn]}>R$ {totalIncome.toFixed(2).replace('.', ',')}</ThemedText>
            </View>
            <View style={styles.summaryMetricItem}>
              <ThemedText style={styles.metricLabel}>Saídas</ThemedText>
              <ThemedText style={[styles.metricValue, styles.metricValueOut]}>R$ {totalExpense.toFixed(2).replace('.', ',')}</ThemedText>
            </View>
          </View>
          <View style={styles.balanceSummary}>
            <ThemedText style={styles.metricLabel}>Saldo Líquido</ThemedText>
            <ThemedText style={[styles.metricValue, balance >= 0 ? styles.metricValueIn : styles.metricValueOut]}>
              R$ {balance.toFixed(2).replace('.', ',')}
            </ThemedText>
          </View>
        </ThemedView>

        {/* Gráfico de Fluxo de Caixa (Entradas vs Saídas) */}
        <SectionCard title="Fluxo de Caixa Mensal" iconName="bar-chart-outline" defaultOpen={true}>
          {flowChartData.datasets[0].data[0] > 0 || flowChartData.datasets[0].data[1] > 0 ? (
            <BarChart
              data={flowChartData}
              width={screenWidth - 80}
              height={220}
              chartConfig={{
                ...chartConfig,
                barRadius: 5, // Cantos arredondados nas barras
                horizontalLabelRotation: -15, // Rotação para labels longos
                decimalPlaces: 2,
              }}
              style={styles.chart}
              showValuesOnTopOfBars={true} // Mostrar valores em cima das barras
            />
          ) : (
            <ThemedText style={styles.noDataText}>Nenhum dado de fluxo de caixa para este período.</ThemedText>
          )}
        </SectionCard>

        {/* Gastos por Categoria Principal */}
        <SectionCard title="Gastos por Categoria Principal" iconName="pie-chart-outline">
          {categoryData.length > 0 ? (
            <PieChart
              data={categoryData}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 0]}
              absolute
              style={styles.chart}
            />
          ) : (
            <ThemedText style={styles.noDataText}>Nenhum gasto registrado para este período.</ThemedText>
          )}
        </SectionCard>

        {/* Análise Detalhada por Subcategoria */}
        <SectionCard title="Análise Detalhada por Subcategoria" iconName="bookmark-outline">
          <ThemedView style={styles.pickerWrapperFull}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.picker}
              itemStyle={Platform.OS === 'ios' ? { color: Colors[colorScheme ?? 'light'].text } : {}}
            >
              <Picker.Item label="Selecione uma Categoria para Detalhar" value={null} />
              {categoryData.map((dataItem) => (
                <Picker.Item key={dataItem.name} label={dataItem.name} value={dataItem.name} />
              ))}
            </Picker>
          </ThemedView>

          {selectedCategory && subcategoryData.labels.length > 0 ? (
            <BarChart
              data={subcategoryData}
              width={screenWidth - 80}
              height={220}
              chartConfig={{
                ...chartConfig,
                barRadius: 5, // Cantos arredondados nas barras
                horizontalLabelRotation: -15,
              }}
              style={styles.chart}
              showValuesOnTopOfBars={true}
            />
          ) : (
            <ThemedText style={styles.noDataText}>
              {selectedCategory ? `Nenhuma subcategoria registrada para "${selectedCategory}" neste período.` : 'Selecione uma categoria para ver as subcategorias.'}
            </ThemedText>
          )}
        </SectionCard>

        {/* Lista de Transações Recentes */}
        <SectionCard title="Transações Detalhadas" iconName="list-outline" defaultOpen={true}>
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
            <ThemedText style={styles.noTransactionsText}>Nenhuma transação registrada para este período.</ThemedText>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
    color: Colors.light.text,
  },
  // Card de Resumo do Período
  summaryPeriodCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  summaryCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.tabIconDefault,
    paddingBottom: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderWidth: 0,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  picker: {
    height: 50,
    width: '100%',
    color: Platform.OS === 'android' ? Colors.light.text : undefined,
  },
  summaryMetricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  summaryMetricItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricValueIn: {
    color: '#28a745', // Verde para entradas
  },
  metricValueOut: {
    color: '#dc3545', // Vermelho para saídas
  },
  balanceSummary: {
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.light.icon,
    marginTop: 20,
  },
  // Estilos para a lista de transações detalhadas (reusado do HomeScreen, mas dentro de uma SectionCard)
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
});

export default ExtractScreen;
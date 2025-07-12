// mobile/app/(tabs)/summary.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, ActivityIndicator, ScrollView, Platform, View } from 'react-native'; // Adicionado Platform
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import api from '@/services/api';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const screenWidth = Dimensions.get('window').width;

// Dados mockados para demonstração
const MOCKED_TRANSACTIONS = [
  { id: '1', description: 'Consultoria', value: 3000, type: 'entrada', category: 'Receitas', subcategory: 'Serviços', date: '2025-07-01' },
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

const SummaryScreen = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
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

  const chartConfig = {
    backgroundColor: Colors[colorScheme ?? 'light'].background,
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
      stroke: Colors.light.tint
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <ThemedText>Carregando resumo...</ThemedText>
      </ThemedView>
    );
  }

  const categoryData = getCategoryData();
  const subcategoryData = getSubcategoryData();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <ThemedText type="title" style={styles.header}>Resumo Financeiro</ThemedText>

      <ThemedView style={styles.sectionCard}>
        <ThemedText type="subtitle" style={styles.sectionCardTitle}>Período Selecionado</ThemedText>
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
      </ThemedView>

      <ThemedView style={styles.sectionCard}>
        <ThemedText type="subtitle" style={styles.sectionCardTitle}>Gastos por Categoria Principal</ThemedText>
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
      </ThemedView>

      <ThemedView style={styles.sectionCard}>
        <ThemedText type="subtitle" style={styles.sectionCardTitle}>Análise Detalhada por Subcategoria</ThemedText>
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
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            style={styles.chart}
            showValuesOnTopOfBars={true}
          />
        ) : (
          <ThemedText style={styles.noDataText}>
            {selectedCategory ? `Nenhuma subcategoria registrada para "${selectedCategory}" neste período.` : 'Selecione uma categoria para ver as subcategorias.'}
          </ThemedText>
        )}
      </ThemedView>
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
    marginBottom: 30,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },
  sectionCardTitle: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 0,
    color: Colors.light.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  pickerWrapperFull: {
    backgroundColor: Colors.light.background,
    borderWidth: 0,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.light.icon,
    marginTop: 20,
  },
});

export default SummaryScreen;
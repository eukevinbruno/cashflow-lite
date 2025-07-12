// mobile/app/(tabs)/add.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
// Removido 'api' importação pois foi solicitado foco no mobile primeiro e os dados são mockados no frontend.
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons'; // Para ícones de categoria, se for o caso

const screenWidth = Dimensions.get('window').width;

const CATEGORIES: { [key: string]: string[] } = {
  'Receitas': ['Serviços', 'Vendas de Produtos', 'Outras Receitas', 'Dividendos', 'Rendimentos'],
  'Alimentação': ['Restaurantes', 'Mercado', 'Delivery', 'Lanches'],
  'Moradia': ['Aluguel', 'Contas (Água, Luz, Internet)', 'Manutenção', 'Condomínio', 'IPTU'],
  'Transporte': ['Combustível', 'Transporte Público', 'Manutenção Veículo', 'Aplicativos (Uber/99)'],
  'Lazer': ['Cinema', 'Viagens', 'Hobbies', 'Shows', 'Assinaturas (Streaming)'],
  'Material de Trabalho': ['Equipamentos', 'Suprimentos', 'Softwares', 'Cursos/Treinamentos'],
  'Impostos': ['DAS', 'IRPJ', 'Outros Impostos', 'INSS'],
  'Saúde': ['Consultas', 'Medicamentos', 'Plano de Saúde'],
  'Educação': ['Cursos', 'Livros', 'Mensalidade'],
  'Outros': ['Presentes', 'Doações', 'Despesas Diversas'],
};

const AddTransactionScreen = () => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('saida'); // Default para Saída, mais comum para controle inicial
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSaveTransaction = async () => {
    if (!value || parseFloat(value) <= 0 || !description || !selectedMainCategory) {
      Alert.alert('Erro', 'Por favor, preencha o valor, a descrição e selecione uma categoria principal.');
      return;
    }

    setIsSaving(true);
    const transactionData = {
      value: parseFloat(value) * (type === 'saida' ? -1 : 1),
      type,
      date: date.toISOString().split('T')[0],
      description,
      category: selectedMainCategory,
      subcategory: selectedSubcategory,
    };

    try {
      // Aqui você integraria com a API real (quando tiver o backend Flask)
      // const response = await api.post('/transactions', transactionData);
      console.log('Dados da transação a serem enviados (mocked):', transactionData);
      Alert.alert('Sucesso', 'Transação registrada com sucesso!', [
        { text: 'OK', onPress: () => {
            // Limpar formulário
            setValue('');
            setDescription('');
            setSelectedMainCategory(null);
            setSelectedSubcategory(null);
            setDate(new Date());
            setType('saida'); // Resetar para default
          }
        }
      ]);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      Alert.alert('Erro', 'Não foi possível registrar a transação. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentSubcategories = selectedMainCategory ? CATEGORIES[selectedMainCategory] : [];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>Nova Transação</ThemedText>

        {/* Campo de Valor */}
        <ThemedView style={styles.valueInputContainer}>
          <ThemedText style={styles.currencySymbol}>R$</ThemedText>
          <TextInput
            style={styles.valueInput}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor={Colors.light.icon + '80'} // Placeholder mais suave
            value={value}
            onChangeText={(text) => setValue(text.replace(',', '.'))}
          />
        </ThemedView>

        {/* Seleção de Tipo (Entrada/Saída) */}
        <ThemedView style={styles.typeToggleContainer}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'entrada' && styles.typeButtonActive]}
            onPress={() => setType('entrada')}
          >
            <Ionicons name="arrow-up-circle-outline" size={24} color={type === 'entrada' ? '#fff' : Colors.light.text} />
            <ThemedText style={[styles.typeButtonText, type === 'entrada' && styles.typeButtonTextActive]}>Entrada</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'saida' && styles.typeButtonActive]}
            onPress={() => setType('saida')}
          >
            <Ionicons name="arrow-down-circle-outline" size={24} color={type === 'saida' ? '#fff' : Colors.light.text} />
            <ThemedText style={[styles.typeButtonText, type === 'saida' && styles.typeButtonTextActive]}>Saída</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Descrição e Data */}
        <ThemedView style={styles.detailInputsCard}>
          <ThemedText style={styles.label}>Descrição:</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Ex: Venda de serviço, Aluguel do escritório"
            placeholderTextColor={Colors.light.icon}
            value={description}
            onChangeText={setDescription}
          />

          <ThemedText style={styles.label}>Data:</ThemedText>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Ionicons name="calendar-outline" size={20} color={Colors.light.text} style={{ marginRight: 8 }} />
            <ThemedText style={styles.datePickerText}>{date.toLocaleDateString('pt-BR')}</ThemedText>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </ThemedView>

        {/* Seleção de Categoria Principal */}
        <ThemedView style={styles.categorySelectionCard}>
          <ThemedText style={styles.label}>Categoria Principal:</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {Object.keys(CATEGORIES).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  selectedMainCategory === cat && styles.categoryChipActive,
                ]}
                onPress={() => {
                  setSelectedMainCategory(cat);
                  setSelectedSubcategory(null); // Resetar subcategoria ao mudar categoria principal
                }}
              >
                <ThemedText style={[
                  styles.categoryChipText,
                  selectedMainCategory === cat && styles.categoryChipTextActive,
                ]}>
                  {cat}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>

        {/* Seleção de Subcategoria (condicional) */}
        {selectedMainCategory && currentSubcategories.length > 0 && (
          <ThemedView style={styles.categorySelectionCard}>
            <ThemedText style={styles.label}>Subcategoria:</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {currentSubcategories.map((subcat) => (
                <TouchableOpacity
                  key={subcat}
                  style={[
                    styles.categoryChip,
                    selectedSubcategory === subcat && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedSubcategory(subcat)}
                >
                  <ThemedText style={[
                    styles.categoryChipText,
                    selectedSubcategory === subcat && styles.categoryChipTextActive,
                  ]}>
                    {subcat}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ThemedView>
        )}

        {/* Botão Salvar */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveTransaction}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.saveButtonText}>Salvar Transação</ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.light.text,
    fontWeight: 'bold',
  },
  // Estilo para o Input de Valor principal
  valueInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: Colors.light.background,
    borderRadius: 15,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginRight: 5,
  },
  valueInput: {
    fontSize: 48, // Valor bem grande
    fontWeight: 'bold',
    color: Colors.light.tint, // Cor de destaque para o valor
    textAlign: 'center',
    minWidth: screenWidth * 0.4, // Garante que não esprema
    maxWidth: screenWidth * 0.6,
    // Remover padding e bordas para não atrapalhar o tamanho da fonte
    padding: 0,
    borderWidth: 0,
  },
  // Estilo para o Toggle de Tipo (Entrada/Saída)
  typeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row', // Ícone ao lado do texto
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: 'transparent',
    gap: 8, // Espaçamento entre ícone e texto
  },
  typeButtonActive: {
    backgroundColor: Colors.light.tint,
  },
  typeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  // Estilo para os cards de detalhes (Descrição e Data)
  detailInputsCard: {
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
  input: {
    backgroundColor: Colors.light.background,
    borderWidth: 0,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
    shadowColor: '#000', // Sombra leve para inputs
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 15, // Espaçamento entre inputs
  },
  datePickerButton: {
    backgroundColor: Colors.light.background,
    borderWidth: 0,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row', // Ícone ao lado da data
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  datePickerText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  // Estilo para a seleção de Categorias/Subcategorias (Chips)
  categorySelectionCard: {
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
  categoryScroll: {
    paddingVertical: 5, // Espaçamento interno para os chips
  },
  categoryChip: {
    backgroundColor: Colors.light.background, // Fundo do tema
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1, // Borda sutil
    borderColor: Colors.light.icon + '50', // Cor de ícone com transparência
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 0.5,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint, // Borda da cor de destaque
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  // Botão Salvar
  saveButton: {
    backgroundColor: Colors.light.tint,
    padding: 18, // Um pouco mais de padding
    borderRadius: 15, // Cantos mais arredondados
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 20, // Tamanho de fonte maior
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen;
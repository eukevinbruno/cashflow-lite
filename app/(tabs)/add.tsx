// mobile/app/(tabs)/add.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'; // Adicionado Platform

const CATEGORIES: { [key: string]: string[] } = {
  'Receitas': ['Serviços', 'Vendas de Produtos', 'Outras Receitas'],
  'Alimentação': ['Restaurantes', 'Mercado', 'Delivery'],
  'Moradia': ['Aluguel', 'Contas (Água, Luz, Internet)', 'Manutenção'],
  'Transporte': ['Combustível', 'Transporte Público', 'Manutenção Veículo'],
  'Lazer': ['Cinema', 'Viagens', 'Hobbies'],
  'Material de Trabalho': ['Equipamentos', 'Suprimentos', 'Softwares'],
  'Impostos': ['DAS', 'IRPJ', 'Outros Impostos'],
  'Outros': ['Diversos', 'Educação', 'Saúde'],
};

const AddTransactionScreen = () => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('entrada');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Receitas');
  const [subcategory, setSubcategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSaveTransaction = async () => {
    if (!value || parseFloat(value) <= 0 || !description) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios e um valor válido.');
      return;
    }

    setIsSaving(true);
    const transactionData = {
      value: parseFloat(value) * (type === 'saida' ? -1 : 1),
      type,
      date: date.toISOString().split('T')[0],
      description,
      category,
      subcategory: subcategory || null,
    };

    try {
      // await api.post('/transactions', transactionData); // Descomentar para API real
      console.log('Dados da transação a serem enviados (mocked):', transactionData);
      Alert.alert('Sucesso', 'Transação registrada!');
      setValue('');
      setDescription('');
      setCategory('Receitas');
      setSubcategory('');
      setDate(new Date());
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      Alert.alert('Erro', 'Não foi possível registrar a transação. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>Registrar Nova Transação</ThemedText>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Tipo de Transação:</ThemedText>
          <ThemedView style={styles.typeToggleContainer}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'entrada' && styles.typeButtonActive]}
              onPress={() => setType('entrada')}
            >
              <ThemedText style={[styles.typeButtonText, type === 'entrada' && styles.typeButtonTextActive]}>Entrada</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, type === 'saida' && styles.typeButtonActive]}
              onPress={() => setType('saida')}
            >
              <ThemedText style={[styles.typeButtonText, type === 'saida' && styles.typeButtonTextActive]}>Saída</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Valor (R$):</ThemedText>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={Colors.light.icon}
            value={value}
            onChangeText={(text) => setValue(text.replace(',', '.'))}
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Data:</ThemedText>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
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

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Descrição Breve:</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Ex: Venda de serviço, Aluguel, Supermercado"
            placeholderTextColor={Colors.light.icon}
            value={description}
            onChangeText={setDescription}
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Categoria Principal:</ThemedText>
          <ThemedView style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
              itemStyle={{ color: Colors.light.text }}
            >
              {Object.keys(CATEGORIES).map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </ThemedView>
        </ThemedView>

        {category && CATEGORIES[category] && CATEGORIES[category].length > 0 && (
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Subcategoria:</ThemedText>
            <ThemedView style={styles.pickerContainer}>
              <Picker
                selectedValue={subcategory}
                onValueChange={(itemValue) => setSubcategory(itemValue)}
                style={styles.picker}
                itemStyle={{ color: Colors.light.text }}
              >
                <Picker.Item label="Selecione uma subcategoria (Opcional)" value="" />
                {CATEGORIES[category].map((subcat) => (
                  <Picker.Item key={subcat} label={subcat} value={subcat} />
                ))}
              </Picker>
            </ThemedView>
          </ThemedView>
        )}

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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.light.text,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: Colors.light.background,
    borderWidth: 0,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
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
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: Colors.light.tint,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  datePickerButton: {
    backgroundColor: Colors.light.background,
    borderWidth: 0,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  datePickerText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  pickerContainer: {
    backgroundColor: Colors.light.background,
    borderWidth: 0,
    borderRadius: 10,
    overflow: 'hidden',
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
  saveButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen;
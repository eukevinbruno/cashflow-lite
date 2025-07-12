// mobile/app/(tabs)/profile.tsx
import React, { useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Platform, View } from 'react-native'; // Adicionado Platform
import api from '@/services/api';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

const ProfileScreen = () => {
  const [isDASActive, setIsDASActive] = useState(false);
  const [dasStatus, setDasStatus] = useState('Não Configurado');
  const [dasDueDate, setDasDueDate] = useState('');
  const [loadingDAS, setLoadingDAS] = useState(true);
  const [isDeactivating, setIsDeactivating] = useState(false);

  React.useEffect(() => {
    const fetchDASStatus = async () => {
      try {
        setIsDASActive(true);
        setDasStatus('A Pagar');
        setDasDueDate('20/07/2025');
      } catch (error) {
        console.error('Erro ao buscar status do DAS:', error);
        Alert.alert('Erro', 'Não foi possível carregar o status do DAS.');
      } finally {
        setLoadingDAS(false);
      }
    };
    fetchDASStatus();
  }, []);

  const toggleDAS = async () => {
    const newState = !isDASActive;
    setIsDASActive(newState);
    try {
      // await api.post('/user/toggle-das', { isActive: newState }); // Descomentar para API real
      Alert.alert('Status DAS', `Gestão do DAS ${newState ? 'ativada' : 'desativada'}!`);
    } catch (error) {
      console.error('Erro ao alternar DAS:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status do DAS. Tente novamente.');
      setIsDASActive(!newState);
    }
  };

  const handleDownloadDAS = () => {
    Alert.alert(
      'Funcionalidade Futura',
      'Em breve, você poderá gerar e baixar o boleto DAS diretamente por aqui, com um link para o portal oficial!'
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Desativar Conta',
      'Tem certeza que deseja desativar sua conta? Seus dados serão removidos ou anonimizados conforme nossa política de privacidade.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sim, Desativar',
          onPress: async () => {
            setIsDeactivating(true);
            try {
              // await api.post('/user/deactivate-account'); // Descomentar para API real
              Alert.alert('Sucesso', 'Sua conta foi desativada.');
            } catch (error) {
              console.error('Erro ao desativar conta:', error);
              Alert.alert('Erro', 'Não foi possível desativar sua conta. Tente novamente.');
            } finally {
              setIsDeactivating(false);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <ThemedText type="title" style={styles.header}>Meu Perfil e Configurações</ThemedText>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Gerenciamento do DAS MEI</ThemedText>
        {loadingDAS ? (
          <ActivityIndicator size="small" color={Colors.light.tint} />
        ) : (
          <>
            <View style={styles.settingRow}> {/* Usar View para o texto do switch */}
              <ThemedText style={styles.settingLabel}>Ativar Gestão do DAS:</ThemedText>
              <Switch
                trackColor={{ false: "#767577", true: Colors.light.tint }}
                thumbColor={Platform.OS === 'android' ? Colors.light.tint : Colors.light.background}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleDAS}
                value={isDASActive}
              />
            </View>

            {isDASActive ? (
              <ThemedView style={styles.dasInfoContainer}>
                <ThemedText style={styles.dasInfoText}>
                  Status do DAS atual: <ThemedText style={[
                    styles.dasStatusText,
                    dasStatus === 'Pago' && styles.dasStatusPaid,
                    dasStatus === 'A Pagar' && styles.dasStatusPending,
                    dasStatus === 'Atrasado' && styles.dasStatusOverdue
                  ]}>{dasStatus}</ThemedText>
                </ThemedText>
                {dasStatus === 'A Pagar' && dasDueDate && (
                  <ThemedText style={styles.dasInfoText}>Vencimento: {dasDueDate}</ThemedText>
                )}
                <TouchableOpacity style={styles.dasButton} onPress={handleDownloadDAS}>
                  <ThemedText style={styles.dasButtonText}>Gerar/Baixar Boleto DAS</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            ) : (
              <ThemedText style={styles.dasInfoText}>
                A gestão do DAS está desativada. O cálculo do imposto ficará por sua conta.
              </ThemedText>
            )}
          </>
        )}
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Gerenciar Conta</ThemedText>
        <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteAccount} disabled={isDeactivating}>
          {isDeactivating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.dangerButtonText}>Desativar Minha Conta</ThemedText>
          )}
        </TouchableOpacity>
        <ThemedText style={styles.dangerButtonDescription}>
          Ao desativar sua conta, seus dados serão removidos ou anonimizados de forma permanente.
        </ThemedText>
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
  header: {
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
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
  cardTitle: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 0,
    color: Colors.light.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  dasInfoContainer: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 0,
  },
  dasInfoText: {
    fontSize: 15,
    color: Colors.light.icon,
    marginBottom: 8,
  },
  dasStatusText: {
    fontWeight: 'bold',
  },
  dasStatusPaid: {
    color: '#28a745',
  },
  dasStatusPending: {
    color: '#ffc107',
  },
  dasStatusOverdue: {
    color: '#dc3545',
  },
  dasButton: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dasButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dangerButtonDescription: {
    fontSize: 12,
    color: Colors.light.icon,
    marginTop: 10,
    textAlign: 'center',
  }
});

export default ProfileScreen;
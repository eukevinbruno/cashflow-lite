// mobile/app/(tabs)/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {  ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

// --- Componente auxiliar para seções colapsáveis ---
// Poderia ser um componente separado em components/SettingSection.tsx
interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
  iconName: keyof typeof Ionicons.glyphMap; // Nome do ícone Ionicons
  defaultOpen?: boolean;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children, iconName, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <ThemedView style={sectionStyles.sectionCard}>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={sectionStyles.sectionHeader}>
        <Ionicons name={iconName} size={24} color={Colors.light.tint} style={sectionStyles.sectionIcon} />
        <ThemedText type="subtitle" style={sectionStyles.sectionTitle}>{title}</ThemedText>
        <Ionicons
          name={isOpen ? 'chevron-down-outline' : 'chevron-forward-outline'}
          size={20}
          color={Colors.light.icon}
        />
      </TouchableOpacity>
      {isOpen && <ThemedView style={sectionStyles.sectionContent}>{children}</ThemedView>}
    </ThemedView>
  );
};

const sectionStyles = StyleSheet.create({
  sectionCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden', // Importante para o arredondamento
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 0, // Remover borda padrão se houver
    backgroundColor: Colors.light.background, // Fundo branco para o cabeçalho
  },
  sectionIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    flex: 1, // Ocupar o espaço restante
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10, // Pequeno padding no topo para conteúdo
    borderTopWidth: 1, // Separador visual para conteúdo expandido
    borderTopColor: Colors.light.tabIconDefault, // Cor suave para o separador
  },
});

// --- Fim do componente auxiliar ---


const ProfileScreen = () => {
  const [isDASActive, setIsDASActive] = useState(false);
  const [dasStatus, setDasStatus] = useState('Não Configurado');
  const [dasDueDate, setDasDueDate] = useState('');
  const [loadingDAS, setLoadingDAS] = useState(true);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Dados mockados para simular um usuário logado
  const userName = "Kevin Bruno";
  const userEmail = "kevin.bruno@example.com";

  React.useEffect(() => {
    const fetchDASStatus = async () => {
      try {
        // Simulação de chamada de API
        // const response = await api.get('/user/das-status');
        // setIsDASActive(response.data.active);
        // setDasStatus(response.data.status);
        // setDasDueDate(response.data.due_date);

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
      // await api.post('/user/toggle-das', { isActive: newState });
      // Alert.alert('Status DAS', `Gestão do DAS ${newState ? 'ativada' : 'desativada'}!`);
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
              // await api.post('/user/deactivate-account');
              Alert.alert('Sucesso', 'Sua conta foi desativada.');
              // router.replace('/login'); // Redirecionar para tela de login após desativar
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
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>Minha Conta</ThemedText>

        {/* Informações do Usuário */}
        <ThemedView style={styles.userInfoCard}>
          <Ionicons name="person-circle-outline" size={80} color={Colors.light.tint} />
          <ThemedText type="subtitle" style={styles.userName}>{userName}</ThemedText>
          <ThemedText style={styles.userEmail}>{userEmail}</ThemedText>
        </ThemedView>

        {/* Gerenciamento do DAS MEI */}
        <SettingSection title="Gerenciamento do DAS MEI" iconName="document-text-outline" defaultOpen={true}>
          {loadingDAS ? (
            <ActivityIndicator size="small" color={Colors.light.tint} style={styles.loadingIndicator} />
          ) : (
            <>
              <View style={styles.settingRow}>
                <ThemedText style={styles.settingLabel}>Ativar Gestão do DAS:</ThemedText>
                <Switch
                  trackColor={{ false: Colors.light.tabIconDefault, true: Colors.light.tint }}
                  thumbColor={Platform.OS === 'android' ? Colors.light.tint : Colors.light.background}
                  ios_backgroundColor={Colors.light.tabIconDefault}
                  onValueChange={toggleDAS}
                  value={isDASActive}
                />
              </View>

              {isDASActive ? (
                <View style={styles.dasInfoContainer}>
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
                </View>
              ) : (
                <ThemedText style={styles.dasInfoText}>
                  A gestão do DAS está desativada. O cálculo do imposto ficará por sua conta.
                </ThemedText>
              )}
            </>
          )}
        </SettingSection>

        {/* Configurações da Conta */}
        <SettingSection title="Configurações da Conta" iconName="settings-outline">
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingItemText}>Mudar Senha</ThemedText>
            <Ionicons name="chevron-forward-outline" size={20} color={Colors.light.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingItemText}>Dados Pessoais</ThemedText>
            <Ionicons name="chevron-forward-outline" size={20} color={Colors.light.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingItemText}>Notificações</ThemedText>
            <Ionicons name="chevron-forward-outline" size={20} color={Colors.light.icon} />
          </TouchableOpacity>
        </SettingSection>

        {/* Ajuda e Suporte */}
        <SettingSection title="Ajuda e Suporte" iconName="help-circle-outline">
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingItemText}>Perguntas Frequentes</ThemedText>
            <Ionicons name="chevron-forward-outline" size={20} color={Colors.light.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingItemText}>Contatar Suporte</ThemedText>
            <Ionicons name="chevron-forward-outline" size={20} color={Colors.light.icon} />
          </TouchableOpacity>
        </SettingSection>

        {/* Informações Legais */}
        <SettingSection title="Informações Legais" iconName="information-circle-outline">
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingItemText}>Termos de Serviço</ThemedText>
            <Ionicons name="chevron-forward-outline" size={20} color={Colors.light.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingItemText}>Política de Privacidade</ThemedText>
            <Ionicons name="chevron-forward-outline" size={20} color={Colors.light.icon} />
          </TouchableOpacity>
        </SettingSection>

        {/* Ações de Conta */}
        <SettingSection title="Ações da Conta" iconName="exit-outline">
          <TouchableOpacity style={styles.settingItem}>
            <ThemedText style={styles.settingItemText}>Sair</ThemedText>
            <Ionicons name="log-out-outline" size={20} color={Colors.light.icon} />
          </TouchableOpacity>
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
        </SettingSection>

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
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.light.text,
  },
  userInfoCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  userName: {
    marginTop: 10,
    color: Colors.light.text,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 10,
  },
  loadingIndicator: {
    marginTop: 10,
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.light.text,
  },
  dasInfoContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault,
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
    color: '#28a745', // Verde
  },
  dasStatusPending: {
    color: '#ffc107', // Amarelo
  },
  dasStatusOverdue: {
    color: '#dc3545', // Vermelho
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.tabIconDefault, // Linha divisória suave
  },
  settingItemText: {
    fontSize: 16,
    color: Colors.light.text,
    flex: 1, // Para o texto ocupar o máximo de espaço
  },
  dangerButton: {
    backgroundColor: '#dc3545', // Vermelho para ação de perigo
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
  },
});

export default ProfileScreen;
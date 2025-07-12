// mobile/services/api.ts
import axios from 'axios';
import { Platform } from 'react-native';

// O IP do seu computador na rede local onde o backend Flask **será** rodando.
// Por enquanto, como não há backend, as chamadas serão mockadas nos componentes.
// No emulador Android, '10.0.2.2' aponta para o localhost da sua máquina de desenvolvimento.
// No iOS, ou no seu celular físico, você precisará usar o IP real da sua máquina na rede local.
// Ex: `http://192.168.1.100:5000` (substitua pelo seu IP)
const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
// Se estiver usando o Expo Go em um aparelho físico, substitua 'localhost' pelo IP da sua máquina na rede local
// Ex: const API_BASE_URL = 'http://192.168.1.100:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação (se houver) - descomentar quando tiver auth
// import AsyncStorage from '@react-native-async-storage/async-storage';
// api.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem('userToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

export default api;
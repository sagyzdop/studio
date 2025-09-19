import axios from 'axios';
import { User, SavedVisualization, ChartData } from './types';

// Create an Axios instance configured to communicate with your backend
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Add a request interceptor to include the JWT token in every request
apiClient.interceptors.request.use((config) => {
  // In a browser environment, localStorage is available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- Authentication Service ---

export const registerUser = (email: string, password: string): Promise<{ data: User }> => {
  const formData = new FormData();
  formData.append('username', email); // FastAPI's OAuth2PasswordRequestForm expects 'username'
  formData.append('password', password);
  return apiClient.post('/api/auth/register', formData);
};

export const loginUser = async (email: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  const response = await apiClient.post('/auth/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response;
};

export const fetchCurrentUser = (): Promise<{ data: User }> => {
  return apiClient.get('/api/auth/me');
};

// --- Dashboard Service ---

export const getDashboardCharts = async (): Promise<SavedVisualization[]> => {
    const response = await apiClient.get('/api/dashboard/charts');
    return response.data;
};

export const addChartToDashboard = (chartData: ChartData): Promise<{ data: SavedVisualization }> => {
    return apiClient.post('/api/dashboard/charts', chartData);
};


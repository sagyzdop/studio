import axios from 'axios';
import { Chart } from './types';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  // baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDashboardCharts = async (): Promise<{ data: Chart[] }> => {
  return apiClient.get('/api/dashboard/charts');
};

export const addChartToDashboard = async (chartData: {
  title: string;
  sqlQuery: string;
}): Promise<{ data: Chart }> => {
  return apiClient.post('/api/dashboard/charts', chartData);
};

export const fetchChartData = async (chartId: number): Promise<any[]> => {
  const response = await apiClient.get(`/api/dashboard/charts/${chartId}/data`);
  return response.data;
};
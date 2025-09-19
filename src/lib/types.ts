export type User = {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
};

export type SavedVisualization = {
  id: string;
  userId: string;
  title: string;
  sqlQuery: string;
  chartType: 'bar' | 'line' | 'pie' | 'scatter' | 'table';
  data: any[];
  createdAt: string;
};

export type ChartData = {
  [key: string]: string | number;
}[];

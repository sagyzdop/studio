export type User = {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
};

export type SavedVisualization = {
  id: number;
  title: string;
  sqlQuery: string;
};

export interface Chart {
  id: number;
  title: string;
  sqlQuery: string;
}

export type ChartData = {
  [key: string]: string | number;
}[];

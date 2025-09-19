import type { SavedVisualization } from './types';

export const mockVisualizations: SavedVisualization[] = [
  {
    id: '1',
    userId: '1',
    title: 'Average Cost by Category',
    sqlQuery: 'SELECT category, AVG(cost) as average_cost FROM expenses GROUP BY category;',
    chartType: 'bar',
    data: [
      { category: 'Office Supplies', average_cost: 150.75 },
      { category: 'Travel', average_cost: 850.50 },
      { category: 'Software', average_cost: 320.00 },
      { category: 'Utilities', average_cost: 210.25 },
    ],
    createdAt: '2024-07-20T10:00:00Z',
  },
  {
    id: '2',
    userId: '1',
    title: 'Monthly Revenue Trend',
    sqlQuery: "SELECT strftime('%Y-%m', date) as month, SUM(revenue) as total_revenue FROM sales GROUP BY month ORDER BY month;",
    chartType: 'line',
    data: [
      { month: '2024-01', total_revenue: 120000 },
      { month: '2024-02', total_revenue: 150000 },
      { month: '2024-03', total_revenue: 135000 },
      { month: '2024-04', total_revenue: 175000 },
    ],
    createdAt: '2024-07-19T14:30:00Z',
  },
  {
    id: '3',
    userId: '1',
    title: 'Sales Distribution by Region',
    sqlQuery: 'SELECT region, SUM(sales_amount) as total_sales FROM sales_by_region GROUP BY region;',
    chartType: 'pie',
    data: [
      { name: 'North', value: 400000 },
      { name: 'South', value: 300000 },
      { name: 'East', value: 300000 },
      { name: 'West', value: 200000 },
    ],
    createdAt: '2024-07-18T09:00:00Z',
  },
];

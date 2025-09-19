import type { SavedVisualization } from './types';

export const mockVisualizations: SavedVisualization[] = [
  {
    id: 1,
    title: 'Average Cost by Category',
    sqlQuery: 'SELECT category, AVG(cost) as average_cost FROM expenses GROUP BY category;',
  },
  {
    id: 2,
    title: 'Monthly Revenue Trend',
    sqlQuery: "SELECT strftime('%Y-%m', date) as month, SUM(revenue) as total_revenue FROM sales GROUP BY month ORDER BY month;",
  },
  {
    id: 3,
    title: 'Sales Distribution by Region',
    sqlQuery: 'SELECT region, SUM(sales_amount) as total_sales FROM sales_by_region GROUP BY region;',
  },
];

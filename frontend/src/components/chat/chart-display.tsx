'use client';

import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { downloadImage } from '../../lib/utils';
import { Bot, Loader2, Share2, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AddToDashboardModal } from './add-to-dashboard-modal';

interface ChartDisplayProps {
  data: any | null;
  onSimulate: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function ChartDisplay({ data, onSimulate }: ChartDisplayProps) {
  const [chartType, setChartType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const chartRef = useRef<HTMLDivElement>(null);

  const handleShare = () => {
    toast({ title: 'Sharing chart...', description: 'Generating image for download.' });
    downloadImage(chartRef.current, 'chat-visualization');
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4">AI is selecting the best chart for your data...</p>
        </div>
      );
    }
    
    if (!data || !data.results || !chartType) {
        return (
            <div className="text-center text-muted-foreground">
                <p>Awaiting data from chatbot...</p>
                <Button onClick={onSimulate} className="mt-4">
                Simulate Receiving Data
                </Button>
            </div>
        );
    }

    const dataKeys =
      data.results.length > 0 ? Object.keys(data.results[0]) : [];
    const categoryKey = dataKeys.find(
      (k) => typeof data.results[0]?.[k] === 'string'
    );
    const valueKey = dataKeys.find(
      (k) => typeof data.results[0]?.[k] === 'number'
    );

    if (!categoryKey || !valueKey) {
      return (
        <div className="text-center text-muted-foreground">
          Cannot render chart: Invalid data format
        </div>
      );
    }

    let chartComponent;
    switch (chartType) {
      case 'bar':
        chartComponent = (
          <BarChart data={data.results}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey={categoryKey}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Bar dataKey={valueKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
        break;
      case 'line':
        chartComponent = (
          <LineChart data={data.results}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey={categoryKey}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Line
              type="monotone"
              dataKey={valueKey}
              stroke="hsl(var(--primary))"
            />
          </LineChart>
        );
        break;
      case 'pie':
        chartComponent = (
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Pie
              data={data.results}
              dataKey={valueKey}
              nameKey={categoryKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="hsl(var(--primary))"
            >
              {data.results.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        );
        break;
      default:
        chartComponent = (
          <div className="text-center text-muted-foreground">
            AI suggested an unsupported chart type: {chartType}
          </div>
        );
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        {chartComponent}
      </ResponsiveContainer>
    );
  };
  
  return (
    <div className="flex flex-col h-full items-center justify-center">
        {!data && <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
                <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Start a conversation</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                Your data visualizations will appear here.
                </p>
                <Button variant="outline" onClick={onSimulate} className="mt-4">
                    Or Simulate Receiving Data
                </Button>
            </div>
        </div>}
        {data && (
            <div className="w-full h-full flex flex-col">
                <div ref={chartRef} className="flex-1 p-4 bg-card">
                    {renderChart()}
                </div>
                <div className="flex items-center justify-end gap-2 p-4 border-t">
                    <AddToDashboardModal data={data} chartType={chartType} />
                    <Button variant="outline" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                </div>
            </div>
        )}
    </div>
  );
}

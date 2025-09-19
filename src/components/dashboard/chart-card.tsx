'use client';

import type { SavedVisualization } from '@/lib/types';
import { BarChart, LineChart, PieChart, ScatterChart, Bar, Line, Pie, Cell, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Share2 } from 'lucide-react';
import { useRef } from 'react';
import { downloadImage } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ChartCardProps {
  visualization: SavedVisualization;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function ChartCard({ visualization }: ChartCardProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleShare = () => {
    toast({ title: 'Sharing chart...', description: 'Generating image for download.' });
    downloadImage(chartRef.current, visualization.title.replace(/\s+/g, '_').toLowerCase());
  };

  const renderChart = () => {
    const dataKeys = visualization.data.length > 0 ? Object.keys(visualization.data[0]) : [];
    const categoryKey = dataKeys.find(k => typeof visualization.data[0]?.[k] === 'string');
    const valueKey = dataKeys.find(k => typeof visualization.data[0]?.[k] === 'number');

    if (!categoryKey || !valueKey) {
        return <div className="text-center text-muted-foreground">Cannot render chart: Invalid data format</div>;
    }

    switch (visualization.chartType) {
      case 'bar':
        return (
            <BarChart data={visualization.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey={categoryKey} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey={valueKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        );
      case 'line':
        return (
            <LineChart data={visualization.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey={categoryKey} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey={valueKey} stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} activeDot={{ r: 8 }} />
            </LineChart>
        );
      case 'pie':
        return (
            <PieChart>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Pie data={visualization.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="hsl(var(--primary))" label>
                    {visualization.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend />
            </PieChart>
        );
      default:
        return <div className="text-center text-muted-foreground">Chart type not supported</div>;
    }
  };

  return (
    <Card ref={chartRef} className="flex flex-col">
      <CardHeader>
        <CardTitle>{visualization.title}</CardTitle>
        <CardDescription className="truncate text-xs">{visualization.sqlQuery}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height={200}>
            {renderChart()}
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
        </Button>
      </CardFooter>
    </Card>
  );
}

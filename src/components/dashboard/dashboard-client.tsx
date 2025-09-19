'use client';

import { Button } from '@/components/ui/button';
import { Download, PlusCircle, RefreshCw } from 'lucide-react';
import { ChartCard } from './chart-card';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';
import { mockVisualizations } from '@/lib/mock-data';
import type { SavedVisualization } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { downloadImage } from '@/lib/utils';

export function DashboardClient() {
  const [visualizations, setVisualizations] = useState<SavedVisualization[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setVisualizations(mockVisualizations);
      setLoading(false);
    }, 1500);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast({ title: 'Refreshing dashboard...', description: 'Fetching latest data for all charts.' });
    // Simulate refreshing data
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Here you would typically re-fetch and update `visualizations`
    setIsRefreshing(false);
    toast({ title: 'Dashboard refreshed!', description: 'All charts are up to date.' });
  };
  
  const handleExport = () => {
    setIsExporting(true);
    toast({ title: 'Exporting dashboard...', description: 'Please wait while we generate the image.' });
    downloadImage(dashboardRef.current, 'dashboard-export');
    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm">
        <h1 className="text-2xl font-semibold font-headline">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6" ref={dashboardRef}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-48 w-full" />
                  </CardContent>
                </Card>
              ))
            : visualizations.map((vis) => (
                <ChartCard key={vis.id} visualization={vis} />
              ))}
          
          <Link href="/chat">
            <Card className="flex h-full min-h-[280px] cursor-pointer items-center justify-center border-2 border-dashed bg-transparent transition-colors hover:border-primary hover:bg-secondary/50">
              <div className="text-center">
                <PlusCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-semibold">Add block</p>
                <p className="text-sm text-muted-foreground">
                  Create a new visualization
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

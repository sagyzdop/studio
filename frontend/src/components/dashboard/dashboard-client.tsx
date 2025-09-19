'use client';

import useSWR from 'swr';
import { useRef } from 'react';
import Link from 'next/link';
import { Download, PlusCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { ChartCard } from './chart-card';
import { useToast } from '../../hooks/use-toast';
import { downloadImage } from '../../lib/utils';
import * as api from '../../lib/api';

export function DashboardClient() {
  // Use SWR to fetch, cache, and revalidate dashboard charts
  const { data: visualizations, error, isLoading, mutate } = useSWR(
    '/api/dashboard/charts', // The key is the API endpoint
    api.getDashboardCharts    // The fetcher function
  );

  const { toast } = useToast();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleRefresh = async () => {
    toast({ title: 'Refreshing dashboard...', description: 'Fetching latest data.' });
    await mutate(); // SWR re-fetches the data
    toast({ title: 'Dashboard refreshed!', description: 'All charts are up to date.' });
  };

  const handleExport = () => {
    if (!dashboardRef.current) return;
    toast({ title: 'Exporting dashboard...', description: 'Generating image for download.' });
    downloadImage(dashboardRef.current, 'dashboard-export');
  };
  
  if (error) {
    return <div className="p-6 text-destructive">Failed to load dashboard data. Please try again later.</div>
  }

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm">
        <h1 className="text-2xl font-semibold font-headline">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} disabled={isLoading} variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExport} disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6" ref={dashboardRef}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-48 w-full" />
                  </CardContent>
                </Card>
              ))
            : visualizations?.map((vis) => (
                <ChartCard key={vis.id} visualization={vis} />
              ))}
          
          <Link href="/chat" className="block">
            <Card className="flex h-full min-h-[280px] cursor-pointer items-center justify-center border-2 border-dashed bg-transparent transition-colors hover:border-primary hover:bg-secondary/50">
              <div className="text-center">
                <PlusCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-semibold">Add New Block</p>
                <p className="text-sm text-muted-foreground">Go to Chat</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}


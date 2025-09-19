"use client";

import useSWR from "swr";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Share2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { downloadImage } from "../../lib/utils";
import { useToast } from "../../hooks/use-toast";
import { Chart } from "../../lib/types";
import * as api from "../../lib/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartCardProps {
  visualization: Chart;
}

export function ChartCard({ visualization }: ChartCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);
  const { toast } = useToast();

  const {
    data: chartData,
    error,
    isLoading,
  } = useSWR(`/api/charts/${visualization.id}/data`, () =>
    api.fetchChartData(visualization.id)
  );

  useEffect(() => {
    if (isLoading || error || !chartData || !canvasRef.current) {
      return;
    }
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartData.length === 0) return;

    const dataKeys = Object.keys(chartData[0]);
    const categoryKey = dataKeys.find(
      (k) => typeof chartData[0]?.[k] === "string"
    );
    const valueKey = dataKeys.find(
      (k) => typeof chartData[0]?.[k] === "number"
    );

    if (!categoryKey || !valueKey) {
      console.error("Invalid data format for chart");
      return;
    }

    const data = {
      labels: chartData.map((d) => d[categoryKey]),
      datasets: [
        {
          label: visualization.title,
          data: chartData.map((d) => d[valueKey]),
          backgroundColor: "hsl(var(--primary))",
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: { color: "hsl(var(--muted-foreground))" },
          grid: { display: false },
        },
        y: {
          ticks: { color: "hsl(var(--muted-foreground))" },
          grid: { color: "hsl(var(--border))" },
        },
      },
    };

    chartInstanceRef.current = new ChartJS(ctx, {
      type: "bar",
      data: data,
      options: options,
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData, isLoading, error, visualization.title]);

  const handleShare = () => {
    toast({
      title: "Sharing chart...",
      description: "Generating image for download.",
    });
    downloadImage(
      cardRef.current,
      visualization.title.replace(/\s+/g, "_").toLowerCase()
    );
  };

  return (
    <Card ref={cardRef} className="flex flex-col">
      <CardHeader>
        <CardTitle>{visualization.title}</CardTitle>
        <CardDescription className="truncate text-xs">
          {visualization.sqlQuery}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 relative h-48">
        {isLoading && <div className="text-center">Loading chart data...</div>}
        {error && (
          <div className="text-center text-destructive">
            Failed to load chart data.
          </div>
        )}
        {chartData && chartData.length === 0 && (
          <div className="text-center text-muted-foreground">
            No data to display.
          </div>
        )}
        <canvas ref={canvasRef} />
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

"use client";

import useSWR from "swr";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartJSTooltip, // Alias Tooltip from chart.js
  Legend,
  BarController,
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
import { Download, Copy, Check, Trash } from "lucide-react"; // Import 'Copy' instead of 'CopyToClipboard'
import { useEffect, useRef } from "react";
import { downloadImage } from "../../lib/utils";
import { useToast } from "../../hooks/use-toast";
import { Chart } from "../../lib/types";
import * as api from "../../lib/api";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { copyToClipboard } from "../../lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartJSTooltip, // Use the aliased Tooltip here
  Legend,
  BarController
);

interface ChartCardProps {
  visualization: Chart;
  onDelete: (chartId: number) => void;
}

export function ChartCard({ visualization, onDelete }: ChartCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const {
    data: chartData,
    error,
    isLoading,
  } = useSWR(`/api/charts/${visualization.chart_id}/data`, () =>
    api.fetchChartData(visualization.chart_id)
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

    // Default to a bar chart, similar to test.html
    const data = {
      labels: chartData.map((d) => d[categoryKey]),
      datasets: [
        {
          label: visualization.title,
          data: chartData.map((d) => d[valueKey]),
          backgroundColor: "hsl(var(--primary))",
          borderColor: "hsl(var(--primary))",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y" as const, // Makes the bar chart horizontal as in test.html
      plugins: {
        legend: {
          display: true, // Display legend as in test.html
          position: "top" as const, // Position legend at top
          labels: {
            color: "hsl(var(--muted-foreground))",
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: "hsl(var(--background))",
          titleColor: "hsl(var(--foreground))",
          bodyColor: "hsl(var(--muted-foreground))",
          borderColor: "hsl(var(--border))",
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          ticks: { color: "hsl(var(--muted-foreground))" },
          grid: { color: "hsl(var(--border))" },
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

  const handleCopy = async () => {
    const success = await copyToClipboard(visualization.sqlQuery);
    if (success) {
      setIsCopied(true);
      toast({
        title: "SQL Query Copied!",
        description: "The SQL query has been copied to your clipboard.",
      });
      setTimeout(() => {
        setIsCopied(false);
        setTooltipOpen(false);
      }, 2000);
    } else {
      toast({
        title: "Copy Failed",
        description: "Could not copy SQL query to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteChart(visualization.chart_id);
      toast({
        title: "Chart Deleted!",
        description: "The chart has been successfully removed.",
      });
      onDelete(visualization.chart_id); // Notify parent component of deletion
    } catch (err) {
      toast({
        title: "Deletion Failed",
        description: "Could not delete the chart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card ref={cardRef} className="flex flex-col">
      <CardHeader>
        <CardTitle>{visualization.title}</CardTitle>
        <div className="flex items-center gap-2">
          <CardDescription className="truncate text-xs flex-1">
            {visualization.sqlQuery}
          </CardDescription>
          <TooltipProvider>
            <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleCopy}
                >
                  {isCopied ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" /> // Use the 'Copy' icon
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isCopied ? "Copied!" : "Copy SQL"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4 text-red-500" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

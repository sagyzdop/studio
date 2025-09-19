"use client";

import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { downloadImage } from "../../lib/utils";
import { Bot, Loader2, PlusCircle, Download } from "lucide-react";
import { useRef, useState, useEffect } from "react";
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
} from "recharts";
import { AddToDashboardModal } from "./add-to-dashboard-modal";
import { Dialog, DialogTrigger } from "../ui/dialog"; // Import Dialog and DialogTrigger

interface ChartDisplayProps {
  data: any | null;
  wsStatus: string; // Add wsStatus to the interface
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function ChartDisplay({ data, wsStatus }: ChartDisplayProps) {
  const [chartType, setChartType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const chartRef = useRef<HTMLDivElement>(null);
  const [isAddToDashboardModalOpen, setIsAddToDashboardModalOpen] = useState(false); // Add state for modal

  // Effect to set a default chart type when data is available
  useEffect(() => {
    if (data && data.results && data.results.length > 0) {
      setChartType("bar"); // Default to bar chart when data is received
    } else {
      setChartType(null); // Reset chart type if no data
    }
  }, [data]);


  const handleShare = () => {
    toast({
      title: "Sharing chart...",
      description: "Generating image for download.",
    });
    downloadImage(chartRef.current, "chat-visualization");
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4">
            AI is selecting the best chart for your data...
          </p>
        </div>
      );
    }

    if (!data || !data.results || !chartType) {
      return (
        <div className="text-center text-muted-foreground">
          <p>{wsStatus}</p>
          {/* Removed the simulate button */}
        </div>
      );
    }

    const dataKeys =
      data.results.length > 0 ? Object.keys(data.results[0]) : [];
    const categoryKey = dataKeys.find(
      (k) => typeof data.results[0]?.[k] === "string"
    );
    const valueKey = dataKeys.find(
      (k) => typeof data.results[0]?.[k] === "number"
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
      case "bar":
        chartComponent = (
          <BarChart data={data.results}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey={categoryKey}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Bar
              dataKey={valueKey}
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
        break;
      case "line":
        chartComponent = (
          <LineChart data={data.results}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey={categoryKey}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
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
      case "pie":
        chartComponent = (
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
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
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
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
      {!data && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Start a conversation to get a visualization</h3>
            <p className="mt-2 text-sm text-muted-foreground">{wsStatus}</p>
          </div>
        </div>
      )}
      {data && (
        <div className="w-full h-full flex flex-col">
          <div ref={chartRef} className="flex-1 p-4 bg-card">
            {renderChart()}
          </div>
          <div className="flex items-center justify-end gap-2 p-4 border-t">
            <Button variant="outline" onClick={handleShare}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Dialog open={isAddToDashboardModalOpen} onOpenChange={setIsAddToDashboardModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add to Dashboard
                </Button>
              </DialogTrigger>
              <AddToDashboardModal
                sqlQuery={data?.sqlQuery || ""}
                open={isAddToDashboardModalOpen}
                setOpen={setIsAddToDashboardModalOpen}
              />
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MarketData } from '@/features/trading/types';

interface ChartProps {
  data: MarketData[];
  symbol: string;
  height?: number;
  onTimeRangeChange?: (from: number, to: number) => void;
}

const timeRanges = [
  { value: '1D', label: '1 Day', minutes: 24 * 60 },
  { value: '1W', label: '1 Week', minutes: 7 * 24 * 60 },
  { value: '1M', label: '1 Month', minutes: 30 * 24 * 60 },
  { value: '3M', label: '3 Months', minutes: 90 * 24 * 60 },
  { value: '1Y', label: '1 Year', minutes: 365 * 24 * 60 },
];

export function Chart({ data, symbol, height = 400, onTimeRangeChange }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [candleSeries, setCandleSeries] = useState<ISeriesApi<"Candlestick"> | null>(null);
  const [volumeSeries, setVolumeSeries] = useState<ISeriesApi<"Histogram"> | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1D');

  useEffect(() => {
    if (chartContainerRef.current) {
      const chartInstance = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'white' },
          textColor: 'black',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        width: chartContainerRef.current.clientWidth,
        height,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      const candleSeriesInstance = chartInstance.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });

      const volumeSeriesInstance = chartInstance.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      setChart(chartInstance);
      setCandleSeries(candleSeriesInstance);
      setVolumeSeries(volumeSeriesInstance);

      const handleResize = () => {
        if (chartContainerRef.current) {
          chartInstance.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.remove();
      };
    }
  }, [height]);

  useEffect(() => {
    if (candleSeries && volumeSeries && data.length > 0) {
      const candleData = data.map(d => ({
        time: new Date(d.timestamp).getTime() / 1000 as Time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));

      const volumeData = data.map(d => ({
        time: new Date(d.timestamp).getTime() / 1000 as Time,
        value: d.volume,
        color: d.close >= d.open ? '#22c55e' : '#ef4444',
      }));

      candleSeries.setData(candleData);
      volumeSeries.setData(volumeData);

      // Set visible range based on selected time range
      const range = timeRanges.find(r => r.value === selectedTimeRange);
      if (range && chart) {
        const now = new Date().getTime() / 1000;
        const from = now - range.minutes * 60;
        chart.timeScale().setVisibleRange({
          from: from as Time,
          to: now as Time,
        });
      }
    }
  }, [data, candleSeries, volumeSeries, selectedTimeRange, chart]);

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    const range = timeRanges.find(r => r.value === value);
    if (range && chart) {
      const now = new Date().getTime() / 1000;
      const from = now - range.minutes * 60;
      chart.timeScale().setVisibleRange({
        from: from as Time,
        to: now as Time,
      });
      onTimeRangeChange?.(from, now);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{symbol}</h3>
        <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div ref={chartContainerRef} />
    </Card>
  );
} 
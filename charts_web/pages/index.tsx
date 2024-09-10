import { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './dashboard.css';

// Define types for your data
type CandlestickData = {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
};

type ChartData = {
  candlestick_chart: {
    data: CandlestickData[];
  };
  line_chart: {
    labels: string[];
    data: number[];
  };
  bar_chart: {
    labels: string[];
    data: number[];
  };
  pie_chart: {
    labels: string[];
    data: number[];
  };
};

function Dashboard() {
  // Use state with the correct type
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<SVGSVGElement | null>(null);

  // Fetch data from the backend
  useEffect(() => {
    fetch('http://localhost:8000/api/charts/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setChartData({
          ...data,
          candlestick_chart: {
            data: data.candlestick_chart.data.map((item: any) => ({
              date: new Date(item.x),
              open: item.open,
              high: item.high,
              low: item.low,
              close: item.close,
            })),
          },
        });
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        setError('Failed to load data');
      });
  }, []);

  // D3 Candlestick chart rendering logic
  useEffect(() => {
    if (!chartData) return;

    d3.select(chartRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 40 },
      width = 700 - margin.left - margin.right, 
      height = 300 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale (date)
    const x = d3.scaleTime()
      .domain(d3.extent(chartData.candlestick_chart.data, (d: CandlestickData) => d.date) as [Date, Date])
      .range([0, width]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Y scale (price)
    const y = d3.scaleLinear()
      .domain([
        d3.min(chartData.candlestick_chart.data, (d: CandlestickData) => d.low) || 0,
        d3.max(chartData.candlestick_chart.data, (d: CandlestickData) => d.high) || 0,
      ])
      .range([height, 0]);

    svg.append('g').call(d3.axisLeft(y));

    // Candlestick width
    const candlestickWidth = width / chartData.candlestick_chart.data.length / 1.8;

    // Draw wicks
    svg.selectAll('line.wick')
      .data(chartData.candlestick_chart.data)
      .enter()
      .append('line')
      .attr('class', 'wick')
      .attr('x1', (d: CandlestickData) => x(d.date))
      .attr('x2', (d: CandlestickData) => x(d.date))
      .attr('y1', (d: CandlestickData) => y(d.low))
      .attr('y2', (d: CandlestickData) => y(d.high))
      .attr('stroke', 'black');

    // Draw candle
    svg.selectAll('rect.candle')
      .data(chartData.candlestick_chart.data)
      .enter()
      .append('rect')
      .attr('class', 'candle')
      .attr('x', (d: CandlestickData) => x(d.date) - candlestickWidth / 2)
      .attr('y', (d: CandlestickData) => y(Math.max(d.open, d.close)))
      .attr('width', candlestickWidth)
      .attr('height', (d: CandlestickData) => Math.abs(y(d.open) - y(d.close)))
      .attr('fill', (d: CandlestickData) => (d.open > d.close ? '#e77373' : '#738fe7'))
      .attr('stroke', 'black');
  }, [chartData]);

  // Handle errors
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Display loading message if data is not yet available
  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      {/* 2x2 Grid for charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* Line Chart */}
        <div>
          <h2>Line Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.line_chart.labels.map((label, index) => ({
              name: label,
              value: chartData.line_chart.data[index],
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#738fe7" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div>
          <h2>Bar Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.bar_chart.labels.map((label, index) => ({
              name: label,
              value: chartData.bar_chart.data[index],
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#e5d957" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div>
          <h2>Pie Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.pie_chart.labels.map((label, index) => ({
                  name: label,
                  value: chartData.pie_chart.data[index],
                }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.pie_chart.labels.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={['#e77373', '#738fe7', '#e5d957'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Candlestick Chart */}
        <div>
          <h2>Candlestick Chart</h2>
            <div className="chart-container">
              <div ref={chartRef}></div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


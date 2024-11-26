// src/components/StockChart.tsx

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockChartProps {
  data: StockDataPoint[];
}

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            angle={-30} 
            textAnchor="end" 
            interval={0} 
            tick={{ fontSize: 10 }} 
            height={60}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(label: string) => `Date: ${label}`}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
            formatter={(value: number, name: string) => [`${name}: ${value}`]}
          />
          <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
          
          <Line type="monotone" dataKey="open" stroke="#82ca9d" name="Open" />
          <Line type="monotone" dataKey="high" stroke="#ffc658" name="High" />
          <Line type="monotone" dataKey="low" stroke="#ff7300" name="Low" />
          <Line type="monotone" dataKey="close" stroke="#8884d8" name="Close" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            angle={-30} 
            textAnchor="end" 
            interval={0} 
            tick={{ fontSize: 10 }} 
            height={60}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(label: string) => `Date: ${label}`}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
            formatter={(value: number, name: string) => [`${name}: ${value}`]}
          />
          <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
          <Bar dataKey="volume" fill="#413ea0" name="Volume" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
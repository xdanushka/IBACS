import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

interface DashboardStats {
  totalLocations: number;
}

interface ChartData {
  month: string;
  value: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({ totalLocations: 0 });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:5102/api/Locations')

      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
  
        const count = data.length;
        setStats({ totalLocations: count });
        
        
        setChartData([
          { month: 'Jan', value: count > 0 ? count - 2 : 0 },
          { month: 'Feb', value: count > 0 ? count - 1 : 0 },
          { month: 'Mar', value: count },
        ]);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching locations:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading-text">Loading Dashboard Data...</div>;

  return (
    <div className="dashboard-view">
      <header className="dashboard-header">
        <h1 className="text-3xl font-bold text-slate-800">Overview Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here is your live project summary.</p>
      </header>

      <div className="dashboard-grid mt-8">
        <div className="metric-card">
          <h3>Total System Locations</h3>
          <p className="metric-number">{stats.totalLocations}</p>
        </div>
      </div>

      <div className="chart-card-wrapper mt-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Locations Growth Analytics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

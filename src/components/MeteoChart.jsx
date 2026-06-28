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
  ComposedChart,
  Bar,
  Area
} from 'recharts';
import './MeteoChart.css';

export default function MeteoChart({ data, region, isLoading }) {
  if (isLoading) {
    return (
      <div className="chart-loading">
        Chargement du graphique...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
         Sélectionnez une région pour voir les tendances
      </div>
    );
  }

  // Calcul des statistiques
  const temps = data.map(d => d.temperature);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Tendance météo - {region}</h3>
        <div className="chart-stats">
          <span> Max: {maxTemp.toFixed(1)}°C</span>
          <span> Min: {minTemp.toFixed(1)}°C</span>
          <span> Moy: {avgTemp.toFixed(1)}°C</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="jour" />
          <YAxis yAxisId="left" domain={['auto', 'auto']} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
          <Tooltip />
          <Legend />

          <Area
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            name="Température"
            stroke="#ff6b6b"
            fill="#ff6b6b"
            fillOpacity={0.2}
            strokeWidth={2}
          />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            name="Tendance"
            stroke="#ff6b6b"
            strokeWidth={2}
            dot={{ r: 4 }}
          />

          <Bar
            yAxisId="right"
            dataKey="humidity"
            name="Humidité"
            fill="#4dabf7"
            barSize={20}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="chart-footer">
        ⚡ Données simulées sur 7 jours
      </div>
    </div>
  );
}
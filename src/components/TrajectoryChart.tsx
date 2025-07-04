
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrajectoryData {
  x: number;
  y: number;
  time: number;
}

interface TrajectoryChartProps {
  data: TrajectoryData[];
}

const TrajectoryChart = ({ data }: TrajectoryChartProps) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="x"
            label={{ value: 'Horizontal Position (m)', position: 'insideBottom', offset: -10 }}
            stroke="#666"
          />
          <YAxis 
            dataKey="y"
            label={{ value: 'Height (m)', angle: -90, position: 'insideLeft' }}
            stroke="#666"
          />
          <Tooltip 
            formatter={(value, name) => [
              `${value}m`,
              name === 'y' ? 'Height' : 'Position'
            ]}
            labelFormatter={(label) => `Position: ${label}m`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="y" 
            stroke="#16a34a"
            strokeWidth={3}
            dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#16a34a', strokeWidth: 2, fill: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrajectoryChart;

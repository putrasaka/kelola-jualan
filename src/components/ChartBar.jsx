// Bar Chart component - compare pemasukkan vs pengeluaran
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { prepareBarData, formatRupiah } from '../utils/chartHelpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 15,
      },
    },
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.dataset.label}: ${formatRupiah(context.raw)}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => {
          if (value >= 1000000) return `Rp${(value / 1000000).toFixed(0)}Jt`;
          if (value >= 1000) return `Rp${(value / 1000).toFixed(0)}Rb`;
          return `Rp${value}`;
        },
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const ChartBar = ({ chartData }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          📊 Pemasukkan vs Pengeluaran
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
          <p>Belum ada data untuk ditampilkan</p>
        </div>
      </div>
    );
  }

  const data = prepareBarData(chartData);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        📊 Pemasukkan vs Pengeluaran
      </h3>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartBar;

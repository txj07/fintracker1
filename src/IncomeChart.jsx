import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register required ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function IncomeChart({ transactions }) {
  // Filter only income transactions
  const incomes = transactions.filter(t => t.type === 'income');

  if (incomes.length === 0) {
    return <p>No income data to display</p>;
  }

  // Group incomes by month and category
  const monthlyData = incomes.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const category = transaction.category || 'Uncategorized';

    if (!acc[monthYear]) {
      acc[monthYear] = {};
    }

    if (!acc[monthYear][category]) {
      acc[monthYear][category] = 0;
    }

    acc[monthYear][category] += transaction.amount;
    return acc;
  }, {});

  // Get all unique months sorted chronologically
  const months = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));
  
  // Get all unique categories
  const categories = [...new Set(incomes.map(t => t.category || 'Uncategorized'))];

  // Generate consistent colors for each category
  const backgroundColors = [
    '#4BC0C0', '#9966FF', '#36A2EB', '#FFCE56', '#FF6384',
    '#8AC24A', '#FF9F40', '#EA5F89', '#00BBD3', '#F06292'
  ];

  // Prepare dataset for Chart.js
  const datasets = categories.map((category, index) => ({
    label: category,
    data: months.map(month => monthlyData[month][category] || 0),
    backgroundColor: backgroundColors[index % backgroundColors.length],
    borderColor: backgroundColors[index % backgroundColors.length],
    borderWidth: 1
  }));

  const data = {
    labels: months.map(month => {
      const [year, monthNum] = month.split('-');
      return new Date(year, monthNum - 1).toLocaleDateString('default', { 
        month: 'short', 
        year: '2-digit' 
      });
    }),
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false, // Set to true if you want stacked bars
        grid: {
          display: false
        }
      },
      y: {
        stacked: false, // Set to true if you want stacked bars
        beginAtZero: true,
        grid: {
          color: '#e0e0e0'
        },
        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ₹${value.toFixed(2)}`;
          }
        }
      },
      title: {
        display: true,
        text: 'Monthly Income',  // Chart title
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      }
    }
  };

  return (
    <div style={{ height: '400px' }}>
      <Bar 
        data={data} 
        options={options}
      />
    </div>
  );
}

export default IncomeChart;
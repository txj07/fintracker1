import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryChart({ transactions, type, budgets }) {
  // Filter transactions by type (expense/income)
  const filteredTransactions = transactions.filter((t) => t.type === type);

  if (filteredTransactions.length === 0) {
    return <p>No {type} data to display</p>;
  }

  // Group transactions by category
  const categoryData = filteredTransactions.reduce((acc, transaction) => {
    const category = transaction.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  // Get current month for budget comparison (only for expenses)
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentBudgets = type === 'expense' ? budgets.filter((b) => b.month === currentMonth) : [];

  // Prepare data for Chart.js
  const categories = Object.keys(categoryData);
  const amounts = Object.values(categoryData);
  const total = amounts.reduce((sum, amount) => sum + amount, 0);

  // Generate distinct colors for each category
  const backgroundColors = categories.map((_, index) => {
    const hue = (index * 137.508) % 360; // Golden angle approximation
    return `hsl(${hue}, 70%, 60%)`;
  });

  const data = {
    labels: categories.map((cat, i) => {
      const percentage = ((amounts[i] / total) * 100).toFixed(1);
      return `${cat} (${percentage}%)`;
    }),
    datasets: [
      {
        data: amounts,
        backgroundColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: `${type.charAt(0).toUpperCase() + type.slice(1)} by Category`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / total) * 100).toFixed(1);
            let tooltipText = `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
            if (type === 'expense') {
              const budget = currentBudgets.find((b) => b.category === label.split(' (')[0]);
              if (budget) {
                tooltipText += ` | Budget: ₹${budget.amount.toFixed(2)}`;
              }
            }
            return tooltipText;
          },
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
}

export default CategoryChart;

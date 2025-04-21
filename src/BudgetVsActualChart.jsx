import { useState, useMemo, memo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function BudgetVsActualChart({ transactions, budgets }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  // Generate year options (1950 to current year + 1)
  const years = Array.from(
    { length: currentYear - 1949 + 1 },
    (_, i) => 1950 + i
  );

  // Combine month and year for filtering
  const monthYear = `${year}-${month.toString().padStart(2, '0')}`;

  // Filter data for selected month
  const filteredBudgets = useMemo(() => {
    return budgets.filter((b) => b.month === monthYear);
  }, [budgets, monthYear]);

  const filteredExpenses = useMemo(() => {
    return transactions.filter(
      (t) => t.type === 'expense' && t.date.slice(0, 7) === monthYear
    );
  }, [transactions, monthYear]);

  // Calculate spending per category
  const spendingByCategory = useMemo(() => {
    return filteredExpenses.reduce((acc, t) => {
      const category = t.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {});
  }, [filteredExpenses]);

  // Prepare chart data
  const categories = [
    ...new Set([
      ...filteredBudgets.map((b) => b.category),
      ...Object.keys(spendingByCategory),
    ]),
  ];

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Budgeted (₹)',
        data: categories.map(
          (cat) => filteredBudgets.find((b) => b.category === cat)?.amount || 0
        ),
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        borderWidth: 1,
      },
      {
        label: 'Actual (₹)',
        data: categories.map((cat) => spendingByCategory[cat] || 0),
        backgroundColor: '#D32F2F',
        borderColor: '#B71C1C',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, family: 'Roboto' },
          color: '#2c3e50',
        },
      },
      title: {
        display: true,
        text: `Budget vs. Actual - ${MONTHS[month - 1]} ${year}`,
        font: { size: 18, family: 'Roboto', weight: '500' },
        color: '#2c3e50',
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#2c3e50',
        bodyColor: '#2c3e50',
        borderColor: '#e2e8f0',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#2c3e50', font: { family: 'Roboto' } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#2c3e50',
          font: { family: 'Roboto' },
          callback: (value) => `₹${value}`,
        },
        grid: { color: '#e2e8f0' },
      },
    },
  };

  return (
    <div className="card" role="region" aria-label="Budget vs Actual Chart">
      <h3 className="heading">Budget vs. Actual Comparison</h3>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ marginRight: '10px', fontWeight: '500', color: '#2c3e50' }}>
          Select Month/Year:
        </label>
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          className="form-select"
          aria-label="Select Month"
        >
          {MONTHS.map((monthName, index) => (
            <option key={index} value={index + 1}>
              {monthName}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="form-select"
          aria-label="Select Year"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {categories.length === 0 ? (
        <p style={{ color: '#666', margin: '10px 0' }} role="alert" aria-live="polite">
          No budget or expenses for {MONTHS[month - 1]} {year}.
        </p>
      ) : (
        <div style={{ height: '400px' }} role="region" aria-live="polite">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

export default memo(BudgetVsActualChart);

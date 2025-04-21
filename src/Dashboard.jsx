import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ transactions, budgets }) => {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  // Calculate totals
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Calculate budget and spending for current month
  const currentBudgets = budgets.filter((b) => b.month === currentMonth);
  const currentExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.slice(0, 7) === currentMonth
  );
  const totalBudgeted = currentBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = currentExpenses.reduce((sum, t) => sum + t.amount, 0);

  // Get category breakdown
  const expenseCategories = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const category = t.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {});

  // Prepare data for expense pie chart
  const expensePieData = {
    labels: Object.keys(expenseCategories),
    datasets: [{
      data: Object.values(expenseCategories),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC24A', '#EA5F89', '#00BBD3', '#F06292'
      ],
    }]
  };

  // Get most recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <div style={{ marginBottom: '40px' }}>
      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px', 
        marginBottom: '30px'
      }}>
        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#555' }}>Total Income</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4CAF50', margin: '10px 0 0' }}>
            ₹{totalIncome.toFixed(2)}
          </p>
        </div>

        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#555' }}>Total Expenses</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#F44336', margin: '10px 0 0' }}>
            ₹{totalExpenses.toFixed(2)}
          </p>
        </div>

        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#555' }}>Current Balance</h3>
          <p style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: balance >= 0 ? '#4CAF50' : '#F44336',
            margin: '10px 0 0'
          }}>
            ₹{balance.toFixed(2)}
          </p>
        </div>

        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#555' }}>Budget Status</h3>
          <p style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: totalSpent > totalBudgeted ? '#F44336' : '#4CAF50',
            margin: '10px 0 0'
          }}>
            ₹{totalSpent.toFixed(2)} / ₹{totalBudgeted.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts and Recent Transactions */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px'
      }}>
        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#555' }}>Expense Breakdown</h3>
          <div style={{ height: '300px' }}>
            <Pie 
              data={expensePieData} 
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.label}: ₹${context.raw.toFixed(2)} (${((context.raw / totalExpenses) * 100).toFixed(1)}%)`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        <div style={{ 
          background: '#fff',
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#555' }}>Recent Transactions</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#666' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#666' }}>Category</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', color: '#666' }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', color: '#666' }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 8px' }}>
                      {t.date ? new Date(t.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      {t.category || 'Uncategorized'}
                    </td>
                    <td style={{ 
                      padding: '12px 8px', 
                      textAlign: 'right',
                      color: t.type === 'income' ? '#4CAF50' : '#F44336',
                      fontWeight: '500'
                    }}>
                      ₹{t.amount?.toFixed(2) || '0.00'}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        background: t.type === 'income' ? '#E8F5E9' : '#FFEBEE',
                        color: t.type === 'income' ? '#4CAF50' : '#F44336',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.85em'
                      }}>
                        {t.type || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

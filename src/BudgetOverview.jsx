import { useState, useMemo, memo } from 'react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function BudgetOverview({ transactions, budgets }) {
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

  // Prepare budget overview data
  const overviewData = filteredBudgets.map((budget) => {
    const spent = spendingByCategory[budget.category] || 0;
    return {
      category: budget.category,
      budgeted: budget.amount,
      spent,
      remaining: budget.amount - spent,
    };
  });

  // Add uncategorized expenses
  Object.keys(spendingByCategory).forEach((category) => {
    if (!filteredBudgets.some((b) => b.category === category)) {
      overviewData.push({
        category,
        budgeted: 0,
        spent: spendingByCategory[category],
        remaining: -spendingByCategory[category],
      });
    }
  });

  return (
    <div className="card" role="region" aria-label="Budget Overview">
      <h3 className="heading">Budget Overview</h3>
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
      {overviewData.length === 0 ? (
        <p style={{ color: '#666', margin: '10px 0' }}>
          No budget or expenses for {MONTHS[month - 1]} {year}.
        </p>
      ) : (
        <div role="region" aria-live="polite">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px', textAlign: 'left', color: '#2c3e50' }}>Category</th>
                <th style={{ padding: '10px', textAlign: 'right', color: '#2c3e50' }}>Budgeted (₹)</th>
                <th style={{ padding: '10px', textAlign: 'right', color: '#2c3e50' }}>Spent (₹)</th>
                <th style={{ padding: '10px', textAlign: 'right', color: '#2c3e50' }}>Remaining (₹)</th>
              </tr>
            </thead>
            <tbody>
              {overviewData.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px' }}>{item.category}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    {item.budgeted.toFixed(2)}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    {item.spent.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      textAlign: 'right',
                      color: item.remaining >= 0 ? '#4CAF50' : '#D32F2F',
                      fontWeight: item.remaining < 0 ? 'bold' : 'normal',
                    }}
                  >
                    {item.remaining.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default memo(BudgetOverview);

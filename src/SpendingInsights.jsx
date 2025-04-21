import { memo } from 'react';

function SpendingInsights({ transactions, budgets }) {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  // Filter data for the current month
  const currentBudgets = budgets.filter((b) => b.month === currentMonth);
  const currentExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.slice(0, 7) === currentMonth
  );

  // Calculate actual spending per category
  const actualSpending = currentExpenses.reduce((acc, t) => {
    const category = t.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + t.amount;
    return acc;
  }, {});

  // Generate insights
  const insights = [];

  // 1. Overspending warnings
  currentBudgets.forEach((budget) => {
    const spent = actualSpending[budget.category] || 0;
    if (spent > budget.amount) {
      insights.push({
        type: 'warning',
        text: `You've exceeded your ${budget.category} budget by ₹${(spent - budget.amount).toFixed(2)}!`,
      });
    } else if (spent > budget.amount * 0.8) {
      insights.push({
        type: 'caution',
        text: `You're close to exceeding your ${budget.category} budget (₹${spent.toFixed(2)} of ₹${budget.amount.toFixed(2)} spent).`,
      });
    } else {
      insights.push({
        type: 'success',
        text: `You're within budget for ${budget.category}, with ₹${(budget.amount - spent).toFixed(2)} remaining.`,
      });
    }
  });

  // 2. High-spending category
  const topCategory = Object.entries(actualSpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 1)[0];
  if (topCategory) {
    insights.push({
      type: 'info',
      text: `${topCategory[0]} is your top spending category at ₹${topCategory[1].toFixed(2)}.`,
    });
  }

  // 3. Overall budget adherence
  const totalBudgeted = currentBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = currentExpenses.reduce((sum, t) => sum + t.amount, 0);
  if (totalBudgeted > 0) {
    if (totalSpent <= totalBudgeted) {
      insights.push({
        type: 'success',
        text: `Great job! Your total spending (₹${totalSpent.toFixed(2)}) is within your budget (₹${totalBudgeted.toFixed(2)}).`,
      });
    } else {
      insights.push({
        type: 'warning',
        text: `You've overspent by ₹${(totalSpent - totalBudgeted).toFixed(2)} across all categories.`,
      });
    }
  }

  // 4. No data case
  if (currentBudgets.length === 0 && currentExpenses.length === 0) {
    insights.push({
      type: 'info',
      text: 'No spending or budget data for this month. Set a budget to start tracking!',
    });
  }

  return (
    <div
      className="card"
      role="region"
      aria-label="Spending Insights"
    >
      <h3 className="heading">Spending Insights ({currentMonth})</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {insights.map((insight, index) => (
          <li
            key={index}
            style={{
              padding: '10px 0',
              borderBottom: index < insights.length - 1 ? '1px solid #e2e8f0' : 'none',
              color:
                insight.type === 'warning'
                  ? '#D32F2F'
                  : insight.type === 'caution'
                  ? '#FF9800'
                  : insight.type === 'success'
                  ? '#4CAF50'
                  : '#2c3e50',
              fontWeight: insight.type === 'warning' ? 'bold' : 'normal',
            }}
          >
            {insight.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(SpendingInsights);

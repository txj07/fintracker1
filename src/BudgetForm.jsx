import { useState, memo } from 'react';

const EXPENSE_CATEGORIES = ['Bills', 'Food', 'Transport', 'Rent', 'Other'];

function BudgetForm({ budgets, setBudgets }) {
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!month) {
      newErrors.month = 'Month is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const budgetData = {
      id: Date.now(),
      category,
      amount: parseFloat(amount),
      month,
    };

    const existingBudget = budgets.find(
      (b) => b.category === category && b.month === month
    );

    if (existingBudget) {
      setBudgets(
        budgets.map((b) =>
          b.category === category && b.month === month ? budgetData : b
        )
      );
    } else {
      setBudgets([...budgets, budgetData]);
    }

    setCategory(EXPENSE_CATEGORIES[0]);
    setAmount('');
    setMonth(new Date().toISOString().slice(0, 7));
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} role="form" aria-label="Set or Update Budget">
      <h3 className="heading">Set Monthly Budget</h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={styles.label}>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
          aria-label="Budget Category"
        >
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={styles.label}>Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
          min="0.01"
          step="0.01"
          placeholder="Enter amount"
          aria-label="Budget Amount"
        />
        {errors.amount && <div style={styles.error}>{errors.amount}</div>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={styles.label}>Month</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={styles.input}
          aria-label="Budget Month"
        />
        {errors.month && <div style={styles.error}>{errors.month}</div>}
      </div>

      <button type="submit" className="form-button">
        {budgets.some((b) => b.category === category && b.month === month)
          ? 'Update Budget'
          : 'Set Budget'}
      </button>
    </form>
  );
}

const styles = {
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#2c3e50',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    fontSize: '16px',
    boxSizing: 'border-box',
    background: '#fff',
  },
  error: {
    color: '#d32f2f',
    fontSize: '0.8rem',
    marginTop: '5px',
  },
};

export default memo(BudgetForm);

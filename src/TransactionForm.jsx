import { useState, useEffect, useCallback } from 'react';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other'];
const EXPENSE_CATEGORIES = ['Bills', 'Food', 'Transport', 'Rent', 'Other'];


function TransactionForm({ transactions, setTransactions, editingId, setEditingId, setToast }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (editingId) {
      const transaction = transactions.find((t) => t.id === editingId);
      if (transaction) {
        setFormData({
          type: transaction.type,
          amount: transaction.amount.toString(),
          category: transaction.category,
          date: transaction.date,
        });
      }
    }
  }, [editingId, transactions]);

  useEffect(() => {
    if (!editingId) {
      setFormData((prev) => ({
        ...prev,
        category: prev.type === 'income' ? 'Salary' : 'Food',
      }));
    }
  }, [formData.type, editingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const { type, amount, category, date } = formData;

      if (!type || !amount || !date || !category) {
        setToast('Please fill in all required fields');
        return;
      }
      if (isNaN(amount) || Number(amount) <= 0) {
        setToast('Amount must be a positive number');
        return;
      }

      const transaction = {
        id: editingId || Date.now().toString(),
        type,
        amount: Number(amount),
        category,
        date,
      };

      setTransactions((prev) => {
        const updated = editingId
          ? prev.map((t) => (t.id === editingId ? transaction : t))
          : [...prev, transaction];
        localStorage.setItem('transactions', JSON.stringify(updated));
        return updated;
      });

      setToast(editingId ? 'Transaction updated' : 'Transaction added');
      setEditingId(null);
      setFormData({
        type: 'expense',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().slice(0, 10),
      });
    },
    [formData, editingId, setTransactions, setEditingId, setToast]
  );

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      type: 'expense',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="transaction-form" role="form" aria-label="Transaction Form">
      <h3 className="heading">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ marginBottom: '0px' }}>
            <label style={styles.label}>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={styles.input}
              aria-label="Transaction Type"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div style={{ marginBottom: '0px' }}>
            <label style={styles.label}>Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter amount"
              aria-label="Transaction Amount"
              required
            />
          </div>

          <div style={{ marginBottom: '0px' }}>
            <label style={styles.label}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.input}
              aria-label="Transaction Category"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '0px' }}>
            <label style={styles.label}>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={styles.input}
              aria-label="Transaction Date"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className="form-button"
              disabled={!formData.type || !formData.amount || !formData.date || !formData.category}
              aria-label={editingId ? 'Update Transaction' : 'Add Transaction'}
            >
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="form-button"
                style={{ backgroundColor: '#D32F2F' }}
                aria-label="Cancel Edit"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

const styles = {
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#2c3e50',
    fontWeight: '500',
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
};

export default TransactionForm;

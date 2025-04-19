import { useState } from 'react';

const CATEGORIES = {
  expense: ['Bills', 'Food', 'Transport (Petrol)', 'Rent', 'Miscellaneous'],
  income: ['Salary', 'Bonus', 'Freelance', 'Investment', 'Other Income']
};

function TransactionForm({ transactions, setTransactions, editingId, setEditingId }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [errors, setErrors] = useState({});

  const editingTransaction = editingId 
    ? transactions.find(t => t.id === editingId)
    : null;

  if (editingTransaction && !amount) {
    setAmount(editingTransaction.amount.toString());
    setType(editingTransaction.type);
    setDate(editingTransaction.date || new Date().toISOString().split('T')[0]);
    setCategory(editingTransaction.category || CATEGORIES[editingTransaction.type][0]);
  }

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount)) {
      newErrors.amount = 'Amount must be a number';
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!date) {
      newErrors.date = 'Date is required';
    } else if (new Date(date) > new Date()) {
      newErrors.date = 'Date cannot be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    
    if (new Date(selectedDate) > new Date()) {
      setErrors({...errors, date: 'Date cannot be in the future'});
    } else if (errors.date) {
      const newErrors = {...errors};
      delete newErrors.date;
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (editingId !== null) {
      setTransactions(transactions.map(transaction => 
        transaction.id === editingId 
          ? { ...transaction, amount: parseFloat(amount), type, date, category }
          : transaction
      ));
      setEditingId(null);
    } else {
      const newTransaction = {
        id: Date.now(),
        amount: parseFloat(amount),
        type,
        date,
        category
      };
      setTransactions([...transactions, newTransaction]);
    }
    
    // Reset form
    setAmount('');
    setType('expense');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory(CATEGORIES.expense[0]);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Date</label>
        <input 
          type="date" 
          value={date}
          onChange={handleDateChange}
          style={styles.input}
          max={new Date().toISOString().split('T')[0]}
        />
        {errors.date && <div style={styles.error}>{errors.date}</div>}
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Type</label>
        <select 
          value={type} 
          onChange={handleTypeChange}
          style={styles.input}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        >
          {CATEGORIES[type].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      <div style={styles.formGroup}>
        <label style={styles.label}>Amount (₹)</label>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          style={styles.input}
          min="0.01"
          step="0.01"
        />
        {errors.amount && <div style={styles.error}>{errors.amount}</div>}
      </div>
      
      <button type="submit" style={styles.button}>
        {editingId !== null ? 'Update Transaction' : 'Add Transaction'}
      </button>
    </form>
  );
}

const styles = {
  form: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#45a049'
    }
  },
  error: {
    color: '#d32f2f',
    fontSize: '0.8rem',
    marginTop: '5px'
  }
};

export default TransactionForm;
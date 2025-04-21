import { useState, useEffect, useRef } from 'react';
import TransactionForm from './TransactionForm.jsx';
import TransactionList from './TransactionList.jsx';
import BudgetForm from './BudgetForm.jsx';
import BudgetOverview from './BudgetOverview.jsx';
import BudgetVsActualChart from './BudgetVsActualChart.jsx';
import SpendingInsights from './SpendingInsights.jsx';
import CategoryChart from './CategoryChart.jsx';
import Dashboard from './Dashboard.jsx';
import ExpenseChart from './ExpenseChart.jsx';
import IncomeChart from './IncomeChart.jsx';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingId, setEditingId] = useState(null);
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : [];
  });
  const [toast, setToast] = useState(null);
  const transactionFormRef = useRef(null);

  useEffect(() => {
    console.log('App transactions state updated:', transactions);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [transactions, budgets]);

  useEffect(() => {
    if (toast) {
      console.log('Toast displayed:', toast);
      const timer = setTimeout(() => {
        console.log('Toast cleared');
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (editingId !== null && transactionFormRef.current) {
      console.log('Editing ID set, scrolling to TransactionForm:', editingId);
      transactionFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [editingId]);

  const balance = transactions.reduce((total, transaction) => {
    return transaction.type === 'income'
      ? total + transaction.amount
      : total - transaction.amount;
  }, 0);

  return (
    <div className="App" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
      minHeight: '100vh'
    }}>
      <div className="container">
        <h1 style={{
          color: '#2c3e50',
          marginBottom: '20px',
          fontSize: '2.5rem',
          textAlign: 'center'
        }}>
          Personal Finance Tracker
        </h1>

        <div className="card">
          <span style={{ color: '#666' }}>Current Balance: </span>
          <span style={{
            fontWeight: 'bold',
            color: balance >= 0 ? '#4CAF50' : '#F44336',
            fontSize: '1.8rem'
          }}>
            ₹{balance.toFixed(2)}
          </span>
        </div>

        <div className="form-container">
          <div className="card">
            <BudgetForm budgets={budgets} setBudgets={setBudgets} />
          </div>
          <div className="card" ref={transactionFormRef}>
            <TransactionForm
              transactions={transactions}
              setTransactions={setTransactions}
              editingId={editingId}
              setEditingId={setEditingId}
              setToast={setToast}
            />
          </div>
        </div>

        <div className="card">
          <BudgetOverview transactions={transactions} budgets={budgets} />
        </div>

        <div className="card">
          <BudgetVsActualChart transactions={transactions} budgets={budgets} />
        </div>

        <div className="card">
          <Dashboard transactions={transactions} budgets={budgets} />
        </div>

        <div className="chart-container">
        
          <div className="card">
            <ExpenseChart transactions={transactions} />
          </div>
          <div className="card">
            <IncomeChart transactions={transactions} />
          </div>
        </div>

        <div className="card">
          <TransactionList
            transactions={transactions}
            setTransactions={setTransactions}
            setEditingId={setEditingId}
            transactionFormRef={transactionFormRef}
            setToast={setToast}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div className="card">
            <CategoryChart transactions={transactions} type="expense" budgets={budgets} />
          </div>
          <div className="card">
            <CategoryChart transactions={transactions} type="income" />
          </div>
        </div>

        <div className="card">
          <SpendingInsights transactions={transactions} budgets={budgets} />
        </div>

        {toast && (
          <div className="toast" role="alert" aria-live="polite">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

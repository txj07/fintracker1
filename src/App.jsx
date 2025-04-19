import { useState } from 'react';
import TransactionForm from './TransactionForm.jsx';
import TransactionList from './TransactionList.jsx';
import ExpenseChart from './ExpenseChart.jsx';
import IncomeChart from './IncomeChart.jsx';
import CategoryChart from './CategoryChart.jsx';
import Dashboard from './Dashboard.jsx';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const balance = transactions.reduce((total, transaction) => {
    return transaction.type === 'income' 
      ? total + transaction.amount 
      : total - transaction.amount;
  }, 0);

  return (
    <div className="App" style={{ 
      maxWidth: '100%',
      margin: '0',
      padding: '20px',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <div style={{
  width: '100%',
  padding: '0 300px',
  boxSizing: 'border-box'
}}>

        <h1 style={{ 
          color: '#2c3e50', 
          marginBottom: '20px',
          fontSize: '2.5rem',
          textAlign: 'center'
        }}>
          Personal Finance Tracker
        </h1>
        
        <div style={{ 
          margin: '20px 0', 
          fontSize: '1.5rem',
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <span style={{ color: '#666' }}>Current Balance: </span>
          <span style={{ 
            fontWeight: 'bold', 
            color: balance >= 0 ? '#4CAF50' : '#F44336',
            fontSize: '1.8rem'
          }}>
            ₹{balance.toFixed(2)}
          </span>
        </div>

        {/* Dashboard Component - Full width */}
        <div style={{ marginBottom: '30px' }}>
          <Dashboard transactions={transactions} />
        </div>

        {/* Main Content Area - Full width grid */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '25px',
          marginBottom: '30px'
        }}>
          {/* Left Column - Transaction Management */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '25px'
          }}>
            <div style={{ 
              background: 'white', 
              padding: '25px', 
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <TransactionForm 
                transactions={transactions}
                setTransactions={setTransactions}
                editingId={editingId}
                setEditingId={setEditingId}
              />
            </div>
            
            <div style={{ 
              background: 'white', 
              padding: '25px', 
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <TransactionList 
                transactions={transactions}
                setTransactions={setTransactions}
                setEditingId={setEditingId}
              />
            </div>
          </div>

          {/* Right Column - Charts */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '25px'
          }}>
            <div style={{ 
              background: 'white', 
              padding: '25px', 
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <ExpenseChart transactions={transactions} />
            </div>
            <div style={{ 
              background: 'white', 
              padding: '25px', 
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <IncomeChart transactions={transactions} />
            </div>
          </div>
        </div>

        {/* Category Charts - Full width row */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '25px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            background: 'white', 
            padding: '25px', 
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <CategoryChart transactions={transactions} type="expense" />
          </div>
          <div style={{ 
            background: 'white', 
            padding: '25px', 
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <CategoryChart transactions={transactions} type="income" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

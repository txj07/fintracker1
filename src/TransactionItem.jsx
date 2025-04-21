function TransactionItem({ transaction, setTransactions, setEditingId }) {
  const handleDelete = () => {
    setTransactions(prev => prev.filter(t => t.id !== transaction.id));
  };

  const handleEdit = () => {
    setEditingId(transaction.id);
  };

  return (
    <li 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #ccc',
        color: transaction.type === 'income' ? 'green' : 'red'
      }}
    >
      <div>
        <span style={{ marginRight: '10px', color: '#666' }}>
          {transaction.date}
        </span>
        {transaction.category} - ₹{transaction.amount.toFixed(2)}
      </div>
      <div>
        <button 
          onClick={handleEdit}
          style={{ marginRight: '10px', padding: '2px 5px' }}
        >
          Edit
        </button>
        <button 
          onClick={handleDelete}
          style={{ padding: '2px 5px' }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TransactionItem;

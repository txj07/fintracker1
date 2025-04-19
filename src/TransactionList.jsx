import { useState, useEffect } from 'react';
import TransactionItem from './TransactionItem';

function TransactionList({ transactions, setTransactions, setEditingId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Sort transactions by creation time (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => b.id - a.id);

  // Reset to first page when transactions change
  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const currentTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2 style={{ marginBottom: '15px', color: '#F2F3F5' }}>Transactions List</h2>
      
      {currentTransactions.length === 0 ? (
        <p style={{ color: '#666' }}>No transactions yet</p>
      ) : (
        <>
          {/* Table Headings */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
            padding: '10px 15px',
            backgroundColor: '#000000',
            borderRadius: '5px',
            marginBottom: '8px',
            fontWeight: 'bold',
            borderBottom: '2px solid #ddd'
          }}>
            <div>Date</div>
            <div>Category</div>
            <div>Amount</div>
          </div>

          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            marginBottom: '15px'
          }}>
            {currentTransactions.map(transaction => (
              <TransactionItem 
                key={transaction.id}
                transaction={transaction}
                setTransactions={setTransactions}
                setEditingId={setEditingId}
              />
            ))}
          </ul>

          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px'
            }}>
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                style={{
                  padding: '5px 10px',
                  backgroundColor: currentPage === 1 ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>

              <span style={{ color: '#666' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                  padding: '5px 10px',
                  backgroundColor: currentPage === totalPages ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TransactionList;
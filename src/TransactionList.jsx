import { useState, useCallback } from 'react';

function TransactionList({ transactions, setTransactions, setEditingId, transactionFormRef, setToast }) {
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Sort transactions by date (newest first), then by id for same dates
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateB !== dateA) return dateB - dateA; // Newest date first
    return parseInt(b.id, 10) - parseInt(a.id, 10); // Newest id for same date
  });

  // Calculate transactions to display
  const totalPages = Math.ceil(sortedTransactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(startIndex, endIndex);

  console.log('TransactionList received transactions:', transactions);
  console.log('Sorted transactions (newest first):', sortedTransactions);
  console.log('Current page:', currentPage, 'Showing:', currentTransactions);

  const handleDelete = useCallback(
    (id) => {
      setTransactions((prev) => {
        const updated = prev.filter((t) => t.id !== id);
        console.log('Deleted transaction, new transactions:', updated);
        return updated;
      });
      setToast('Transaction deleted successfully');
      // Adjust page if necessary
      if (currentTransactions.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    },
    [setTransactions, setToast, currentTransactions, currentPage]
  );

  const handleEdit = useCallback(
    (id) => {
      setEditingId(id);
      if (transactionFormRef.current) {
        transactionFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [setEditingId, transactionFormRef]
  );

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      console.log('Navigated to page:', currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      console.log('Navigated to page:', currentPage - 1);
    }
  }, [currentPage]);

  return (
    <div role="region" aria-label="Transaction List">
      <h3 className="heading">Transaction History</h3>
      {sortedTransactions.length === 0 ? (
        <p style={{ color: '#666', margin: '10px 0' }} role="alert" aria-live="polite">
          No transactions available.
        </p>
      ) : (
        <>
          <div className="transaction-list">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} role="list">
              {currentTransactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="transaction-item"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    borderBottom: '1px solid #e2e8f0',
                    background: '#fff',
                    marginBottom: '5px',
                    borderRadius: '4px',
                  }}
                  role="listitem"
                >
                  <div>
                    <span style={{ fontWeight: '500', color: '#2c3e50' }}>
                      {transaction.category} ({transaction.type})
                    </span>
                    <span
                      style={{
                        marginLeft: '10px',
                        color: transaction.type === 'income' ? '#4CAF50' : '#D32F2F',
                      }}
                    >
                      ₹{transaction.amount.toFixed(2)}
                    </span>
                    <span style={{ marginLeft: '10px', color: '#666' }}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                    {transaction.description && (
                      <span style={{ marginLeft: '10px', color: '#666' }}>
                        - {transaction.description}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleEdit(transaction.id)}
                      className="form-button"
                      style={{ backgroundColor: '#2196F3', padding: '8px 16px' }}
                      aria-label={`Edit transaction ${transaction.category}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="form-button"
                      style={{ backgroundColor: '#D32F2F', padding: '8px 16px' }}
                      aria-label={`Delete transaction ${transaction.category}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="pagination"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '20px',
            }}
          >
            <button
              onClick={handlePrevious}
              className="pagination-button"
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </button>
            <span
              style={{ alignSelf: 'center', color: '#2c3e50' }}
              aria-live="polite"
            >
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              className="pagination-button"
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TransactionList;

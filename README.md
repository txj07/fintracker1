# Personal Finance Tracker 

A responsive web application to track income and expenses with visual analytics.

## Features 

- **Transaction Management**:
  - Add, edit, and delete transactions
  - Categorize transactions (Bills, Food, Transport, etc.)
  - Track income and expenses separately

- **Dashboard Overview**:
  - Real-time balance calculation
  - Income/expense summary cards
  - Recent transactions list

- **Visual Analytics**:
  - Monthly expense/income bar charts
  - Category-wise pie charts
  - Expense breakdown visualization

- **User Experience**:
  - Clean, responsive interface
  - Form validation
  - Paginated transaction list
  - Color-coded transaction types

## Technologies Used 🛠️

- **Frontend**:
  - React.js
  - Chart.js (for data visualization)
  - React-Chartjs-2 (Chart.js wrapper for React)
  - CSS-in-JS (for styling)

## Installation 💻

1. Clone the repository:
   ```bash
   git clone https://github.com/txj07/fintracker1.git

2. Navigate to the project directory:
   ```bash
   cd path
3. Install Dependencies:
   ```bash
   npm install
4. Start the development Server:
    ```bash
    npm start
5. Open http://localhost:3000 in your browser.

Project Structure
src/
├── components/
│   ├── Dashboard.jsx       # Main dashboard with summary cards
│   ├── TransactionForm.jsx # Form for adding/editing transactions
│   ├── TransactionList.jsx # List of transactions with pagination
│   ├── TransactionItem.jsx # Individual transaction component
│   ├── ExpenseChart.jsx    # Monthly expense visualization
│   ├── IncomeChart.jsx     # Monthly income visualization
│   └── CategoryChart.jsx   # Category breakdown charts
├── App.js                  # Main application component
└── index.js                # Application entry point


Usage Guide
   
1. Adding Transactions:
 - Fill out the transaction form with date, type, category, and amount
 - Click "Add Transaction" to save

2. Editing Transactions:
 - Click the "Edit" button on any transaction
 - Modify the details in the form
 - Click "Update Transaction" to save changes

3. Viewing Analytics:
 - Dashboard shows current balance and summary
 - Charts display spending patterns and category breakdowns
 - Recent transactions are listed with pagination

License 📄
This project is licensed under the MIT License - see the LICENSE file for details.

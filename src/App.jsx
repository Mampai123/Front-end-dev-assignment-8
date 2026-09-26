import { useState, useEffect } from 'react';
import { Plus, Download, LayoutDashboard, List, PieChart as PieChartIcon } from 'lucide-react';
import './App.css';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'transactions'

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
    setIsModalOpen(false);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const exportCSV = () => {
    if (transactions.length === 0) return;
    
    const headers = ['ID', 'Date', 'Type', 'Category', 'Amount', 'Description'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => 
        [t.id, t.date, t.type, t.category, t.amount, `"${t.description || ''}"`].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('url');
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense_tracker_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>FinanceFlow</h1>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={exportCSV}>
            <Download size={18} />
            Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Add Record
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button 
          className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>
        <button 
          className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('transactions')}
        >
          <List size={18} /> Transactions
        </button>
      </div>

      <main>
        {activeTab === 'dashboard' ? (
          <Dashboard transactions={transactions} />
        ) : (
          <div className="glass-panel">
            <h2 style={{ marginBottom: '24px' }}>All Transactions</h2>
            <TransactionList 
              transactions={transactions} 
              onDelete={deleteTransaction} 
            />
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Record</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            <TransactionForm 
              onSubmit={addTransaction} 
              onCancel={() => setIsModalOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

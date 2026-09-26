import { useState, useMemo } from 'react';
import { Trash2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { format } from 'date-fns';

const ALL_CATEGORIES = [
  'Housing', 'Food', 'Transportation', 'Utilities', 'Insurance', 'Medical & Healthcare', 
  'Saving, Investing, & Debt Payments', 'Personal Spending', 'Recreation & Entertainment', 
  'Miscellaneous', 'Salary', 'Freelance', 'Investments', 'Gift', 'Other'
];

function TransactionList({ transactions, onDelete }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
      const matchesSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [transactions, filterCategory, searchTerm]);

  return (
    <div>
      <div className="filters-bar">
        <input 
          type="text" 
          className="form-control search-input" 
          placeholder="Search descriptions or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="form-control" 
          style={{ width: 'auto' }}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {ALL_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="transaction-list">
        {filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            No transactions found.
          </div>
        ) : (
          filteredTransactions.map(t => (
            <div key={t.id} className="transaction-item">
              <div className="transaction-info">
                <div className={`transaction-icon ${t.type}`}>
                  {t.type === 'income' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                </div>
                <div className="transaction-details">
                  <h4>{t.category}</h4>
                  <p>{t.description ? `${t.description} • ` : ''}{format(new Date(t.date), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="transaction-amount-actions">
                <span className={`amount ${t.type}`}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                </span>
                <button 
                  className="btn btn-danger" 
                  style={{ padding: '8px' }} 
                  onClick={() => onDelete(t.id)}
                  title="Delete Record"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TransactionList;

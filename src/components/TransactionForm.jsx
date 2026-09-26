import { useState } from 'react';

const CATEGORIES = {
  expense: ['Housing', 'Food', 'Transportation', 'Utilities', 'Insurance', 'Medical & Healthcare', 'Saving, Investing, & Debt Payments', 'Personal Spending', 'Recreation & Entertainment', 'Miscellaneous'],
  income: ['Salary', 'Freelance', 'Investments', 'Gift', 'Other']
};

function TransactionForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: CATEGORIES.expense[0],
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        category: CATEGORIES[value][0] // Reset category when type changes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || isNaN(formData.amount)) return;
    
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Type</label>
        <select 
          className="form-control" 
          name="type" 
          value={formData.type} 
          onChange={handleChange}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="form-group">
        <label>Amount (₹)</label>
        <input 
          type="number" 
          className="form-control" 
          name="amount" 
          value={formData.amount} 
          onChange={handleChange}
          required
          min="0.01"
          step="0.01"
          placeholder="0.00"
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select 
          className="form-control" 
          name="category" 
          value={formData.category} 
          onChange={handleChange}
        >
          {CATEGORIES[formData.type].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Date</label>
        <input 
          type="date" 
          className="form-control" 
          name="date" 
          value={formData.date} 
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Description (Optional)</label>
        <input 
          type="text" 
          className="form-control" 
          name="description" 
          value={formData.description} 
          onChange={handleChange}
          placeholder="What was this for?"
        />
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
        <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
          Save Record
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;

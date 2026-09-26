import { useMemo, useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#64748b', '#06b6d4'];

function Dashboard({ transactions }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return format(new Date(), 'yyyy-MM');
  });

  const monthOptions = useMemo(() => {
    if (transactions.length === 0) {
      return [format(new Date(), 'yyyy-MM')];
    }
    const months = new Set(transactions.map(t => t.date.substring(0, 7)));
    months.add(format(new Date(), 'yyyy-MM'));
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const monthlyTransactions = useMemo(() => {
    if (!selectedMonth) return [];
    
    const [year, month] = selectedMonth.split('-');
    const startDate = startOfMonth(new Date(parseInt(year), parseInt(month) - 1));
    const endDate = endOfMonth(new Date(parseInt(year), parseInt(month) - 1));
    
    return transactions.filter(t => {
      const date = parseISO(t.date);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  }, [transactions, selectedMonth]);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    
    monthlyTransactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });

    return { income, expense, balance: income - expense };
  }, [monthlyTransactions]);

  const categoryData = useMemo(() => {
    const expenses = monthlyTransactions.filter(t => t.type === 'expense');
    const grouped = {};
    
    expenses.forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });

    return Object.keys(grouped).map(key => ({
      name: key,
      value: grouped[key]
    })).sort((a, b) => b.value - a.value);
  }, [monthlyTransactions]);

  const dailyData = useMemo(() => {
    const expenses = monthlyTransactions.filter(t => t.type === 'expense');
    const grouped = {};
    
    expenses.forEach(t => {
      grouped[t.date] = (grouped[t.date] || 0) + t.amount;
    });

    return Object.keys(grouped).sort().map(date => ({
      date: format(parseISO(date), 'dd MMM'),
      amount: grouped[date]
    }));
  }, [monthlyTransactions]);

  const barData = [
    { name: 'Income', amount: summary.income, fill: 'var(--success)' },
    { name: 'Expense', amount: summary.expense, fill: 'var(--danger)' }
  ];

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Dashboard</h2>
        <select 
          className="form-control" 
          style={{ width: 'auto' }}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {monthOptions.map(m => (
            <option key={m} value={m}>{format(parseISO(`${m}-01`), 'MMMM yyyy')}</option>
          ))}
        </select>
      </div>

      <div className="summary-cards">
        <div className="summary-card total-balance">
          <p>Total Balance</p>
          <h3>₹{summary.balance.toFixed(2)}</h3>
        </div>
        <div className="summary-card total-income">
          <p>Monthly Income</p>
          <h3>₹{summary.income.toFixed(2)}</h3>
        </div>
        <div className="summary-card total-expense">
          <p>Monthly Expense</p>
          <h3>₹{summary.expense.toFixed(2)}</h3>
        </div>
      </div>

      <div className="charts-section">
        <div className="charts-row">
          <div className="glass-panel">
            <h3 style={{ marginBottom: '16px' }}>Expenses by Category</h3>
            <div className="chart-container">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `₹${value.toFixed(2)}`}
                      contentStyle={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                  No expenses this month
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel">
            <h3 style={{ marginBottom: '16px' }}>Income vs Expense</h3>
            <div className="chart-container">
              {(summary.income > 0 || summary.expense > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip 
                      formatter={(value) => `₹${value.toFixed(2)}`}
                      cursor={{ fill: 'var(--bg-secondary)' }}
                      contentStyle={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                  No data for this month
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-panel">
          <h3 style={{ marginBottom: '16px' }}>Daily Expense Trend</h3>
          <div className="chart-container" style={{ height: '350px' }}>
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip 
                    formatter={(value) => `₹${value.toFixed(2)}`}
                    contentStyle={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="var(--primary)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                No expenses to show trend
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import { useState, useEffect } from 'react';
import { getExpenses, addExpense, deleteExpense } from '../services/api';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Education', 'Entertainment', 'Utilities', 'Other'];

const CATEGORY_COLORS = {
    Food: 'cat-food', Transport: 'cat-transport', Shopping: 'cat-shopping',
    Health: 'cat-health', Education: 'cat-education', Entertainment: 'cat-entertainment',
    Utilities: 'cat-utilities', Other: 'cat-other',
};

const emptyForm = { title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] };

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchAll = () => {
        setLoading(true);
        getExpenses()
            .then(({ data }) => setExpenses(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchAll(); }, []);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.title.trim() || !form.amount) { setError('Title and amount are required.'); return; }
        setSaving(true);
        try {
            await addExpense({ ...form, amount: parseFloat(form.amount) });
            setForm(emptyForm);
            fetchAll();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add expense.');
        } finally {
            setSaving(false);
        }
    };

    const onDelete = async (id) => {
        if (!confirm('Delete this expense?')) return;
        try {
            await deleteExpense(id);
            setExpenses(prev => prev.filter(e => e._id !== id));
        } catch { /* noop */ }
    };

    const filtered = filter === 'All' ? expenses : expenses.filter(e => e.category === filter);
    const total = filtered.reduce((s, e) => s + e.amount, 0);

    return (
        <div className="page fade-up">
            <h1 className="page-title">Expenses</h1>
            <p className="page-subtitle">Track, add, and manage your expenses</p>

            {/* Add expense form */}
            <div className="form-panel">
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>➕ Add New Expense</h3>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={onSubmit}>
                    <div className="form-row">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label htmlFor="title">Description</label>
                            <input id="title" name="title" placeholder="e.g. Lunch at cafe" value={form.title} onChange={onChange} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label htmlFor="amount">Amount (₹)</label>
                            <input id="amount" name="amount" type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row mt-1">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label htmlFor="category">Category</label>
                            <select id="category" name="category" value={form.category} onChange={onChange}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label htmlFor="date">Date</label>
                            <input id="date" name="date" type="date" value={form.date} onChange={onChange} />
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Adding…' : '+ Add Expense'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Filter bar */}
            <div className="filter-bar">
                {['All', ...CATEGORIES].map(cat => (
                    <button
                        key={cat}
                        className={`filter-pill${filter === cat ? ' active' : ''}`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Section header */}
            <div className="section-header">
                <h2>
                    {filter === 'All' ? 'All Expenses' : filter}
                    <span className="count" style={{ marginLeft: '0.6rem' }}>{filtered.length}</span>
                </h2>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.95rem' }}>
                    Total: <span style={{ color: 'var(--danger)' }}>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="spinner" />
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="emoji">🔍</div>
                    <h3>No expenses found</h3>
                    <p>{filter === 'All' ? 'Add your first expense above.' : `No ${filter} expenses yet.`}</p>
                </div>
            ) : (
                <div className="expense-list">
                    {filtered.map(exp => (
                        <div key={exp._id} className="expense-row">
                            <div className="ex-left">
                                <span className={`category-badge ${CATEGORY_COLORS[exp.category] || 'cat-other'}`}>
                                    {exp.category}
                                </span>
                                <div>
                                    <div className="expense-title">{exp.title}</div>
                                    <div className="expense-date">{new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="expense-amount">−₹{exp.amount.toLocaleString('en-IN')}</div>
                                <button className="btn btn-danger btn-sm" onClick={() => onDelete(exp._id)}>🗑</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

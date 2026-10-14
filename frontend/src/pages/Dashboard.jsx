import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getExpenses } from '../services/api';
import { useAuth } from '../context/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS = {
    Food: '#10b981',
    Transport: '#3b82f6',
    Shopping: '#f59e0b',
    Health: '#ef4444',
    Education: '#8b5cf6',
    Entertainment: '#ec4899',
    Utilities: '#14b8a6',
    Other: '#6b7280',
};

function SummaryCard({ label, amount, icon, colorClass }) {
    return (
        <div className={`summary-card ${colorClass}`}>
            <div className="icon">{icon}</div>
            <div className="label">{label}</div>
            <div className="amount">
                ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { username } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getExpenses()
            .then(({ data }) => setExpenses(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const total = expenses.reduce((s, e) => s + e.amount, 0);

    // This month
    const now = new Date();
    const thisMonth = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthTotal = thisMonth.reduce((s, e) => s + e.amount, 0);

    // By category
    const byCategory = expenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
    }, {});

    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

    // Chart data
    const chartData = {
        labels: Object.keys(byCategory),
        datasets: [{
            data: Object.values(byCategory),
            backgroundColor: Object.keys(byCategory).map(c => CATEGORY_COLORS[c] || '#6b7280'),
            borderColor: '#1c2230',
            borderWidth: 3,
            hoverOffset: 8,
        }],
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#8b949e',
                    font: { family: 'Inter', size: 12 },
                    padding: 14,
                    usePointStyle: true,
                    pointStyleWidth: 8,
                },
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => ` ₹${ctx.raw.toLocaleString('en-IN')}`,
                },
            },
        },
        cutout: '68%',
    };

    const recent = [...expenses].slice(0, 5);

    if (loading) return <div className="spinner" />;

    return (
        <div className="page fade-up">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
                Welcome back, <strong>{username}</strong>! Here's your financial overview.
            </p>

            {/* Summary Cards */}
            <div className="card-grid mb-2">
                <SummaryCard label="Total Spent" amount={total} icon="💸" colorClass="purple" />
                <SummaryCard label="This Month" amount={monthTotal} icon="📅" colorClass="orange" />
                <SummaryCard label="Transactions" amount={expenses.length} icon="🧾" colorClass="green" />
                <div className={`summary-card red`}>
                    <div className="icon">🏆</div>
                    <div className="label">Top Category</div>
                    <div className="amount" style={{ fontSize: '1.3rem' }}>
                        {topCategory ? topCategory[0] : '—'}
                    </div>
                </div>
            </div>

            {/* Chart + Recent */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.25rem' }}>
                {/* Pie chart */}
                <div className="card">
                    <div className="section-header">
                        <h2>By Category</h2>
                    </div>
                    {expenses.length === 0 ? (
                        <div className="empty-state">
                            <div className="emoji">📊</div>
                            <h3>No data yet</h3>
                            <p>Add expenses to see the chart</p>
                        </div>
                    ) : (
                        <div className="chart-wrap">
                            <Doughnut data={chartData} options={chartOptions} />
                        </div>
                    )}
                </div>

                {/* Recent expenses */}
                <div className="card">
                    <div className="section-header">
                        <h2>Recent Expenses</h2>
                        <Link to="/expenses" className="btn btn-ghost btn-sm">View all →</Link>
                    </div>
                    {recent.length === 0 ? (
                        <div className="empty-state">
                            <div className="emoji">🧾</div>
                            <h3>No expenses yet</h3>
                            <Link to="/expenses" className="btn btn-primary btn-sm mt-1">Add your first</Link>
                        </div>
                    ) : (
                        <div className="expense-list">
                            {recent.map(exp => (
                                <div key={exp._id} className="expense-row">
                                    <div className="ex-left">
                                        <span
                                            className={`category-badge cat-${exp.category.toLowerCase()}`}
                                        >
                                            {exp.category}
                                        </span>
                                        <div>
                                            <div className="expense-title">{exp.title}</div>
                                            <div className="expense-date">
                                                {new Date(exp.date).toLocaleDateString('en-IN')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="expense-amount">
                                        −₹{exp.amount.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, username, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = username
        ? username.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'BB';

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="nav-brand">
                    <span style={{ fontSize: '1.4rem' }}>💰</span>
                    Budget<span className="dot">Buddy</span>
                </div>

                {user && (
                    <>
                        <div className="nav-links">
                            <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                                📊 Dashboard
                            </NavLink>
                            <NavLink to="/expenses" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                                📋 Expenses
                            </NavLink>
                        </div>

                        <div className="nav-user">
                            <div className="avatar" title={username}>{initials}</div>
                            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import '../../styles/AdminPanel.css';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path) => currentPath === path;

    const handleClose = async () => {
        try {
            const response = await fetch('http://localhost:8080/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok || response.status === 302) {
                navigate('/');
            } else {
                alert("Не вдалося вийти з системи");
            }
        } catch (err) {
            console.error("Logout error:", err);
            alert("Помилка при виході");
        }
    };

    return (
        <header className="admin-navbar">
            <div className="admin-logo" onClick={() => navigate('/admin')}>AdminPanel</div>

            <div className="admin-nav-tabs">
                <button
                    className={`admin-nav-button ${isActive('/admin/menu') ? 'active' : ''}`}
                    onClick={() => navigate('/admin/menu')}
                >🍽 Меню</button>

                <button
                    className={`admin-nav-button ${isActive('/admin/cooks') ? 'active' : ''}`}
                    onClick={() => navigate('/admin/cooks')}
                >👨‍🍳 Кухарі</button>

                <button
                    className={`admin-nav-button ${isActive('/admin/orders') ? 'active' : ''}`}
                    onClick={() => navigate('/admin/orders')}
                >🧾 Замовлення</button>

                <button
                    className={`admin-nav-button ${isActive('/admin/reviews') ? 'active' : ''}`}
                    onClick={() => navigate('/admin/reviews')}
                >⭐ Відгуки</button>
            </div>

            <button onClick={handleClose} className="close-admin-btn">🔒 Закрити адмін-панель</button>
        </header>
    );
};

export default AdminNavbar;

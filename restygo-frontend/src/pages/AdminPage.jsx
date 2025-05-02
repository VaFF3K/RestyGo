import React, {useEffect, useState} from 'react';
import DishManager from '../components/admin/DishManager';
import CookManager from '../components/admin/CookManager';
import {useLocation, useNavigate} from "react-router-dom";

function AdminPage() {
    const [active, setActive] = useState('dishes');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const tab = query.get('tab');
        if (tab) setActive(tab);
    }, [location]);

    const handleLogoutAndExit = async () => {
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
        <div>
            <h2>Панель адміністратора</h2>
            <button onClick={handleLogoutAndExit} style={{ float: 'right' }}>
                🔒 Закрити адмін-панель
            </button>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setActive('dishes')}>🍽 Меню</button>
                <button onClick={() => setActive('cooks')}>👨‍🍳 Кухарі</button>
                <button onClick={() => setActive('orders')}>🧾 Замовлення</button>
            </div>

            {active === 'dishes' && <DishManager />}
            {active === 'cooks' && ( <CookManager />)}
            {active === 'orders' && (
                <div>
                    <h3>Замовлення (в розробці)</h3>
                </div>
            )}
        </div>
    );
}

export default AdminPage;

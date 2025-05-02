// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/NavbarClient.css';


function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [fullName, setFullName] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/user/me', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => {
                setFullName(data.fullName);
                setRole(data.role); // Клієнт / Кухар / Адмін
            })
            .catch(() => {
                setFullName(null);
                setRole(null);
            });
    }, []);

    const handleLogout = async () => {
        await fetch('http://localhost:8080/logout', {
            method: 'POST',
            credentials: 'include',
        });
        window.location.href = '/';
    };

    const getThemeColor = () => {
        if (role === 'COOK') return '#17263D'; // блакитний
        if (role === 'ADMIN') return '#1E1E1E'; // нуар
        return '#BF772F'; // клієнт
    };

    return (
        <div className="navbar" style={{ backgroundColor: getThemeColor() }}>
            <div className="nav-logo" onClick={() => navigate('/')}>RestyGO</div>
            <div className="nav-links">
                <button onClick={() => navigate('/?tab=menu')}>📋 Меню</button>
                <button onClick={() => navigate('/?tab=orders')}>🧾 Замовлення</button>
                <button onClick={() => navigate('/?tab=reviews')}>⭐ Відгуки</button>
            </div>
            <div className="auth-section">
                {fullName ? (
                    <>
                        <span>{fullName}</span>
                        <button onClick={() => navigate('/profile')}>Профіль</button>
                        <button onClick={handleLogout}>Вийти</button>
                    </>
                ) : (
                    <button onClick={() => navigate('/auth')}>Авторизація</button>
                )}
            </div>
        </div>
    );
}

export default Navbar;

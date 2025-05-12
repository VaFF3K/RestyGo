import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Navbar.css';

function ClientNavbar() {
    const [fullName, setFullName] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetch('http://localhost:8080/api/user/me', {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) throw new Error('Не авторизовано');
                return res.json();
            })
            .then(data => setFullName(data.fullName))
            .catch(() => setFullName(null));
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok || response.status === 204) {
                window.location.href = '/';
            }
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <header className="home-header">
            <div className="logo" onClick={() => navigate('/')}>RestyGO</div>
            <div className="nav-tabs">
                <button onClick={() => navigate('/?tab=menu')}>📋 Меню</button>
                <button onClick={() => navigate('/?tab=orders')}>🧾 Замовлення</button>
                <button onClick={() => navigate('/?tab=reviews')}>⭐ Відгуки</button>
            </div>
            <div className="auth-block">
                {fullName ? (
                    <>
                        <span>Авторизовано як: {fullName}</span>
                        <button onClick={() => navigate('/profile')}>Профіль</button>
                        <button onClick={handleLogout}>Вийти</button>
                    </>
                ) : (
                    <button onClick={() => navigate('/auth')}>Авторизація</button>
                )}
            </div>
        </header>
    );
}

export default ClientNavbar;

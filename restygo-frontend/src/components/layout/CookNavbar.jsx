import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/CookPanel.css';

const CookNavbar = () => {
    const navigate = useNavigate();
    const [cookName, setCookName] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/api/user/me', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setCookName(data.fullName || '');
            })
            .catch(err => console.error("Помилка при завантаженні профілю кухаря:", err));
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok || response.status === 302) {
                window.location.href = '/';
            } else {
                alert("Не вдалося вийти з системи");
            }
        } catch (err) {
            console.error("Logout error:", err);
            alert("Помилка при виході");
        }
    };

    return (
        <nav className="cook-navbar">
            <div className="logo" onClick={() => navigate('/cook')}>RestyGO</div>
            <div>Панель кухаря</div>
            <div className="cook-navbar-right">
                {cookName && <span className="cook-auth-info">Авторизовано як: <strong>{cookName}</strong></span>}
                <button onClick={handleLogout}>Завершити роботу</button>
            </div>
        </nav>
    );
};

export default CookNavbar;

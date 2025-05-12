import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CookForm() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('http://localhost:8080/api/admin/cooks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ fullName, email, password }),
        });

        if (res.ok) {
            alert("Кухаря успішно зареєстровано!");
            navigate('/admin?tab=cooks'); // редирект назад з параметром
        } else if (res.status === 409) {
            alert("Email вже використовується");
        } else {
            alert("Сталася помилка");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <h3>Додати нового кухаря</h3>
            <label>ПІБ<input type="text" placeholder="ПІБ" value={fullName} onChange={e => setFullName(e.target.value)} required /></label>
            <label>Email<input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
            <label>Пароль<input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required /></label>
            <button type="submit">Зареєструвати</button>
        </form>
    );
}

export default CookForm;

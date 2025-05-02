import React, { useState } from 'react';

function RegisterForm() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async e => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ fullName, email, password }),
            });

            if (response.ok) {
                const userRes = await fetch('http://localhost:8080/api/user/me', {
                    credentials: 'include',
                });
                // alert("Успішна реєстрація!");
                window.location.href = '/';
            } else if (response.status === 409) {
                alert("Такий email вже зареєстрований");
            } else {
                alert("Помилка при реєстрації");
            }
        } catch (err) {
            console.error("Помилка при реєстрації:", err);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <input
                type="text"
                placeholder="ПІБ"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <button type="submit">Зареєструватись</button>
        </form>
    );
}

export default RegisterForm;

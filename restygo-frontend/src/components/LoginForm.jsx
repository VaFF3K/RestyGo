// import React, { useState } from 'react';
//
// function LoginForm() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//
//     const handleSubmit = async e => {
//         e.preventDefault();
//
//         // const formData = new URLSearchParams();
//         // formData.append('username', email);
//         // formData.append('password', password);
//
//         try {
//             const response = await fetch('http://localhost:8080/api/auth/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 credentials: 'include',
//                 body: JSON.stringify({ email, password }),
//             });
//
//
//             if (response.ok) {
//             const userRes = await fetch('http://localhost:8080/api/user/me', {
//                 method: 'GET',
//                 credentials: 'include',
//             });
//
//             if (userRes.ok) {
//                 const userData = await userRes.json();
//                 if (userData.role === 'ADMIN') {
//                     window.location.href = '/admin';
//                 } else if (userData.role === 'COOK'){
//                     window.location.href = '/cook';
//                 } else {
//                     window.location.href = '/';
//                 }
//             } else {
//                 alert("Не вдалося отримати роль користувача");
//             }
//             } else {
//                 alert("Невірні дані для входу");
//             }
//         } catch (err) {
//             console.error("Помилка при логіні:", err);
//             alert("Щось пішло не так при вході");
//         }
//     };
//
//
//     return (
//         <form onSubmit={handleSubmit}>
//             <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 required
//             />
//             <input
//                 type="password"
//                 placeholder="Пароль"
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 required
//             />
//             <button type="submit">Авторизуватись</button>
//         </form>
//     );
// }
//
// export default LoginForm;

import React, { useState } from 'react';
import '../styles/AuthPage.css';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const userRes = await fetch('http://localhost:8080/api/user/me', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (userRes.ok) {
                    const userData = await userRes.json();
                    if (userData.role === 'ADMIN') window.location.href = '/admin';
                    else if (userData.role === 'COOK') window.location.href = '/cook';
                    else window.location.href = '/';
                } else {
                    alert("Не вдалося отримати роль користувача");
                }
            } else {
                alert("Невірні дані для входу");
            }
        } catch (err) {
            console.error("Помилка при логіні:", err);
            alert("Щось пішло не так при вході");
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
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
            <button type="submit">Авторизуватись</button>
        </form>
    );
}

export default LoginForm;

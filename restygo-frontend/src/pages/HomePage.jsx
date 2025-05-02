// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import MenuList from '../components/client/MenuList';
// import ReviewsList from '../components/client/ReviewsList';
// import OrderPage from "./OrderPage";
//
// function HomePage() {
//     const [fullName, setFullName] = useState(null);
//     const [active, setActive] = useState('menu');
//     const navigate = useNavigate();
//     const location = useLocation();
//
//     useEffect(() => {
//         const query = new URLSearchParams(location.search);
//         const tab = query.get('tab');
//         if (tab) setActive(tab);
//     }, [location]);
//
//     useEffect(() => {
//         fetch('http://localhost:8080/api/user/me', {
//             method: 'GET',
//             credentials: 'include',
//         })
//             .then(res => {
//                 if (!res.ok) throw new Error('Не авторизовано');
//                 return res.json();
//             })
//             .then(data => setFullName(data.fullName))
//             .catch(() => setFullName(null));
//     }, []);
//
//     const handleLogout = async () => {
//         try {
//             const response = await fetch('http://localhost:8080/logout', {
//                 method: 'POST',
//                 credentials: 'include',
//             });
//
//             if (response.ok || response.status === 204) {
//                 window.location.href = '/';
//             } else {
//                 console.warn("Щось пішло не так при виході");
//             }
//         } catch (err) {
//             console.error("Logout error:", err);
//         }
//     };
//
//     return (
//         <div style={{ padding: '20px' }}>
//             <h1>Ласкаво просимо до RestyGO!</h1>
//
//             {fullName ? (
//                 <>
//                     <p>Ви увійшли як: <strong>{fullName}</strong></p>
//                     <button onClick={handleLogout}>Вийти</button>
//                     <button onClick={() => navigate('/profile')}>Мій Профіль</button>
//                 </>
//             ) : (
//                 <button onClick={() => navigate('/auth')}>Авторизація</button>
//             )}
//
//             <div style={{ marginTop: '20px' }}>
//                 <button onClick={() => setActive('menu')}>📋 Меню</button>
//                 <button onClick={() => setActive('orders')}>🧾 Замовлення</button>
//                 <button onClick={() => setActive('reviews')}>⭐ Відгуки</button>
//             </div>
//
//
//             <div style={{ marginTop: '30px'}}>
//                 {active === 'menu' && <MenuList />}
//                 {active === 'orders' && <OrderPage />}
//                 {active === 'reviews' && <ReviewsList />}
//             </div>
//
//
//         </div>
//     );
// }
//
// export default HomePage;

// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuList from '../components/client/MenuList';
import ReviewsList from '../components/client/ReviewsList';
import OrderPage from './OrderPage';
import '../styles/HomePage.css';

function HomePage() {
    const [fullName, setFullName] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const tab = new URLSearchParams(location.search).get("tab");

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
            } else {
                console.warn("Щось пішло не так при виході");
            }
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <div className="home-container">
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
                            <span>{fullName}</span>
                            <button onClick={() => navigate('/profile')}>Профіль</button>
                            <button onClick={handleLogout}>Вийти</button>
                        </>
                    ) : (
                        <button onClick={() => navigate('/auth')}>Авторизація</button>
                    )}
                </div>
            </header>

            <main className="home-content">
                {!tab && (
                    <div className="placeholder">
                        <h2>Вітаємо в RestyGO!</h2>
                        <p>Оберіть вкладку зверху, щоб почати.</p>
                    </div>
                )}
                {tab === 'menu' && <MenuList />}
                {tab === 'orders' && <OrderPage />}
                {tab === 'reviews' && <ReviewsList />}
            </main>
        </div>
    );
}

export default HomePage;


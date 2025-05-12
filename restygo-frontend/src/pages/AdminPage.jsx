// import React from 'react';
// import { Routes, Route, useNavigate } from 'react-router-dom';
// import DishManager from '../components/admin/DishManager';
// import CookManager from '../components/admin/CookManager';
// import OrderManager from '../components/admin/OrderManager';
// import ReviewManager from '../components/admin/ReviewManager';
//
// function AdminPage() {
//     const navigate = useNavigate();
//
//     const handleLogoutAndExit = async () => {
//         try {
//             const response = await fetch('http://localhost:8080/logout', {
//                 method: 'POST',
//                 credentials: 'include',
//             });
//             if (response.ok || response.status === 302) {
//                 navigate('/');
//             } else {
//                 alert("Не вдалося вийти з системи");
//             }
//         } catch (err) {
//             console.error("Logout error:", err);
//             alert("Помилка при виході");
//         }
//     };
//
//     return (
//         <div className="admin-page-container">
//             <h2>Панель адміністратора</h2>
//             <Routes>
//                 <Route path="menu" element={<DishManager />} />
//                 <Route path="cooks" element={<CookManager />} />
//                 <Route path="orders" element={<OrderManager />} />
//                 <Route path="reviews" element={<ReviewManager />} />
//                 <Route path="" element={<DishManager />} /> {/* Default tab */}
//             </Routes>
//         </div>
//     );
// }
//
// export default AdminPage;

import { Outlet } from 'react-router-dom';
import React from "react";

function AdminPage() {
    return (
        <div className="admin-container">
            <h2>Панель адміністратора</h2>
            <p>Оберіть потрібну вкладку зверху.</p>
            <Outlet /> {/* сюди рендеряться вкладені компоненти */}
        </div>
    );
}
export default AdminPage;
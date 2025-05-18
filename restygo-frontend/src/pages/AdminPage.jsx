import { Outlet } from 'react-router-dom';
import React from "react";
import DishStats from "../components/admin/DishStats";
import '../styles/AdminPanel.css';

function AdminPage() {
    return (
        <div className="admin-container">
            <h2>Панель адміністратора</h2>
            <p>Оберіть потрібну вкладку зверху.</p>
            <DishStats />
            <Outlet /> {/* сюди рендеряться вкладені компоненти */}
        </div>
    );
}
export default AdminPage;
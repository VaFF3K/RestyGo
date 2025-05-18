import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

function PublicOnlyRoute() {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/api/user/me', {
            credentials: 'include'
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                setRole(data?.role || null);
                setLoading(false);
            })
            .catch(() => {
                setRole(null);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Завантаження...</div>;

    // Кухар та Адмін не будуть мати доступ до публічної сторінки сайту
    if (role === 'ADMIN' || role === 'COOK') {
        return <Navigate to={`/${role.toLowerCase()}`} replace />;
    }
    return <Outlet />;
}

export default PublicOnlyRoute;

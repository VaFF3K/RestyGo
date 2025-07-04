import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ProtectedRoute({ allowedRoles }) {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/api/user/me', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setRole(data.role);
                setLoading(false);
            })
            .catch(() => {
                setRole(null);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Завантаження...</div>;
    if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

    return <Outlet />;
}

export default ProtectedRoute;

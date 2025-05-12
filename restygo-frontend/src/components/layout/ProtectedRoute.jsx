// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
//
// function ProtectedRoute({ children, allowedRoles }) {
//     const [isAllowed, setIsAllowed] = useState(null);
//
//     useEffect(() => {
//         fetch('http://localhost:8080/api/user/me', {
//             credentials: 'include',
//         })
//             .then(res => {
//                 if (!res.ok) throw new Error("Не авторизовано");
//                 return res.json();
//             })
//             .then(data => {
//                 setIsAllowed(allowedRoles.includes(data.role));
//             })
//             .catch(() => {
//                 setIsAllowed(false);
//             });
//     }, [allowedRoles]);
//
//     if (isAllowed === null) return <div>Завантаження...</div>;
//     if (!isAllowed) return <Navigate to="/" replace />;
//
//     return children;
// }
//
// export default ProtectedRoute;
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

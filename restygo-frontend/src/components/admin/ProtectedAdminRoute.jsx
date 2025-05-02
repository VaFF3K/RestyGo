import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedAdminRoute({ children }) {
    const [isAllowed, setIsAllowed] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/user/me', {
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) throw new Error("Не авторизовано");
                return res.json();
            })
            .then(data => {
                setIsAllowed(data.role === 'ADMIN');
            })
            .catch(() => {
                setIsAllowed(false);
            });
    }, []);

    if (isAllowed === null) return <div>Завантаження...</div>;
    if (!isAllowed) return <Navigate to="/" replace />;

    return children;
}

export default ProtectedAdminRoute;

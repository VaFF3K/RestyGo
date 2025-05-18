import { useEffect, useState } from 'react';

export default function useAuth() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/user/me', {
            credentials: 'include'
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => setUser(data))
            .catch(() => setUser(null));
    }, []);

    return user;
}

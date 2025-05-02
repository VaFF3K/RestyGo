import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CookManager() {
    const [cooks, setCooks] = useState([]);
    const navigate = useNavigate();

    const loadCooks = () => {
        fetch('http://localhost:8080/api/admin/cooks', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setCooks(data));
    };

    useEffect(() => {
        loadCooks();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Видалити кухаря?")) return;

        const res = await fetch(`http://localhost:8080/api/admin/cooks/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (res.ok) loadCooks();
    };

    return (
        <div>
            <h3>Список кухарів</h3>

            <button onClick={() => navigate('/admin/add-cook')} style={{ marginBottom: '10px' }}>
                ➕ Додати кухаря
            </button>

            <table border="1" cellPadding="8">
                <thead>
                <tr>
                    <th>Імʼя</th>
                    <th>Email</th>
                    <th>Дія</th>
                </tr>
                </thead>
                <tbody>
                {cooks.map(cook => (
                    <tr key={cook.id}>
                        <td>{cook.fullName}</td>
                        <td>{cook.email}</td>
                        <td><button onClick={() => handleDelete(cook.id)}>Видалити</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default CookManager;

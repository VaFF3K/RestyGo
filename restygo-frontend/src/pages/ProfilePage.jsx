import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function ProfilePage() {
    const location = useLocation();
    const [tab, setTab] = useState('active');
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const t = query.get('tab');
        if (t) setTab(t);
    }, [location]);

    useEffect(() => {
        fetch('http://localhost:8080/api/orders/my', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(setOrders)
            .catch(err => {
                console.error("Помилка при завантаженні замовлень:", err);
                setOrders([]);
            });
    }, []);

    const filteredOrders = orders.filter(order => {
        if (tab === 'active') {
            return order.status === 'NEW' || order.status === 'IN_PROGRESS';
        } else {
            return order.status === 'READY' || order.status === 'ISSUED';
        }
    });

    return (
        <div style={{ padding: '20px' }}>
            <h2>Мій профіль</h2>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setTab('active')}>🕓 Активні замовлення</button>
                <button onClick={() => setTab('history')}>📜 Історія</button>
            </div>

            {filteredOrders.length === 0 ? (
                <p>Замовлень не знайдено.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {filteredOrders.map(order => (
                        <div
                            key={order.id}
                            style={{
                                border: '1px solid #ccc',
                                padding: '20px',
                                borderRadius: '10px',
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            <h3>Замовлення №{order.id}</h3>
                            <p><strong>Статус:</strong> {order.status}</p>

                            <p><strong>Позиції Замовлення:</strong></p>
                            <ul>
                                {order.items.map(item => (
                                    <li>
                                        {item.name} ({item.quantity} шт) — {item.price * item.quantity} грн
                                    </li>
                                ))
                                }
                            </ul>

                            {order.comment && (
                                <p><strong>Коментар до замовлення:</strong> {order.comment}</p>
                            )}

                            <p><strong>Дата і час:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Невідомо"}</p>
                            <p><strong>Загальна сума:</strong> {order.totalPrice ?? 0} грн</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProfilePage;

import React, { useEffect, useState } from 'react';

function CookOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        setLoading(true);
        fetch('http://localhost:8080/api/cook/orders', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Помилка при завантаженні замовлень:", err);
                setLoading(false);
            });
    };

    const handleStatusChange = (orderId, newStatus) => {
        fetch(`http://localhost:8080/api/cook/orders/${orderId}/status?newStatus=${newStatus}`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(res => {
                if (res.ok) {
                    fetchOrders(); // перезавантажити замовлення після зміни
                } else {
                    alert("Не вдалося змінити статус");
                }
            })
            .catch(err => console.error("Помилка зміни статусу:", err));
    };

    if (loading) {
        return <p>Завантаження...</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Замовлення для кухаря</h2>

            {orders.length === 0 ? (
                <p>Немає замовлень</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map(order => (
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

                            <p><strong>Позиції:</strong></p>
                            <ul>
                                {order.items && order.items.map((item, idx) => (
                                    <li key={idx}>
                                        {item.dishName} ({item.quantity} шт)
                                    </li>
                                ))}
                            </ul>
                            {order.comment && <p><strong>Коментар:</strong> {order.comment}</p>}


                            <p><strong>Дата створення:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Невідомо'}</p>

                            {/* Кнопки зміни статусу */}
                            <div style={{ marginTop: '10px' }}>
                                {order.status === 'NEW' && (
                                    <button onClick={() => handleStatusChange(order.id, 'IN_PROGRESS')}>
                                        Почати готувати (In Progress)
                                    </button>
                                )}
                                {order.status === 'IN_PROGRESS' && (
                                    <button onClick={() => handleStatusChange(order.id, 'READY')}>
                                        Готово (Ready)
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CookOrdersPage;

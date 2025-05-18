import React, { useEffect, useState } from 'react';
import {statusLabels} from "../../utils/statusMap";

function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all');


    useEffect(() => {
        fetch('http://localhost:8080/api/orders', { credentials: 'include' })
            .then(res => res.json())
            .then(setOrders)
            .catch(err => console.error('Помилка завантаження замовлень:', err));
    }, []);

    const filteredOrders = orders.filter(order => {
        if (filter === 'active') return order.status === 'NEW' || order.status === 'IN_PROGRESS';
        if (filter === 'completed') return order.status === 'READY' || order.status === 'CANCELLED';
        return true;
    });


    return (
        <div className="admin-container">
            <h2>Усі замовлення</h2>
            <div className="admin-nav-tabs">
                <button className={`admin-nav-button ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}>Всі</button>

                <button className={`admin-nav-button ${filter === 'active' ? 'active' : ''}`}
                    onClick={() => setFilter('active')}>Активні</button>

                <button className={`admin-nav-button ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}>Завершені</button>
            </div>
            <table className="admin-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Статус</th>
                    <th>Позиції з меню</th>
                    <th>Коментар</th>
                    <th>Дата</th>
                    <th>Сума</th>
                </tr>
                </thead>
                <tbody>
                {filteredOrders.map(order => {
                    const statusInfo = statusLabels[order.status];
                    return (
                    <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td><span style={{
                            backgroundColor: statusInfo.color,
                            color: '#000000',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            display: 'inline-block'
                        }}>{statusInfo.label} </span>
                           </td>
                        <td>
                            <ul>
                                {order.items.map((item, index) => (
                                    <li key={index}>
                                        {item.name} ({item.quantity} шт) — {(item.price * item.quantity).toFixed(2)} ₴
                                    </li>
                                ))}
                            </ul>
                        </td>
                        <td>{order.comment || '—'}</td>
                        <td>
                            {order.createdAt
                                ? new Date(order.createdAt).toLocaleString('uk-UA', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                                : 'Невідомо'}
                        </td>
                        <td>{order.totalPrice.toFixed(2)} ₴</td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default OrderManager;

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {statusLabels} from "../../utils/statusMap";

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
            return order.status === 'READY' || order.status === 'CANCELLED';
        }
    });

    const handleIssue = (orderId) => {
        if (!window.confirm("Ви дійсно хочете скасувати це замовлення?")) return;

        fetch(`http://localhost:8080/api/orders/${orderId}/issue`, {
            method: 'PUT',
            credentials: 'include'
        })
            .then(res => {
                if (!res.ok) {
                    return res.text().then(text => { throw new Error(text) });
                }
                return res.text();
            })
            .then(msg => {
                alert(msg);
                setOrders(prevOrders =>
                    prevOrders.map(o =>
                        o.id === orderId ? { ...o, status: 'CANCELLED' } : o
                    )
                );
            })
            .catch(err => {
                alert("Помилка при скасуванні: " + err.message);
            });
    };

    return (
        <div className="profile-container">
            <h2>Мій профіль</h2>

            <div className="profile-tabs">
                <button
                    onClick={() => setTab('active')}
                    className={tab === 'active' ? 'active' : ''}
                >
                    🕓 Активні замовлення
                </button>
                <button
                    onClick={() => setTab('history')}
                    className={tab === 'history' ? 'active' : ''}
                >
                    📜 Історія
                </button>
            </div>

            {filteredOrders.length === 0 ? (
                <p>Замовлень не знайдено.</p>
            ) : (
                <div className="orders-list">
                    {filteredOrders.map(order => {
                        const statusInfo = statusLabels[order.status] || { label: order.status, color: "#e2e3e5" };
                        return (
                        <div key={order.id} className="order-card">
                            <h3>Замовлення №{order.id}</h3>
                            <p><strong>Статус:</strong> <span style={{
                                backgroundColor: statusInfo.color,
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                display: 'inline-block'
                            }}>{statusInfo.label} </span></p>
                            <p><strong>Позиції Замовлення:</strong></p>
                            <ul>
                                {order.items.map((item, index) => (
                                    <li key={index}>
                                        {item.name} ({item.quantity} шт) — {item.price * item.quantity} ₴
                                    </li>
                                ))}
                            </ul>

                            {order.comment && (
                                <p><strong>Коментар до замовлення:</strong> {order.comment}</p>
                            )}
                            <p><strong>Дата і час:</strong> {new Date(order.createdAt).toLocaleString('uk-UA')}</p>
                            <p><strong>Загальна сума:</strong> {order.totalPrice ?? 0} ₴</p>

                            {order.status === 'NEW' && (
                                <button
                                    className="cancel-button"
                                    onClick={() => handleIssue(order.id)}
                                >
                                    ❌ Скасувати замовлення
                                </button>
                            )}
                            {order.status === 'IN_PROGRESS' || order.status === 'READY' ? (
                                <p className="order-status-note">Ви більше не можете скасувати це замовлення</p>
                            ) : order.status === 'CANCELLED' ? (
                                <p className="order-status-note">Замовлення скасовано</p>
                            ) : null}
                        </div> );
                    })}
                </div>
            )}
        </div>

    );
}

export default ProfilePage;

// import React, { useEffect, useState } from 'react';
// import '../styles/CookPanel.css';
//
// function CookOrdersPage() {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filter, setFilter] = useState('active'); // 'active' | 'completed' | 'all'
//
//     useEffect(() => {
//         fetchOrders();
//     }, []);
//
//     const fetchOrders = () => {
//         setLoading(true);
//         fetch('http://localhost:8080/api/cook/orders', {
//             credentials: 'include'
//         })
//             .then(res => res.json())
//             .then(data => {
//                 setOrders(data);
//                 setLoading(false);
//             })
//             .catch(err => {
//                 console.error("Помилка при завантаженні замовлень:", err);
//                 setLoading(false);
//             });
//     };
//
//     const handleStatusChange = (orderId, newStatus) => {
//         fetch(`http://localhost:8080/api/cook/orders/${orderId}/status?newStatus=${newStatus}`, {
//             method: 'POST',
//             credentials: 'include'
//         })
//             .then(res => {
//                 if (res.ok) fetchOrders();
//                 else alert("Не вдалося змінити статус");
//             })
//             .catch(err => console.error("Помилка зміни статусу:", err));
//     };
//
//     const filteredOrders = orders.filter(order => {
//         if (filter === 'active') return order.status === 'NEW' || order.status === 'IN_PROGRESS';
//         if (filter === 'completed') return order.status === 'READY';
//         return true;
//     });
//
//     return (
//         <div className="cook-container">
//             <h2>Замовлення</h2>
//
//             <div className="cook-filter-tabs">
//                 <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Всі</button>
//                 <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Активні</button>
//                 <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Завершені</button>
//             </div>
//
//             {loading ? (
//                 <p>Завантаження...</p>
//             ) : filteredOrders.length === 0 ? (
//                 <p>Немає замовлень</p>
//             ) : (
//                 <div className="cook-orders-list">
//                     {filteredOrders.map(order => (
//                         <div key={order.id} className="cook-order-card">
//                             <h3>Замовлення №{order.id}</h3>
//                             <p><strong>Статус:</strong> {order.status}</p>
//
//                             <ul>
//                                 {order.items && order.items.map((item, idx) => (
//                                     <li key={idx}>{item.dishName} ({item.quantity} шт)</li>
//                                 ))}
//                             </ul>
//
//                             {order.comment && <p><strong>Коментар:</strong> {order.comment}</p>}
//
//                             <p><strong>Дата:</strong> {order.createdAt
//                                 ? new Date(order.createdAt).toLocaleString('uk-UA')
//                                 : 'Невідомо'}
//                             </p>
//
//                             {(order.status === 'NEW' || order.status === 'IN_PROGRESS') && (
//                                 <div className="cook-card-actions">
//                                     {order.status === 'NEW' && (
//                                         <button className="cook-btn" onClick={() => handleStatusChange(order.id, 'IN_PROGRESS')}>
//                                             Почати готувати
//                                         </button>
//                                     )}
//                                     {order.status === 'IN_PROGRESS' && (
//                                         <button className="cook-btn" onClick={() => handleStatusChange(order.id, 'READY')}>
//                                             Готово
//                                         </button>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }
//
// export default CookOrdersPage;

import React, { useEffect, useState } from 'react';
import '../styles/CookPanel.css';

function CookOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('active'); // 'all' | 'active' | 'completed'
    const [sortOrder, setSortOrder] = useState('newFirst'); // 'newFirst' | 'inProgressFirst'
    const [completedSortOrder, setCompletedSortOrder] = useState('newestFirst'); // 'newestFirst' | 'oldestFirst'
    const [currentCookName, setCurrentCookName] = useState('');

    useEffect(() => {
        fetchCurrentCook();
    }, []);

    useEffect(() => {
        let statuses;
        if (filter === 'completed') {
            statuses = ['READY'];
        } else if (filter === 'active') {
            statuses = ['NEW', 'IN_PROGRESS'];
        } else {
            statuses = ['NEW', 'IN_PROGRESS', 'READY'];
        }

        fetchOrders(statuses);
    }, [filter]);

    const fetchCurrentCook = () => {
        fetch('http://localhost:8080/api/user/me', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setCurrentCookName(data.fullName);
            })
            .catch(err => console.error("Помилка при завантаженні профілю кухаря:", err));
    };

    const fetchOrders = (statuses = ['NEW', 'IN_PROGRESS']) => {
        const query = statuses.join(',');
        setLoading(true);
        fetch(`http://localhost:8080/api/cook/orders?status=${query}`, {
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
                    // Оновлення замовлень після зміни статусу
                    if (filter === 'completed') fetchOrders(['READY']);
                    else if (filter === 'active') fetchOrders(['NEW', 'IN_PROGRESS']);
                    else fetchOrders(['NEW', 'IN_PROGRESS', 'READY']);
                } else {
                    alert("Не вдалося змінити статус");
                }
            })
            .catch(err => console.error("Помилка зміни статусу:", err));
    };

    // Сортування
    let sortedOrders = [...orders];
    if (filter === 'completed') {
        sortedOrders.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return completedSortOrder === 'newestFirst' ? dateB - dateA : dateA - dateB;
        });
    } else {
        sortedOrders.sort((a, b) => {
            const priority = status => {
                if (sortOrder === 'newFirst') {
                    return status === 'NEW' ? 0 : status === 'IN_PROGRESS' ? 1 : 2;
                } else {
                    return status === 'IN_PROGRESS' ? 0 : status === 'NEW' ? 1 : 2;
                }
            };
            return priority(a.status) - priority(b.status);
        });
    }

    return (
        <div className="cook-container">
            <h2>Замовлення</h2>

            {/* Фільтр вкладок */}
            <div className="cook-filter-tabs">
                <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Активні</button>
                <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Завершені</button>
            </div>

            {/* Фільтр сортування */}
            <div className="sort-options">
                <label>Сортування: </label>
                {filter === 'completed' ? (
                    <select value={completedSortOrder} onChange={e => setCompletedSortOrder(e.target.value)}>
                        <option value="newestFirst">Спочатку нові</option>
                        <option value="oldestFirst">Спочатку старі</option>
                    </select>
                ) : (
                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                        <option value="newFirst">Спочатку нові</option>
                        <option value="inProgressFirst">Спочатку ті, що виконуються</option>
                    </select>
                )}
            </div>

            {loading ? (
                <p>Завантаження...</p>
            ) : sortedOrders.length === 0 ? (
                <p>Замовлень поки немає.</p>
            ) : (
                <div className="cook-orders-list">
                    {sortedOrders.map(order => (
                        <div key={order.id} className="cook-order-card">
                            <h3>Замовлення №{order.id}</h3>
                            <p><strong>Статус:</strong> {order.status}</p>

                            <ul>
                                {order.items && order.items.map((item, idx) => (
                                    <li key={idx}>{item.dishName} ({item.quantity} шт)</li>
                                ))}
                            </ul>
                            {order.customerName && <p><strong>Клієнт:</strong> {order.customerName}</p>}
                            {order.comment && <p><strong>Коментар:</strong> {order.comment}</p>}
                            <p><strong>Дата:</strong> {order.createdAt
                                ? new Date(order.createdAt).toLocaleString('uk-UA')
                                : 'Невідомо'}
                            </p>

                            {order.cookName && (
                                <p>
                                    <strong>Кухар:</strong> {order.cookName}
                                    {order.status !== 'READY' && (
                                        <div>
                                            <strong>
                                                {order.cookName === currentCookName
                                                    ? "(Ви готуєте це замовлення)"
                                                    : "(Це замовлення виконує інший кухар)"}
                                            </strong>
                                        </div>
                                    )}
                                </p>
                            )}

                            {order.status === 'NEW' && !order.cookName && (
                                <button className="cook-btn" onClick={() => handleStatusChange(order.id, 'IN_PROGRESS')}>
                                    Почати готувати
                                </button>
                            )}

                            {order.status === 'IN_PROGRESS' && order.cookName === currentCookName && (
                                <button className="cook-btn" onClick={() => handleStatusChange(order.id, 'READY')}>
                                    Готово
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CookOrdersPage;






// import React, { useEffect, useState } from "react";
// import axios from "axios";
//
// export default function CookOrders() {
//     const [orders, setOrders] = useState([]);
//     const [error, setError] = useState(null);
//
//     const fetchOrders = async () => {
//         try {
//             const res = await axios.get("/api/cook/orders");
//             setOrders(res.data);
//         } catch (err) {
//             setError("Не вдалося завантажити замовлення");
//         }
//     };
//
//     const changeStatus = async (orderId, newStatus) => {
//         try {
//             await axios.put(`/api/cook/orders/${orderId}/status`, null, {
//                 params: { newStatus },
//             });
//             fetchOrders(); // оновити після зміни
//         } catch (err) {
//             alert(err.response?.data || "Помилка при зміні статусу");
//         }
//     };
//
//     useEffect(() => {
//         fetchOrders();
//         const interval = setInterval(fetchOrders, 5000); // автооновлення
//         return () => clearInterval(interval);
//     }, []);
//
//     return (
//         <div className="p-4">
//             <h2 className="text-2xl font-bold mb-4">Замовлення на кухні</h2>
//             {error && <div className="text-red-500">{error}</div>}
//
//             <div className="grid gap-4">
//                 {orders.map((order) => (
//                     <div key={order.id} className="border p-4 rounded-xl shadow bg-white">
//                         <p className="text-lg font-semibold">Столик #{order.tableNumber}</p>
//                         <p>Статус: <b>{order.status}</b></p>
//                         {order.cookName && <p>Кухар: {order.cookName}</p>}
//
//                         <ul className="list-disc list-inside my-2">
//                             {order.items.map((item, idx) => (
//                                 <li key={idx}>{item}</li>
//                             ))}
//                         </ul>
//
//                         {order.status === "NEW" && (
//                             <button
//                                 onClick={() => changeStatus(order.id, "IN_PROGRESS")}
//                                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                             >
//                                 Взяти в роботу
//                             </button>
//                         )}
//
//                         {order.status === "IN_PROGRESS" && (
//                             <button
//                                 onClick={() => changeStatus(order.id, "READY")}
//                                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                             >
//                                 Позначити як готове
//                             </button>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }




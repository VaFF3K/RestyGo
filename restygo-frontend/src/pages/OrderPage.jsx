// import React, { useState } from 'react';
// import { useOrder } from '../components/client/OrderContext';
// import { useNavigate } from 'react-router-dom';
//
// function OrderPage() {
//     const { items, updateQuantity, removeItem, clearOrder } = useOrder();
//     const [comment, setComment] = useState('');
//     const navigate = useNavigate();
//
//     const total = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
//
//     const handleSubmit = async () => {
//         const orderData = {
//             items: items.map(item => ({
//                 dishId: item.dish.id,
//                 quantity: item.quantity,
//                 comment: item.comment || ""
//             })),
//             comment
//         };
//
//
//         const res = await fetch('http://localhost:8080/api/orders', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             credentials: 'include',
//             body: JSON.stringify(orderData)
//         });
//
//         if (res.ok) {
//             const msg = await res.text();
//             alert(`✅ ${msg}`);
//             clearOrder();
//             navigate('/profile?tab=active');
//         } else {
//             alert('❌ Помилка при оформленні замовлення');
//         }
//     };
//
//     return (
//         <div>
//             <h2>Ваше замовлення</h2>
//             {items.length === 0 ? (
//                 <p>Немає обраних страв</p>
//             ) : (
//                 <>
//                     <table border="1" cellPadding="8">
//                         <thead>
//                         <tr>
//                             <th>Назва</th>
//                             <th>Кількість</th>
//                             <th>Ціна</th>
//                             <th>Загальна</th>
//                             <th>Дія</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {items.map((item, idx) => (
//                             <tr key={idx}>
//                                 <td>{item.dish.name}</td>
//                                 <td>
//                                     <input
//                                         type="number"
//                                         min="1"
//                                         value={item.quantity}
//                                         onChange={(e) =>
//                                             updateQuantity(item.dish.id, parseInt(e.target.value))
//                                         }
//                                     />
//                                 </td>
//                                 <td>{item.dish.price} грн</td>
//                                 <td>{item.dish.price * item.quantity} грн</td>
//                                 <td>
//                                     <button onClick={() => removeItem(item.dish.id)}>❌</button>
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//
//                     {/* 🆕 textarea для коментаря */}
//                     <div style={{ marginTop: '20px' }}>
//                         <label htmlFor="comment">Коментар до замовлення (необов’язково):</label>
//                         <br />
//                         <textarea
//                             id="comment"
//                             value={comment}
//                             onChange={(e) => setComment(e.target.value)}
//                             rows="4"
//                             cols="50"
//                             placeholder="Наприклад: без цибулі, доставка до 18:00..."
//                         />
//                     </div>
//
//                     <p style={{ marginTop: '15px' }}><strong>Всього: {total} грн</strong></p>
//                     <button onClick={handleSubmit}>
//                         ✅ Оформити замовлення
//                     </button>
//                 </>
//             )}
//         </div>
//     );
// }
//
// export default OrderPage;
import React, { useState } from 'react';
import { useOrder } from '../components/client/OrderContext';
import { useNavigate } from 'react-router-dom';
import '../styles/OrderPage.css';

function OrderPage() {
    const { items, updateQuantity, removeItem, clearOrder } = useOrder();
    const [comment, setComment] = useState('');
    const navigate = useNavigate();

    const total = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);

    const handleSubmit = async () => {
        const orderData = {
            items: items.map(item => ({
                dishId: item.dish.id,
                quantity: item.quantity,
                comment: item.comment || ""
            })),
            comment
        };

        const res = await fetch('http://localhost:8080/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(orderData)
        });

        if (res.ok) {
            const msg = await res.text();
            alert(`✅ ${msg}`);
            clearOrder();
            navigate('/profile?tab=active');
        } else {
            alert('❌ Помилка при оформленні замовлення');
        }
    };

    return (
        <div className="order-page">
            <h2>Ваше замовлення</h2>
            {items.length === 0 ? (
                <p>Немає обраних страв</p>
            ) : (
                <>
                    <table className="order-table">
                        <thead>
                        <tr>
                            <th>Назва</th>
                            <th>Кількість</th>
                            <th>Ціна</th>
                            <th>Загальна</th>
                            <th>Дія</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.dish.name}</td>
                                <td>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateQuantity(item.dish.id, parseInt(e.target.value))
                                        }
                                    />
                                </td>
                                <td>{item.dish.price} грн</td>
                                <td>{item.dish.price * item.quantity} грн</td>
                                <td>
                                    <button onClick={() => removeItem(item.dish.id)}>❌</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="order-comment">
                        <label htmlFor="comment">Коментар до замовлення (необов’язково):</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                            placeholder="Наприклад: без цибулі, доставка до 18:00..."
                        />
                    </div>

                    <p className="order-total"><strong>Всього: {total} грн</strong></p>
                    <button className="submit-btn" onClick={handleSubmit}>
                        ✅ Оформити замовлення
                    </button>
                </>
            )}
        </div>
    );
}

export default OrderPage;

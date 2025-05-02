// src/pages/DishPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {useOrder} from "../components/client/OrderContext";

function DishPage() {
    const { id } = useParams();
    const [dish, setDish] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const { addItem, removeItem, items } = useOrder();

    useEffect(() => {
        fetch(`http://localhost:8080/api/public/menu/${id}`)
            .then(res => res.json())
            .then(setDish);

        fetch(`http://localhost:8080/api/reviews/dish/${id}`)
            .then(res => res.json())
            .then(setReviews);
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:8080/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ rating, comment, dishId: id }),
        });

        if (res.ok) {
            alert("Відгук додано!");
            setComment('');
            setRating(5);
            fetch(`http://localhost:8080/api/reviews/dish/${id}`)
                .then(res => res.json())
                .then(setReviews);
        } else {
            alert("Помилка при додаванні відгуку");
        }
    };

    const isInOrder = (dishId) => {
        return items.some(item => item.dish.id === dishId);
    };

    const handleToggle = (dish) => {
        if (isInOrder(dish.id)) {
            removeItem(dish.id); // ➖ якщо вже в замовленні — видаляємо
        } else {
            addItem(dish); // ➕ інакше — додаємо
        }
    };

    if (!dish) return <p>Завантаження...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>{dish.name}</h2>
            {dish.imageName && (
                <img
                    src={`http://localhost:8080/api/dishes/assets/${dish.imageName}`}
                    alt={dish.name}
                    width="300"
                    style={{ borderRadius: '10px' }}
                />
            )}
            <p>{dish.description}</p>
            <p><strong>Ціна:</strong> {dish.price} грн</p>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(dish); // ✅ Перемикаємо стан
                }}
            >
                {isInOrder(dish.id) ? '❌ Вилучити вибір' : '🛒 Замовити'}
            </button>
            <hr />

            <h3>Залишити відгук</h3>
            <form onSubmit={handleReviewSubmit}>
                <div>
                    <label>Оцінка:</label>
                    <select value={rating} onChange={e => setRating(parseInt(e.target.value))}>
                        {[5,4,3,2,1].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <textarea
                        placeholder="Ваш коментар"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Відправити</button>
            </form>
            <h3>Відгуки</h3>
            {reviews.length === 0 ? (
                <p>Ще немає відгуків</p>
            ) : (
                <ul>
                    {reviews.map((rev, idx) => (
                        <li key={idx}>
                            <strong>Оцінка:</strong> {rev.rating}/5<br/>
                            <strong>Коментар:</strong> {rev.comment}<br/>
                            <strong>Автор:</strong> {rev.userName}<br/>
                            <strong>Дата:</strong> {new Date(rev.createdAt).toLocaleString()}
                        </li>
                    ))}
                </ul>

            )}

        </div>
    );
}

export default DishPage;

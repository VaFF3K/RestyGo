import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOrder } from './OrderContext';
import useAuth from "../../utils/useAuth";
import calculateAverageRating from '../../utils/calculateAverageRating';


function DishPage() {
    const { id } = useParams();
    const [dish, setDish] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const { addItem, removeItem, items } = useOrder();
    const user = useAuth();

    const { average, count } = calculateAverageRating(reviews);


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
            const refreshed = await fetch(`http://localhost:8080/api/reviews/dish/${id}`);
            const data = await refreshed.json();
            setReviews(data);
        } else {
            alert("Помилка при додаванні відгуку");
        }
    };

    const isInOrder = (dishId) => items.some(item => item.dish.id === dishId);

    const handleToggle = () => {
        isInOrder(dish.id) ? removeItem(dish.id) : addItem(dish);
    };

    if (!dish) return <p className="loading">Завантаження...</p>;

    return (
        <div className="home-content">
        <div className="dish-page">
            <div className="dish-header">
                <h2>{dish.name}</h2>

                {dish.imageName && (
                    <img
                        src={`http://localhost:8080/api/dishes/assets/${dish.imageName}`}
                        alt={dish.name}
                        className="dish-image" /> )}
                {count > 0 ? (
                    <div className="dish-rating">
                        <div className="stars">{'⭐'.repeat(average)}</div>
                        <div className="count">відгуків: {count}</div>
                    </div>
                ) : (
                    <p className="dish-rating">Ще немає відгуків</p>
                )}
                <p className="dish-price"><strong>Ціна:</strong> {dish.price} ₴</p>
                <button className="dish-action-button" onClick={handleToggle}>
                    {isInOrder(dish.id) ? '❌ Вилучити вибір' : '🛒 Замовити'}
                </button>
                <p className="dish-text"><strong>Категорія:</strong> {dish.category}</p>
                <p className="dish-text"><strong>Опис:</strong> {dish.description}</p>
                

            </div>

            <div className="review-section">
                <h3>Залишити відгук</h3>
                {user ? (
                <form onSubmit={handleReviewSubmit} className="review-form">
                    <label>
                        <strong> Оцінка:</strong>
                        <select value={rating} onChange={e => setRating(parseInt(e.target.value))}>
                            {[5, 4, 3, 2, 1].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </label>
                    <textarea
                        placeholder="Ваш коментар"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        required
                    />
                    <button type="submit">Відправити</button>
                </form> ) : (
                    <p className="order-status-note">
                        🔐 Увійдіть, перш ніж додавати відгук.
                    </p>
                )}

                <h3>Відгуки до страви</h3>
                {reviews.length === 0 ? (
                    <p className="no-reviews">Ще немає відгуків</p>
                ) : (
                    <ul className="review-list">
                        {reviews.map((rev, idx) => (
                            <li key={idx} className="review-item">
                                <p><strong>Оцінка:</strong> {'⭐'.repeat(rev.rating)}</p>
                                <p><strong>Коментар:</strong> {rev.comment}</p>
                                <p><strong>Автор:</strong> {rev.userName}</p>
                                <p className="review-date">{new Date(rev.createdAt).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div></div>
    );
}

export default DishPage;

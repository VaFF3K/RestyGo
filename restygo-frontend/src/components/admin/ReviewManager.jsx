import React, { useEffect, useState } from 'react';
// import '../../styles/AdminPanel.css';

function ReviewManager() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/reviews', { credentials: 'include' })
            .then(res => res.json())
            .then(setReviews)
            .catch(err => console.error('Помилка при завантаженні відгуків:', err));
    }, []);

    const deleteReview = async (id) => {
        if (!window.confirm("Видалити відгук?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/reviews/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                setReviews(prev => prev.filter(r => r.id !== id));
            } else {
                alert("Помилка при видаленні відгуку");
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    return (
        <div className="admin-container">
            <h2>Всі відгуки</h2>
            <table className="admin-table">
                <thead>
                <tr>
                    <th>Товар</th>
                    <th>Оцінка</th>
                    <th>Коментар</th>
                    <th>Автор</th>
                    <th>Дата</th>
                    <th>Дія</th>
                </tr>
                </thead>
                <tbody>
                {reviews.map(r => (
                    <tr key={r.id}>
                        <td>{r.dishName || '—'}</td>
                        <td>{'⭐'.repeat(r.rating)}</td>
                        <td>{r.comment || '—'}</td>
                        <td>{r.userName || '—'}</td>
                        <td>
                            {r.createdAt
                                ? new Date(r.createdAt).toLocaleString('uk-UA', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                                : 'Невідомо'}
                        </td>
                        <td>
                            <button onClick={() => deleteReview(r.id)}>Видалити</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReviewManager;

import React, { useEffect, useState } from "react";

function ReviewsList() {
    const [reviews, setReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDish, setSelectedDish] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        fetch('http://localhost:8080/api/reviews')
            .then(res => res.json())
            .then(setReviews)
            .catch(err => console.error("Помилка завантаження відгуків:", err));
    }, []);

    const uniqueDishes = [...new Set(reviews.map(r => r.dishName))];

    const filteredReviews = reviews
        .filter(r =>
            (!selectedDish || r.dishName === selectedDish) &&
            (r.comment.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className="reviews-page">
            <h2>Всі відгуки</h2>

            <div className="filters">
                <select value={selectedDish} onChange={e => setSelectedDish(e.target.value)}>
                    <option value="">Всі товари</option>
                    {uniqueDishes.map((dish, idx) => (
                        <option key={idx} value={dish}>{dish}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="🔍 Пошук у коментарях..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />

                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                    <option value="newest">Спочатку нові</option>
                    <option value="oldest">Спочатку старі</option>
                </select>
            </div>

            {filteredReviews.length === 0 ? (
                <p>Відгуків не знайдено.</p>
            ) : (
                <div className="review-list">
                    {filteredReviews.map((r, idx) => (
                        <div key={idx} className="review-card" >
                            <p><strong>Товар:</strong> {r.dishName}</p>
                            <p><strong>Оцінка:</strong> {'⭐'.repeat(r.rating)}</p>
                            <p><strong>Автор:</strong> {r.userName}</p>
                            <p><strong>Коментар:</strong> {r.comment}</p>
                            <p className="review-date">{new Date(r.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ReviewsList;

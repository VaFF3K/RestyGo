import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from './OrderContext';

function MenuList() {
    const [dishes, setDishes] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [sort, setSort] = useState('default');


    const { addItem, removeItem, items } = useOrder();
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/api/public/menu')
            .then(res => res.json())
            .then(setDishes)
            .catch(err => console.error("Помилка при завантаженні меню:", err));
    }, []);

    const isInOrder = (dishId) => items.some(item => item.dish.id === dishId);

    const categories = [...new Set(dishes.map(d => d.category))];

    const filtered = dishes
        .filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase()))
        .filter(d => category === 'all' || d.category === category)
        .sort((a, b) => {
            if (sort === 'price-asc') return a.price - b.price;
            if (sort === 'price-desc') return b.price - a.price;
            if (sort === 'name') return a.name.localeCompare(b.name);
            return 0;
        });

    return (
        <div className="menu-container">
            <div className="filters">
                <input
                    className={`menu ${expanded ? 'expanded' : ''}`}
                    type="text"
                    placeholder="🔍 Пошук страви..."
                    value={search}
                    onFocus={() => setExpanded(true)}
                    onBlur={() => {
                        if (search.trim() === '') {
                            setExpanded(false);
                        }}} onChange={e => setSearch(e.target.value)}/>

                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="all">Всі категорії</option>
                    {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                    ))}
                </select>

                <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="default">Сортування</option>
                    <option value="price-asc">Ціна ↑</option>
                    <option value="price-desc">Ціна ↓</option>
                    <option value="name">За назвою (А-Я)</option>
                </select>
            </div>

            <div className="menu-grid">
                {filtered.map(dish => (
                    <div
                        key={dish.id}
                        className="dish-card"
                        onClick={() => navigate(`/dish/${dish.id}`)}>
                        <div className="img-wrapper">
                        {dish.imageName && (
                           <img
                                src={`http://localhost:8080/api/dishes/assets/${dish.imageName}`}
                                alt={dish.name}
                            />
                        )}</div>
                        <h4>{dish.name}</h4>
                        <p><strong>Категорія:</strong> {dish.category}</p>
                        <p><strong>{dish.price} ₴</strong></p>
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                isInOrder(dish.id) ? removeItem(dish.id) : addItem(dish);
                            }}>
                            {isInOrder(dish.id) ? '❌ Прибрати' : '🛒Замовити'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default MenuList;
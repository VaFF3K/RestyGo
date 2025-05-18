import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DishManager() {
    const [dishes, setDishes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/api/admin/dishes', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setDishes(data);
                else setDishes([]);
            })
            .catch(() => setDishes([]));
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Справді видалити цю страву?");
        if (!confirmed) return;

        const response = await fetch(`http://localhost:8080/api/admin/dishes/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            setDishes(prev => prev.filter(d => d.id !== id));
        } else {
            alert("Не вдалося видалити страву");
        }
    };

    return (
        <div className="admin-container">
            <h2>Усі позиції меню</h2>
            <button onClick={() => navigate('/admin/add-dish')}>
                ➕ Додати до меню
            </button>

            <table className="admin-table">
                <thead>
                <tr>
                    <th>Назва</th>
                    <th>Ціна</th>
                    <th>Категорія</th>
                    <th>Опис</th>
                    <th>Зображення</th>
                    <th>Дія</th>
                </tr>
                </thead>
                <tbody>
                {dishes.map((dish, index) => (
                    <tr key={index}>
                        <td>{dish.name}</td>
                        <td>{dish.price} ₴</td>
                        <td>{dish.category}</td>
                        <td>{dish.description}</td>
                        <td>
                            {dish.imageName ? (
                                <img
                                    src={`http://localhost:8080/api/dishes/assets/${dish.imageName}`}
                                    alt={dish.name}
                                    width="100"
                                />
                            ) : (
                                <span>Відсутнє</span>
                            )}
                        </td>
                        <td>
                            <button onClick={() => handleDelete(dish.id)}>Видалити</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default DishManager;

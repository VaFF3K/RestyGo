import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function DishForm() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);

    const handleImageUpload = async () => {
        if (!image) return null;

        const formData = new FormData();
        formData.append("file", image);

        const res = await fetch("http://localhost:8080/api/admin/dishes/upload", {
            method: "POST",
            body: formData,
            credentials: "include"
        });

        const text = await res.text(); // читаємо тільки ОДИН раз

        try {
            const data = JSON.parse(text);
            console.log("Upload success:", data);
            return data.fileName || null;
        } catch (err) {
            console.error("Upload failed: Invalid JSON", err, text);
            return null;
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const imageName = await handleImageUpload();
        const dish = { name, description, price, category, imageName };

        console.log(dish);
        const response = await fetch('http://localhost:8080/api/admin/dishes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dish),
        });

        if (response.ok) {
            alert("Успішно додано!");
            navigate('/admin');
        } else {
            alert('Помилка при додаванні страви');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <h3>Додати до меню</h3>
            <label>Назва<input type="text" placeholder="Назва" value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label>Категорія<input type="text" placeholder="Категорія" value={category} onChange={e => setCategory(e.target.value)} required />
            </label>
            <label>Ціна<input type="number" placeholder="Ціна" value={price} onChange={e => setPrice(e.target.value)} required />
            </label>
            <label>Опис<textarea placeholder="Опис" value={description} onChange={e => setDescription(e.target.value)} required />
            </label>
            <label>Фото<input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </label>
            <button type="submit">Зберегти</button>
        </form>

    );
}

export default DishForm;

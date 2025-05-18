import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function PopularDishes() {
    const [dishes, setDishes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/public/popular-dishes')
            .then(res => res.json())
            .then(data => setDishes(data))
            .catch(err => console.error('Помилка при завантаженні топ-страв:', err));
    }, []);

    return (
        <div className="popular-carousel-wrapper">
            <h3 className="carousel-title">Найпопулярніші страви</h3>
            <Carousel
                key={dishes.length}
                showThumbs={false}
                autoPlay
                infiniteLoop
                showStatus={false}
                showIndicators={true}
                interval={3500}
            >
                {dishes.map((dish, idx) => (
                    <div
                        key={dish.dishId || idx}
                        onClick={() => window.location.href = `/dish/${dish.dishId}`}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src={`http://localhost:8080/api/dishes/assets/${dish.imageName}`}
                            alt={dish.name}
                        />
                        <p className="legend">
                            <strong>{dish.name}</strong><br />
                            {dish.description}
                        </p>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}

export default PopularDishes;





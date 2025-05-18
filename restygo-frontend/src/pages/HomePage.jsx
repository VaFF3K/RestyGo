import React from 'react';
import { useLocation } from 'react-router-dom';
import MenuList from '../components/client/MenuList';
import ReviewsList from '../components/client/ReviewsList';
import OrderPage from '../components/client/OrderPage';
import PopularDishes from '../components/layout/PopularDishes';
import '../styles/ClientView.css';

function HomePage() {
    const location = useLocation();
    const tab = new URLSearchParams(location.search).get("tab");

    return (
        <div className="home-content">
            {!tab && (
                <div className="placeholder">
                    <h2>Вітаємо в RestyGO!</h2>
                    <p>Оберіть вкладку зверху, щоб почати.</p>
                    <PopularDishes />
                </div>
            )}

            {tab === 'menu' && <MenuList />}
            {tab === 'orders' && <OrderPage />}
            {tab === 'reviews' && <ReviewsList />}
        </div>
    );
}

export default HomePage;



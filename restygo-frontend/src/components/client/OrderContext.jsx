import { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export function OrderProvider({ children }) {
    const [items, setItems] = useState([]);

    const addItem = (dish) => {
        setItems(prev => {
            const found = prev.find(i => i.dish.id === dish.id);
            if (found) {
                return prev.map(i =>
                    i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { dish, quantity: 1 }];
        });
    };

    const removeItem = (dishId) => {
        setItems(prev => prev.filter(i => i.dish.id !== dishId));
    };

    const updateQuantity = (dishId, quantity) => {
        setItems(prev =>
            prev.map(i =>
                i.dish.id === dishId ? { ...i, quantity } : i
            )
        );
    };

    const clearOrder = () => setItems([]);

    return (
        <OrderContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearOrder }}>
            {children}
        </OrderContext.Provider>
    );
}

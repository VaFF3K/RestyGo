// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from './components/layout/ProtectedRoute';
import DishForm from './components/admin/DishForm';
import CookForm from "./components/admin/CookForm";
import { OrderProvider } from "./components/client/OrderContext";
import OrderPage from "./components/client/OrderPage";
import ProfilePage from "./components/client/ProfilePage";
import DishPage from "./components/client/DishPage";
import CookOrdersPage from "./pages/CookOrdersPage";
import Layout from './components/layout/Layout';
import DishManager from "./components/admin/DishManager";
import CookManager from "./components/admin/CookManager";
import OrderManager from "./components/admin/OrderManager";
import ReviewManager from "./components/admin/ReviewManager";

import './App.css';
import PublicOnlyRoute from "./components/layout/PublicOnlyRoute"; //глобальні фільтри по сайту

function App() {
    return (

        <Router>
            <OrderProvider>
                <Routes>
                    {/* Auth page — без Layout */}
                    <Route path="/auth" element={<AuthPage />} />

                    {/* Усі інші сторінки — під Layout (з ClientNavbar) */}
                    <Route element={<Layout />}>
                        <Route element={<PublicOnlyRoute />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/order" element={<OrderPage />} />
                        <Route path="/dish/:id" element={<DishPage />} />
                        </Route>
                        {/* Клієнт*/}
                        <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
                        <Route path="/profile" element={<ProfilePage />} />
                        </Route>

                        {/* Панель кухаря*/}
                        <Route element={<ProtectedRoute allowedRoles={['COOK']} />}>
                        <Route path="/cook" element={<CookOrdersPage />} />
                        </Route>

                        {/* Панель адміна*/}
                        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                            <Route path="/admin" element={<AdminPage />} />
                            <Route path="/admin/add-dish" element={<DishForm />} />
                            <Route path="/admin/add-cook" element={<CookForm />} />
                            <Route path="/admin/menu" element={<DishManager />} />
                            <Route path="/admin/cooks" element={<CookManager />} />
                            <Route path="/admin/orders" element={<OrderManager />} />
                            <Route path="/admin/reviews" element={<ReviewManager />} />
                        </Route>
                    </Route>
                </Routes>
            </OrderProvider>
        </Router>
    );
}

export default App;

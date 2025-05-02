import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AdminPage from "./pages/AdminPage";
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import DishForm from './components/admin/DishForm';
import CookForm from "./components/admin/CookForm";
import {OrderProvider} from "./components/client/OrderContext";
import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";
import DishPage from "./pages/DishPage";
import CookOrdersPage from "./pages/CookOrdersPage";
import './App.css';
function App() {
  return (
      <Router>
          <OrderProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
           <Route path="/auth" element={<AuthPage />} />
            <Route
                path="/admin"
                element={
                    <ProtectedAdminRoute>
                        <AdminPage />
                    </ProtectedAdminRoute>
                }
            />
            {/*<Route*/}
            {/*    path="/admin"*/}
            {/*    element={<AdminPage page={new URLSearchParams(window.location.search).get("page")} />}*/}
            {/*/>*/}
            <Route
                path="/admin/add-dish"
                element={
                    <ProtectedAdminRoute>
                        <DishForm />
                    </ProtectedAdminRoute>
                }
            />
            <Route
                path="/admin/add-cook"
                element={
                    <ProtectedAdminRoute>
                        <CookForm />
                    </ProtectedAdminRoute>
                }
            />

            <Route path="/order" element={<OrderPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dish/:id" element={<DishPage />} />
            <Route path="/cook" element={<CookOrdersPage/>} />

        </Routes>
      </OrderProvider>
      </Router>

  );
}

export default App;

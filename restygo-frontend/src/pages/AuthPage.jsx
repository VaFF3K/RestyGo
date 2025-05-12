import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import '../styles/AuthPage.css';

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isLogin ? 'Авторизація' : 'Реєстрація'}</h2>
                <div className="auth-toggle">
                    <button
                        className={isLogin ? 'active' : ''}
                        onClick={() => setIsLogin(true)}
                    >
                        Увійти
                    </button>
                    <button
                        className={!isLogin ? 'active' : ''}
                        onClick={() => setIsLogin(false)}
                    >
                        Зареєструватись
                    </button>
                </div>
                {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>
        </div>
    );
}

export default AuthPage;

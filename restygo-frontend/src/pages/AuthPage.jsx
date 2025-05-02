import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div>
            <h2>{isLogin ? 'Авторизація' : 'Реєстрація'}</h2>
            <div>
                <button onClick={() => setIsLogin(true)}>Увійти</button>
                <button onClick={() => setIsLogin(false)}>Зареєструватись</button>
            </div>
            {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
    );
}

export default AuthPage;

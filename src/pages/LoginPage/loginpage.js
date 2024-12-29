import React, { useState } from 'react';
import './loginpage.css';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const handleToggle = (event) => {
        setIsLogin(event.target.value === 'login');
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        // Handle login form submission here
    };

    const handleRegisterSubmit = (event) => {
        event.preventDefault();
        // Handle register form submission here
    };

    return (
        <main>
            <section className="auth-section">
                <div className="form-container">
                    <input
                        type="radio"
                        id="login"
                        name="toggle"
                        value="login"
                        checked={isLogin}
                        onChange={handleToggle}
                    />
                    <input
                        type="radio"
                        id="register"
                        name="toggle"
                        value="register"
                        checked={!isLogin}
                        onChange={handleToggle}
                    />

                    <div className="toggle-btns">
                        <label htmlFor="login">Login</label>
                        <label htmlFor="register">Register</label>
                    </div>

                    {/* Login Form */}
                    {isLogin && (
                        <div className="form-wrapper login-form">
                            <form onSubmit={handleLoginSubmit} className="auth-form">
                                <h2>Login</h2>
                                <div className="form-group">
                                    <label htmlFor="login-email">Email</label>
                                    <input
                                        type="email"
                                        id="login-email"
                                        name="login-email"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="login-password">Password</label>
                                    <input
                                        type="password"
                                        id="login-password"
                                        name="login-password"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>

                                <button type="submit" className="auth-btn">
                                    Login
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Registration Form */}
                    {!isLogin && (
                        <div className="form-wrapper register-form">
                            <form onSubmit={handleRegisterSubmit} className="auth-form">
                                <h2>Register</h2>
                                <div className="form-group">
                                    <label htmlFor="register-name">Full Name</label>
                                    <input
                                        type="text"
                                        id="register-name"
                                        name="register-name"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="register-email">Email</label>
                                    <input
                                        type="email"
                                        id="register-email"
                                        name="register-email"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="register-password">Password</label>
                                    <input
                                        type="password"
                                        id="register-password"
                                        name="register-password"
                                        placeholder="Create a password"
                                        required
                                    />
                                </div>

                                <button type="submit" className="auth-btn">
                                    Register
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default LoginPage;

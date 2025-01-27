import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './loginpage.css';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        number: '',
        password: '',
        isAdmin: 0,
    });
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const handleToggle = (event) => {
        setIsLogin(event.target.value === 'login');
    };

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        try {
            await addDoc(collection(db, 'users'), signupData);
            alert('Registration successful!');
            setSignupData({ name: '', email: '', number: '', password: '', isAdmin: 0 });
            setIsLogin(true);
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Failed to register. Please try again.');
        }
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const userList = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            const user = userList.find(
                (u) => u.email === loginData.email && u.password === loginData.password
            );

            if (user) {
                alert('Login successful!');
                login(user);

                localStorage.setItem('user', JSON.stringify(user));

                setLoginData({ email: '', password: '' });

                if (user.isAdmin) {
                    navigate('/dashboard');
                } else {
                    navigate('/home');
                }
            } else {
                alert('Invalid email or password.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Error during login. Please try again later.');
        }
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

                    {isLogin ? (
                        <div className="form-wrapper login-form">
                            <form onSubmit={handleLoginSubmit} className="auth-form">
                                <h2>Login</h2>
                                <div className="form-group">
                                    <label htmlFor="login-email">Email</label>
                                    <input
                                        type="email"
                                        id="login-email"
                                        name="email"
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="login-password">Password</label>
                                    <input
                                        type="password"
                                        id="login-password"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                                <button type="submit" className="auth-btn">
                                    Login
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="form-wrapper register-form">
                            <form onSubmit={handleRegisterSubmit} className="auth-form">
                                <h2>Register</h2>
                                <div className="form-group">
                                    <label htmlFor="register-name">Full Name</label>
                                    <input
                                        type="text"
                                        id="register-name"
                                        name="name"
                                        value={signupData.name}
                                        onChange={handleSignupChange}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="register-email">Email</label>
                                    <input
                                        type="email"
                                        id="register-email"
                                        name="email"
                                        value={signupData.email}
                                        onChange={handleSignupChange}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="register-number">Phone Number</label>
                                    <input
                                        type="text"
                                        id="register-number"
                                        name="number"
                                        value={signupData.number}
                                        onChange={handleSignupChange}
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="register-password">Password</label>
                                    <input
                                        type="password"
                                        id="register-password"
                                        name="password"
                                        value={signupData.password}
                                        onChange={handleSignupChange}
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
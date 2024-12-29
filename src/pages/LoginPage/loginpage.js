import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for redirection
import './loginpage.css';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const LoginPage = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [isLogin, setIsLogin] = useState(true);
    const [users, setUsers] = useState([]);
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        number: '',
        password: '',
        isAdmin: 0 // Assuming the field for admin is 'isAdmin'
    });
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    // Fetch users from Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const userList = querySnapshot.docs.map((doc) => ({
                    ...doc.data(), // Spread document data
                    id: doc.id,     // Add Firestore doc ID
                }));
                setUsers(userList);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

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
            navigate('/home');
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
                ...doc.data()
            }));

            const user = userList.find(
                (user) =>
                    user.email === loginData.email && user.password === loginData.password
            );

            if (user) {
                alert('Login successful!');
                // Navigate based on user role (isAdmin)
                console.log(user.isAdmin);
                if (!user.isAdmin) {
                    navigate('/home'); // Redirect to home for admins
                } else {
                    navigate('/dashboard'); // Redirect to dashboard for regular users
                }
            } else {
                alert('Invalid email or password.');
            }

            setLoginData({ email: '', password: '' });

        } catch (error) {
            console.error('Error fetching users:', error);
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

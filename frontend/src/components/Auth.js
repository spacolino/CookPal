import React, { useState } from 'react';
import { signup, login, logout } from '../Api';

const Auth = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleSignup = async () => {
        try {
            await signup({ username, email, password });
            alert('Signup successful, please login');
            setIsLogin(true);
        } catch (error) {
            alert('Signup failed');
        }
    };

    const handleLogin = async () => {
        try {
            await login({ username, password });
            setUser({ username });
        } catch (error) {
            alert('Login failed');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
        } catch (error) {
            alert('Logout failed');
        }
    };

    return (
        <div>
            {isLogin ? (
                <div>
                    <h2>Login</h2>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={() => setIsLogin(false)}>Sign Up</button>
                </div>
            ) : (
                <div>
                    <h2>Sign Up</h2>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button onClick={handleSignup}>Sign Up</button>
                    <button onClick={() => setIsLogin(true)}>Login</button>
                </div>
            )}
            {setUser && (
                <div>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default Auth;
import React, { useState } from 'react';
import { signup, login } from '../Api';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { GoogleLogin } from 'react-google-login';

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

    const handleGoogleLoginSuccess = async (response) => {
        try {
            const googleResponse = await fetch('http://localhost:5000/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: response.tokenId })
            });
            const data = await googleResponse.json();
            if (data.success) {
                setUser(data.user);
            } else {
                alert('Google login failed');
            }
        } catch (error) {
            alert('Google login failed');
        }
    };

    const handleGoogleLoginFailure = (response) => {
        console.log('Google login failed:', response);
        alert('Google login failed');
    };

    return (
        <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>{isLogin ? 'Login' : 'Sign Up'}</Typography>
            <Box>
                {!isLogin && (
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                )}
                <TextField
                    label="Username"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Box mt={2}>
                    {isLogin ? (
                        <>
                            <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>Login</Button>
                            <Button onClick={() => setIsLogin(false)} fullWidth>Sign Up</Button>
                            <GoogleLogin
                                clientId="your-google-client-id"
                                buttonText="Login with Google"
                                onSuccess={handleGoogleLoginSuccess}
                                onFailure={handleGoogleLoginFailure}
                                cookiePolicy={'single_host_origin'}
                                style={{ width: '100%', marginTop: '10px' }}
                            />
                        </>
                    ) : (
                        <>
                            <Button variant="contained" color="primary" onClick={handleSignup} fullWidth>Sign Up</Button>
                            <Button onClick={() => setIsLogin(true)} fullWidth>Login</Button>
                        </>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default Auth;
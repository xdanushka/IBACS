import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Lock, Mail, Key } from 'lucide-react';
import './Login.css';

// Define the props interface
interface LoginProps {
    setAuth: (val: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setAuth }) => {
    const navigate = useNavigate();
    
    // State variables for form fields and UI steps
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [forgotStep, setForgotStep] = useState<'none' | 'email' | 'otp' | 'reset' | 'register'>('none');
    
    // States for password recovery process
    const [resetEmail, setResetEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Check if the user is already authenticated when the component loads
    useEffect(() => {
        if (localStorage.getItem('token') === 'true') {
            navigate('/dashboard');
        }
    }, [navigate]);

    // Handle user login and validate credentials against stored data
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const savedUser = localStorage.getItem('appUsername');
        const savedPass = localStorage.getItem('appPassword');

        if (savedUser && username === savedUser && password === savedPass) {
            localStorage.setItem('token', 'true');
            setAuth(true);
            navigate('/dashboard');
        } else {
            setMessage("Invalid username or password!");
        }
    };

    // Handle user registration and store data in localStorage
    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('appUsername', username);
        localStorage.setItem('appPassword', password);
        setMessage("Account created! Please Login.");
        setForgotStep('none');
    };

    return (
        <div className="login-page">
            <div className="login-card">
                {/* Icon Centered at the top */}
                <div className="card-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <LayoutDashboard size={40} />
                </div>
                
                {/* Descriptive text */}
                <p style={{ color: '#040404', fontSize: '16px', marginBottom: '25px', textAlign: 'center', fontWeight: 'bold' }}>
                    Access your IBACS dashboard
                </p>
                
                {/* Added Login Title */}
                <h2 style={{ textAlign: 'center', margin: '0 0 20px 0',fontWeight: 'bold', fontSize: '30px' }}>Login</h2>
                
                {/* Display feedback messages */}
                {message && <p style={{ color: "green", textAlign: 'center', fontSize: '14px' }}>{message}</p>}
                

                {/* 1. Main Login Form */}
                {forgotStep === 'none' && (
                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="input-group"><User className="input-icon" size={20} /><input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
                        <div className="input-group"><Lock className="input-icon" size={20} /><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                        <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setForgotStep('email'); }} style={{ color: '#007bff', fontSize: '14px', textDecoration: 'none' }}>Forgot Password?</a>
                        </div>
                        <button type="submit" className="login-btn">LOGIN</button>
                        <p style={{ marginTop: '10px', fontSize: '14px', textAlign: 'center' }}>
                                New user? {''}
                            <a 
                                 href="#" 
                                 onClick={(e) => { e.preventDefault(); setForgotStep('register'); }} 
                                 style={{ color: '#007bff', textDecoration: 'none' }}
                             >
                                Register here
                             </a>
                </p>
                    </form>
                )}

                {/* 2. Registration Form */}
                {forgotStep === 'register' && (
                    <form className="login-form" onSubmit={handleRegister}>
                        <div className="input-group"><User className="input-icon" size={20} /><input type="text" placeholder="Set Username" onChange={(e) => setUsername(e.target.value)} required /></div>
                        <div className="input-group"><Lock className="input-icon" size={20} /><input type="password" placeholder="Set Password" onChange={(e) => setPassword(e.target.value)} required /></div>
                        <button type="submit" className="signin-btn">REGISTER</button>
                        <button type="button" className="social-btn" onClick={() => setForgotStep('none')} style={{ marginTop: '10px', width: '100%' }}>Back</button>
                    </form>
                )}

                {/* 3. Password Recovery Steps */}
                {forgotStep === 'email' && (
                    <form className="login-form" onSubmit={(e) => { e.preventDefault(); setForgotStep('otp'); }}>
                        <div className="input-group"><Mail className="input-icon" size={20} /><input type="email" placeholder="Enter Email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required /></div>
                        <button type="submit" className="signin-btn">SEND OTP</button>
                        <button type="button" className="social-btn" onClick={() => setForgotStep('none')} style={{ marginTop: '10px', width: '100%' }}>Back</button>
                    </form>
                )}

                {forgotStep === 'otp' && (
                    <form className="login-form" onSubmit={(e) => { e.preventDefault(); setForgotStep('reset'); }}>
                        <div className="input-group"><Key className="input-icon" size={20} /><input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required /></div>
                        <button type="submit" className="signin-btn">VERIFY OTP</button>
                    </form>
                )}

                {forgotStep === 'reset' && (
                    <form className="login-form" onSubmit={(e) => { e.preventDefault(); localStorage.setItem('appPassword', newPassword); setMessage("Password reset!"); setForgotStep('none'); }}>
                        <div className="input-group"><Lock className="input-icon" size={20} /><input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></div>
                        <button type="submit" className="signin-btn">RESET PASSWORD</button>
                    </form>
                )}
            </div>
        </div>
    );
};

// Export the component as default to resolve the "no default export" error
export default Login;
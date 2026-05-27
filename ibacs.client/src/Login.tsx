import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Lock, Mail, Key } from 'lucide-react';
import './Login.css';
import emailjs from '@emailjs/browser';

interface LoginProps {
    setAuth: (val: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setAuth }) => {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [forgotStep, setForgotStep] = useState<'none' | 'email' | 'otp' | 'reset' | 'SignIn'>('none');
    
    const [resetEmail, setResetEmail] = useState('');
    const [otp, setOtp] = useState(''); 
    const [otpInput, setOtpInput] = useState(''); 
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token') === 'true') {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const savedUser = localStorage.getItem('appUsername');
        const savedPass = localStorage.getItem('appPassword');

        if (savedUser && username === savedUser && password === savedPass) {
            localStorage.setItem('token', 'true');
            setAuth(true);
            navigate('/dashboard');
        } else {
            setError("Invalid username or password!");
            setMessage("");
        }
    };

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('appUsername', username);
        localStorage.setItem('appPassword', password);
        setMessage("Account created! Please Login.");
        setForgotStep('none');
    };

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetEmail) {
            alert("The email field is empty!");
            return;
        }
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const templateParams = { to_email: resetEmail, passcode: generatedOtp };

        emailjs.send('service_t3rzd2c', 'template_to9ngla', templateParams, 'IMNV8j6fFQL_b3WCB')
            .then((_response) => {
                alert("OTP has been sent to your email!");
                setOtp(generatedOtp); 
                setForgotStep('otp');
            }, (error) => {
                console.error("Error:", error);
                alert("Failed to send: " + error.text);
            });
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="card-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <LayoutDashboard size={40} />
                </div>
                
                <p style={{ color: '#040404', fontSize: '16px', marginBottom: '25px', textAlign: 'center', fontWeight: 'bold' }}>
                    Access your IBACS dashboard
                </p>
                
                <h2 style={{ textAlign: 'center', margin: '0 0 20px 0', fontWeight: 'bold', fontSize: '30px' }}>
                    {forgotStep === 'SignIn' ? 'Sign In' : (forgotStep === 'none' ? 'Login' : 'Reset Password')}
                </h2>
                
                {message && <p style={{ color: "green", textAlign: 'center', fontSize: '14px' }}>{message}</p>}
                {error && <p className="error-text">{error}</p>}

                {/* Login Form - No Back Button */}
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
                            <a href="#" onClick={(e) => { e.preventDefault(); setForgotStep('SignIn'); }} style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Sign In here</a>
                        </p>
                    </form>
                )}

                {/* Sign In Form */}
                {forgotStep === 'SignIn' && (
                    <form className="login-form" onSubmit={handleSignIn}>
                        <div className="input-group"><User className="input-icon" size={20} /><input type="text" placeholder="Set Username" onChange={(e) => setUsername(e.target.value)} required /></div>
                        <div className="input-group"><Lock className="input-icon" size={20} /><input type="password" placeholder="Set Password" onChange={(e) => setPassword(e.target.value)} required /></div>
                        <button type="submit" className="login-btn">SIGN IN</button>
                        <button type="button" className="back-btn" onClick={() => setForgotStep('none')}>Back</button>
                    </form>
                )}

                {/* Email Form */}
                {forgotStep === 'email' && (
                    <form className="login-form" onSubmit={handleSendOtp}>
                        <div className="input-group"><Mail className="input-icon" size={20} /><input type="email" placeholder="Enter Email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required /></div>
                        <button type="submit" className="login-btn">SEND OTP</button>
                        <button type="button" className="back-btn" onClick={() => setForgotStep('none')}>Back</button>
                    </form>
                )}

                {/* OTP Form */}
                {forgotStep === 'otp' && (
                    <form className="login-form" onSubmit={(e) => { 
                        e.preventDefault(); 
                        if(otp === otpInput) { setForgotStep('reset'); } else { alert("Invalid OTP!"); }
                    }}>
                        <div className="input-group"><Key className="input-icon" size={20} /><input type="text" placeholder="Enter OTP" onChange={(e) => setOtpInput(e.target.value)} required /></div>
                        <button type="submit" className="login-btn">VERIFY OTP</button>
                        <button type="button" className="back-btn" onClick={() => setForgotStep('email')}>Back</button>
                    </form>
                )}

                {/* Reset Form */}
                {forgotStep === 'reset' && (
                    <form className="login-form" onSubmit={(e) => { e.preventDefault(); localStorage.setItem('appPassword', newPassword); setMessage("Password reset!"); setForgotStep('none'); }}>
                        <div className="input-group"><Lock className="input-icon" size={20} /><input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></div>
                        <button type="submit" className="login-btn">RESET PASSWORD</button>
                        <button type="button" className="back-btn" onClick={() => setForgotStep('none')}>Back</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
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
    
    // State management for inputs and user data
    const [username, setUsername] = useState(''); // Serves as the unique Email
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    // State to track authentication steps
    const [forgotStep, setForgotStep] = useState<'none' | 'email' | 'otp' | 'reset' | 'SignIn'>('none');
    
    // State for password requirement tooltip and OTP timing
    const [isHovered, setIsHovered] = useState(false);
    const [otpTime, setOtpTime] = useState<number | null>(null);

    const [resetEmail, setResetEmail] = useState('');
    const [otp, setOtp] = useState(''); 
    const [otpInput, setOtpInput] = useState(''); 
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token') === 'true') {
            navigate('/dashboard');
        }
    }, [navigate]);

    // Handle user login authentication
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const savedUser = localStorage.getItem('appUsername');
        const savedPass = localStorage.getItem('appPassword');

        if (savedUser && username === savedUser && password === savedPass) {
            localStorage.setItem('token', 'true');
            setAuth(true);
            navigate('/dashboard');
        } else {
            setError("Invalid email or password!");
        }
    };

    // Handle new account creation
    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); 

        const existingUser = localStorage.getItem('appUsername');
        if (existingUser && username === existingUser) {
            setError("Account already created with this email! Please try logging in.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            setError("Please enter a valid email address.");
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError("Password must meet the security requirements.");
            return;
        }

        localStorage.setItem('appUsername', username);
        localStorage.setItem('appPassword', password);
        setMessage("Account created! Please Login.");
        setForgotStep('none');
    };

    // Handle secure OTP sending with timestamp
    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        const savedUser = localStorage.getItem('appUsername');
        
        if (!resetEmail || resetEmail !== savedUser) {
            setError("Please use the same email you used to create your account.");
            return;
        }
        
        setError('');
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const templateParams = { email: resetEmail, passcode: generatedOtp, time: "3 minutes" };

        emailjs.send('service_9dy7loe', 'template_xqhiwhs', templateParams, 'DsG6brdTDKYKH058t')
            .then(() => {
                alert("OTP sent! It will expire in 3 minutes.");
                setOtp(generatedOtp);
                setOtpTime(Date.now()); // Capture the exact time OTP was sent
                setForgotStep('otp');
            }, (_error) => {
                setError("Failed to send OTP. Please try again.");
            });
    };

    // Verify OTP and check for expiration (3 minutes = 300,000ms)
    const verifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        const currentTime = Date.now();
        const expiryLimit = 3 * 60 * 1000; 

        if (otpTime && (currentTime - otpTime > expiryLimit)) {
            setError("OTP expired! Please request a new one.");
            setForgotStep('email'); // Redirect back to request a new OTP
        } else if (otp === otpInput) {
            setError('');
            setForgotStep('reset');
        } else {
            setError("Invalid OTP entered!");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="card-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <LayoutDashboard size={40} />
                </div>
                
                <h2 style={{ textAlign: 'center', margin: '0 0 20px 0', fontWeight: 'bold', fontSize: '30px' }}>
                    {forgotStep === 'SignIn' ? 'Sign In' : (forgotStep === 'none' ? 'Login' : 'Reset Password')}
                </h2>
                
                {message && <p style={{ color: "green", textAlign: 'center', fontSize: '14px' }}>{message}</p>}
                {error && <p className="error-text" style={{ color: "red", textAlign: 'center' }}>{error}</p>}

                {/* Login Step */}
                {forgotStep === 'none' && (
                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="input-group"><User className="input-icon" size={20} /><input type="email" placeholder="Email Address" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
                        <div className="input-group"><Lock className="input-icon" size={20} /><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                        <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setForgotStep('email'); }} style={{ color: '#007bff', fontSize: '14px', textDecoration: 'none' }}>Forgot Password?</a>
                        </div>
                        <button type="submit" className="login-btn">LOGIN</button>
                        <p style={{ marginTop: '10px', fontSize: '14px', textAlign: 'center' }}>
                            New user? <a href="#" onClick={(e) => { e.preventDefault(); setForgotStep('SignIn'); }} style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Sign in here</a>
                        </p>
                    </form>
                )}

                {/* Sign In Step */}
                {forgotStep === 'SignIn' && (
                    <form className="login-form" onSubmit={handleSignIn}>
                        <div className="input-group"><User className="input-icon" size={20} /><input type="email" placeholder="Enter your email" onChange={(e) => setUsername(e.target.value)} required /></div>
                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input type="password" placeholder="Set Password" onChange={(e) => setPassword(e.target.value)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} required />
                        </div>
                        {isHovered && (
                            <div className="pwd-req-box">
                                <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'bold' }}>Password must contain:</p>
                                <ul className="req-list">
                                    <li className={password.length >= 8 ? 'valid' : 'invalid'}>• 8+ characters</li>
                                    <li className={/[A-Z]/.test(password) ? 'valid' : 'invalid'}>• 1 Capital letter</li>
                                    <li className={/\d/.test(password) ? 'valid' : 'invalid'}>• 1 Number</li>
                                    <li className={/[@$!%*#?&]/.test(password) ? 'valid' : 'invalid'}>• 1 Special character</li>
                                </ul>
                            </div>
                        )}
                        <button type="submit" className="login-btn">SIGN IN</button>
                        <button type="button" className="back-btn" onClick={() => setForgotStep('none')}>Back</button>
                    </form>
                )}

                {/* Email, OTP Verification, and Reset Steps */}
                {forgotStep === 'email' && (
                    <form className="login-form" onSubmit={handleSendOtp}>
                        <div className="input-group"><Mail className="input-icon" size={20} /><input type="email" placeholder="Enter Email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required /></div>
                        <button type="submit" className="login-btn">SEND OTP</button>
                        <button type="button" className="back-btn" onClick={() => setForgotStep('none')}>Back</button>
                    </form>
                )}
                {forgotStep === 'otp' && (
                    <form className="login-form" onSubmit={verifyOtp}>
                        <div className="input-group"><Key className="input-icon" size={20} /><input type="text" placeholder="Enter OTP" onChange={(e) => setOtpInput(e.target.value)} required /></div>
                        <button type="submit" className="login-btn">VERIFY OTP</button>
                        <button type="button" className="back-btn" onClick={() => setForgotStep('email')}>Back</button>
                    </form>
                )}
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
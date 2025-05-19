import '../styles/SigninPage.css';
import React from 'react';
import SignInImage from '../assets/signin_image.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { auth } from "../config/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

export default function SigninPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function handleEmail(event) {
        setEmail(event.target.value);
    }

    function handlePassword(event) {
        setPassword(event.target.value);
    }

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home')

        } catch (e) {
            console.error(e);
            if (e.code === 'auth/invalid-credential') {
                setError('Incorrect username or password. Please check again.');
            } else {
                setError('Something went wrong. Please try again later.');
            }
        }

    }

    return (
        <div className="sign-in-page">
            <div className="signin-content">
                <div className="image-side">
                    <img src={SignInImage} alt="Ghost mates" className="signin-image" />
                </div>
                <form className="signin-form" onSubmit={handleSignIn}>
                    <h1 className="signin_header">Sign In</h1>
                    <div className="input-container">
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmail}
                            required
                            className="input-field"
                            placeholder="Enter your email" />
                    </div>

                    <div className="input-container">
                        <input
                            type="password"
                            value={password}
                            onChange={handlePassword}
                            required
                            className="input-field"
                            placeholder="Enter your password" />
                    </div>

                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    <p className="signup-prompt">
                        <Link to="/signup" className="signup-link">Not on Phantomate yet? Sign up</Link>
                    </p>
                    <button className="button_signin" type="submit">Sign In</button>
                </form>
            </div>
            <footer className="footer_signin">
                <p className="about-us">© 2025 | About us</p>
                <div className="social-media">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
            </footer>
        </div>
    );
}
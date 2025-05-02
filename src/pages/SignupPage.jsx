import '../styles/SigninPage.css';
import SignInImage from '../assets/signup.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Authentication service
import { auth } from "../config/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"

export default function SignupPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();


    function handleEmail(event) {
        setEmail(event.target.value);
    }

    function handlePassword(event) {
        setPassword(event.target.value);
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/signin');
        } catch (e) {
            console.error(e);
            if (e.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please sign in instead.');
            } else if (e.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else if (e.code === 'auth/weak-password') {
                setError('Password must be at least 6 characters.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        }

    };


    return (
        <div className="sign-in-page">
            <div className="signin-content">
                <div className="image-side">
                    <img src={SignInImage} alt="Ghost mates" className="signin-image" />
                </div>
                <form className="signin-form" onSubmit={handleSignUp}>
                    <h1 className="signin_header">Create account</h1>
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
                        <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
                    )} // TODO error styling

                    <p className="signup-prompt">
                        <Link to="/signin" className="signup-link">Already a phantom? Sign In</Link>
                    </p>
                    <button className="button_signin" type="submit">Sign Up</button>
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
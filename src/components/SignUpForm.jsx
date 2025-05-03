import '../styles/SignupForm.css';
// import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SignUpForm({ onClose }) {
    // const navigate = useNavigate();

    const [name, setName] = useState('');
    const [pizza, setPizza] = useState('');
    const [joke, setJoke] = useState('');
    const [age, setAge] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('SignUpForm Data:', { name, pizza, joke, age });
        onClose();
    };

    return (
        <div className="sign-up-form">
            <div className="signup-form-content">
                <button className="close-button" onClick={onClose}>×</button>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h1 className="signup_header">Tell Us About Yourself</h1>

                    <div className="input-container">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="input-field"
                        />
                    </div>

                    <div className="input-container">
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Your Age"
                            className="input-field"
                            min="1"
                            max="120"
                        />
                    </div>
                    

                    <div className="input-container">
                        <input
                            type="text"
                            value={pizza}
                            onChange={(e) => setPizza(e.target.value)}
                            placeholder="Favourite Pizza"
                            className="input-field"
                        />
                    </div>

                    <div className="input-container">
                        <textarea
                            value={joke}
                            onChange={(e) => setJoke(e.target.value)}
                            placeholder="Your Best Joke"
                            className="input-field joke-field"
                            rows="5"
                        />
                    </div>

                    <button type="submit" className="button_signin">Continue</button>
                </form>
            </div>
        </div>
    );
}

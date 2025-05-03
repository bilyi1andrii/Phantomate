import '../styles/SignupForm.css';
// import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { db } from "../config/firebase"
import { addDoc, collection } from "firebase/firestore"

export default function SignUpForm({ onClose }) {
    // const navigate = useNavigate();

    const [name, setName] = useState('');
    const [pizza, setPizza] = useState('');
    const [joke, setJoke] = useState('');
    const [age, setAge] = useState('');

    const [error, setError] = useState('');

    const usersRef = collection(db, "users");

    const handleSubmit = async (event) => {
        const nameT = name.trim();
        const pizzaT = pizza.trim();
        const jokeT= joke.trim();

        event.preventDefault();
        setError('');

        if (!nameT) {
            setError('Please enter your name.');
            return;
          }
          if (!age) {
            setError('Please enter your age.');
            return;
          }
          const ageNum = parseInt(age, 10);
          if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
            setError('Age must be a number between 1 and 120.');
            return;
          }
          if (!pizzaT) {
            setError('Please tell us your favourite pizza.');
            return;
          }
          if (!jokeT) {
            setError('Please share your best joke.');
            return;
          }

        try {
            await addDoc(usersRef, {
                username: nameT,
                age: ageNum,
                pizza: pizzaT,
                joke: jokeT
            });
            onClose();

        } catch (e) {
            setError(e.message || 'Something went wrong. Please try again.');
        }

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
                            required
                        />
                    </div>

                    <div className="input-container">
                        <input
                            type="text"
                            value={age}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || /^\d+$/.test(val)) {
                                    setAge(val);
                                    setError('');
                                } else {
                                    setError('Age must be digits only.');
                                }
                            }}
                            placeholder="Your Age"
                            className="input-field"
                            required
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
                            required
                        />
                    </div>

                    <div className="input-container">
                        <textarea
                            value={joke}
                            onChange={(e) => setJoke(e.target.value)}
                            placeholder="Your Best Joke"
                            className="input-field joke-field"
                            required
                            rows="5"
                        />
                    </div>

                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    <button type="submit" className="button_signin">Continue</button>
                </form>
            </div>
        </div>
    );
}

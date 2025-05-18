import React, { useState, useRef, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onSnapshot, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import '../styles/TestPage.css';
import SideBar from '../components/SideBar.jsx';
import BooImage from '../assets/boo.png';

export default function PersonalityTestPage() {
    const [questions, setQuestions] = useState([]);
    const [visibleCount, setVisibleCount] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [me, setMe] = useState(null);

    useEffect(() => {
        let unsubProfile = null;

        const unsubscribeAuth = onAuthStateChanged(auth, user => {
            if (user) {
                unsubProfile = onSnapshot(
                    doc(db, 'users', user.uid),
                    snap => {
                        if (snap.exists()) {
                            setMe({ uid: snap.id, ...snap.data() });
                        } else {
                            setMe({
                                uid: user.uid,
                                username: user.displayName || 'You',
                                photoURL: user.photoURL || ghostIcon
                            });
                        }
                    },
                    err => console.error(err)
                );
            } else {
                setMe(null);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubProfile) unsubProfile();
        };
    }, []);

    const API_KEY = 'Lm4tyKEPUMSUq3xSVgUnHpbUMiotZckb8XzwawTL';

    const handleStartQuiz = async () => {
        if (questions.length === 0) {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get('https://quizapi.io/api/v1/questions', {
                    params: {
                        apiKey: API_KEY,
                        limit: 5,
                        category: 'React',
                        difficulty: 'Easy'
                    }
                });
                setQuestions(res.data);
            } catch (err) {
                console.error('QuizAPI error', err);
                setError('Couldn’t load questions');
            } finally {
                setLoading(false);
            }
        }
        setVisibleCount(1);
    };


    const handleAnswer = (qId, answerKey) => {
        if (answers.some(a => a.id === qId)) return;
        const newAnswers = [...answers, { id: qId, answerKey }];
        setAnswers(newAnswers);

        if (visibleCount < questions.length) {
            setVisibleCount(vc => vc + 1);
        } else {
            const pts = newAnswers.reduce((sum, { id, answerKey }) => {
                const q = questions.find(x => x.id === id);
                return sum + (q?.correct_answers?.[`${answerKey}_correct`] === 'true');
            }, 0);
            setScore(`${pts} out of ${questions.length}`);
        }
    };

    const handleRetake = () => {
        setQuestions([]);
        setAnswers([]);
        setScore(null);
        setVisibleCount(0);
        setError(null);
    };

    return (
        <div className="personality-page">
            <SideBar me={me} />

            <main className="personality-content">
                <div className="intro-section">
                    <div className="intro-text">
                        <h1>JavaScript Quiz ⚡️</h1>
                        <p>Test your JS knowledge one question at a time!</p>
                        {!score && visibleCount === 0 && (
                            <button className="take-test-btn" onClick={handleStartQuiz}>
                                Start Quiz
                            </button>
                        )}

                        {!score && visibleCount > 0 && visibleCount < questions.length && (
                            <button className="take-test-btn" onClick={() => setVisibleCount(vc => vc + 1)}>
                                Next
                            </button>
                        )}

                        {score && (
                            <button className="take-test-btn" onClick={handleRetake}>
                                Retake Quiz
                            </button>
                        )}
                    </div>
                    <img src={BooImage} alt="Ghost Boo" className="boo-image" />
                </div>

                {loading && <p>Loading questions…</p>}
                {error && <p className="error">{error}</p>}

                {!loading && !error && questions.slice(0, visibleCount).map((q, i) => (
                    <div className="question-block" key={q.id}>
                        <p className="question-text">{q.question}</p>
                        <div className="options">
                            {Object.entries(q.answers).map(([key, text]) =>
                                text && (
                                    <label key={key} className="option-circle">
                                        <input
                                            type="radio"
                                            name={`q${i}`}
                                            onChange={() => handleAnswer(q.id, key)}
                                        />
                                        <span className="checkmark" />
                                        {text}
                                    </label>
                                )
                            )}
                        </div>
                    </div>
                ))}

                {score && (
                    <div className="result-section">
                        <h2>Your score:</h2>
                        <p>{score}</p>
                    </div>
                )}
            </main>
        </div>
    );
}

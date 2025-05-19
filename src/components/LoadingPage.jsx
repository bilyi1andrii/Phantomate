import React, { useEffect, useState } from 'react';
import '../styles/LoadingPage.css';
import loadingGif from '../assets/loading.gif';

export default function LoadingPage() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-page">
      <img src={loadingGif} alt="Loading" className="loading-background" />
      <div className="loading-text">
        <span className="loading-word">Loading</span>
        <span className="loading-dots">{dots}</span>
      </div>
    </div>
  );
}
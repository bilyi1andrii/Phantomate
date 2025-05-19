import React, { useEffect, useState } from 'react';
import '../styles/LoadingPage.css';
import loadingGif from '../assets/loadghost.gif';

export default function LoadingPage() {

  return (
    <div className="loading-page">
      <img src={loadingGif} alt="Loading" className="loading-background" />
    </div>
  );
}
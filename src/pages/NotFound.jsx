import React from "react";
import '../styles/NotFound.css';

export default function NotFound() {
    return (
        <div className="notFoundContainer">
            <h1 className="notFoundTitle">404 - Page Not Found</h1>
            <p className="notFoundText">
                Sorry, the page you are looking for does not exist.
            </p>
        </div>
    );
}

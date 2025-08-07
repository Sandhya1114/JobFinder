// src/components/LoadingComponent.js
import React from 'react';
import './LoadingComponent.css';

const LoadingComponent = ({ message = "Loading...", type = "default" }) => {
  if (type === "more") {
    return (
      <div className="loading-more">
        <div className="loading-spinner"></div>
        <p>{message}</p>
      </div>
    );
  }

  if (type === "inline") {
    return (
      <div className="loading-inline">
        <div className="loading-spinner-small"></div>
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className="loading-spinner-large"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingComponent;
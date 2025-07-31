import React from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css'; // Import Mantine styles
import './index.css';
import './scss/builder/ContainerLayout.scss'; // Import container layout styles
import './scss/builder/ContainerStyles.scss'; // Import additional container styles
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

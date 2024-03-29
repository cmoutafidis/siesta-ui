import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {ConfigProvider} from "./core/contexts/ConfigContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ConfigProvider>
        <App />
    </ConfigProvider>
);

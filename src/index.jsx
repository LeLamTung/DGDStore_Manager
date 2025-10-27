import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ConfigProvider } from './contexts/ConfigContext';

import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
const client_id = import.meta.env.VITE_APP_GG_CLIENT_ID;
console.log("Google Client ID:", client_id);
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // <ConfigProvider>
  //   <App />
  // </ConfigProvider>
  <GoogleOAuthProvider clientId={client_id}>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </GoogleOAuthProvider>
);

reportWebVitals();

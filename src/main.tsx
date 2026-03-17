import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import './locale';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleReCaptchaProvider
        reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      >
        <App />
      </GoogleReCaptchaProvider>
    </BrowserRouter>
  </StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './shared/auth/AuthContext';
import { AppTheme } from './mui-theme/AppTheme';
import { applyDocumentTheme } from './shared/config/apply-document-theme.js';
import './ui/ui-unique/variables.css';
import './shared/config/theme-tokens.css';
import './shared/config/theme-keyframes.css';
import './index.css';
import App from './App.jsx';

applyDocumentTheme();

createRoot(document.getElementById('root')).render(<StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppTheme>
          <App />
        </AppTheme>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './styles/themes/lightTheme';
import GlobalStyle from './styles/GlobalStyle';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
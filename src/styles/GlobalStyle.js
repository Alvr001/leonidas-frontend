import { createGlobalStyle } from 'styled-components';
import typography from './typography';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html, body {
    height: 100%;
    font-family: ${typography.families.primary};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    height: 100%;
  }

  button {
    font-family: ${typography.families.primary};
    cursor: pointer;
  }

  input, textarea, select {
    font-family: ${typography.families.primary};
  }

  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primaryBorder};
    border-radius: 4px;
  }
`;

export default GlobalStyle;
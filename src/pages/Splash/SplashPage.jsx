import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Container, Logo, LogoIcon, AppName, Tagline,
  ButtonGroup, PrimaryButton, SecondaryButton, LangButton
} from './SplashPage.styled';

export default function SplashPage() {
  const navigate = useNavigate();
    const { language, changeLanguage, t } = useLanguage();


  const toggleLang = () => changeLanguage(language === 'es' ? 'en' : 'es');

  return (
    <Container style={{ position: 'relative' }}>
      <LangButton onClick={toggleLang}>
        🌐 {language === 'es' ? 'ES' : 'EN'}
      </LangButton>

      <Logo>
        <LogoIcon>🔔</LogoIcon>
        <AppName>Alpheratz</AppName>
        <Tagline>
          {language === 'es'
            ? 'Comunicación grupal con alertas de emergencia'
            : 'Group communication with emergency alerts'}
        </Tagline>
      </Logo>

      <ButtonGroup>
        <PrimaryButton onClick={() => navigate('/register')}>
          {language === 'es' ? 'Registrarse' : 'Sign up'}
        </PrimaryButton>
        <SecondaryButton onClick={() => navigate('/login')}>
          {language === 'es' ? 'Iniciar sesión' : 'Log in'}
        </SecondaryButton>
      </ButtonGroup>
    </Container>
  );
}
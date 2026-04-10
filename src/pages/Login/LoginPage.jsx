import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveSession } from '../../services/authService';
import { useLanguage } from '../../i18n/LanguageContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import {
  Container, Header, BackButton, HeaderTitle, Body,
  Title, Input, ErrorText, PrimaryButton, RegisterLink,InputWrapper, EyeButton
} from './LoginPage.styled';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length >= 6;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      const data = await login({ email, password });
      saveSession(data);
      window.dispatchEvent(new Event('session-changed')); // solo en login
      navigate('/groups');
      navigate('/groups');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && canSubmit) handleLogin();
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>←</BackButton>
        <HeaderTitle>{t('login') || 'Iniciar sesión'}</HeaderTitle>
      </Header>
      <Body>
        <Title>{t('welcomeBack')}</Title>

        <Input
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
        />

        <InputWrapper>
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder={t('passwordPlaceholder')}
    value={password}
    onChange={e => { setPassword(e.target.value); setError(''); }}
    onKeyDown={handleKeyDown}
  />
  <EyeButton type="button" onClick={() => setShowPassword(p => !p)}>
    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
  </EyeButton>
</InputWrapper>

        {error && <ErrorText>{error}</ErrorText>}

        <PrimaryButton disabled={!canSubmit || loading} onClick={handleLogin}>
          {loading ? t('loggingIn') : t('login') || 'Iniciar sesión'}
        </PrimaryButton>

        <RegisterLink>
          {t('noAccount')}{' '}
          <span onClick={() => navigate('/register')}>{t('register')}</span>
        </RegisterLink>
      </Body>
    </Container>
  );
}
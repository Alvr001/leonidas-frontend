import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, saveSession } from '../../services/authService';
import { useLanguage } from '../../i18n/LanguageContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { InputWrapper, EyeButton } from './RegisterPage.styled';
import {
  Container, Header, BackButton, HeaderTitle, Body,
  StepLabel, Title, Input, ErrorText, PrimaryButton,
  SuccessContainer, SuccessIcon, AnimalBadge, SuccessTitle, SuccessSubtitle
} from './RegisterPage.styled';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animalId, setAnimalId] = useState('');

  const canSubmit =
    isValidEmail(email) &&
    name.trim().length >= 2 &&
    password.length >= 6 &&
    password === confirmPassword;

  const handleRegister = async () => {
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      const data = await register({ email, name: name.trim(), password });
      saveSession(data);
      setAnimalId(data.animalId);
      setStep(2);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <Container>
        <Header>
          <HeaderTitle>{t('accountCreated')}</HeaderTitle>
        </Header>
        <Body>
          <SuccessContainer>
            <SuccessIcon>🎉</SuccessIcon>
            <SuccessTitle>{t('accountCreated')}</SuccessTitle>
            <SuccessSubtitle>{t('yourUniqueId')}</SuccessSubtitle>
            <AnimalBadge>{animalId}</AnimalBadge>
            <SuccessSubtitle>{t('saveYourId')}</SuccessSubtitle>
            <PrimaryButton
                style={{ marginTop: 32, width: '100%' }}
                onClick={() => {
                  window.dispatchEvent(new Event('session-changed')); // 🔥 disparar aquí
                  navigate('/groups');
                }}
              >
                {t('enterAlpheratz')}
            </PrimaryButton>
          </SuccessContainer>
        </Body>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>←</BackButton>
        <HeaderTitle>{t('createAccount')}</HeaderTitle>
      </Header>
      <Body>
        <StepLabel>{t('step1of1')}</StepLabel>
        <Title>{t('yourData')}</Title>

        <Input
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          $error={email && !isValidEmail(email)}
        />
        {email && !isValidEmail(email) && (
          <ErrorText>{t('invalidEmail')}</ErrorText>
        )}

        <Input
          type="text"
          placeholder={t('namePlaceholder')}
          value={name}
          onChange={e => { setName(e.target.value); setError(''); }}
        />

        <InputWrapper>
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder={t('passwordPlaceholder')}
    value={password}
    onChange={e => { setPassword(e.target.value); setError(''); }}
  />
  <EyeButton type="button" onClick={() => setShowPassword(p => !p)}>
    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
  </EyeButton>
</InputWrapper>

<InputWrapper $error={confirmPassword && password !== confirmPassword}>
  <input
    type={showConfirm ? 'text' : 'password'}
    placeholder={t('repeatPasswordPlaceholder')}
    value={confirmPassword}
    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
  />
  <EyeButton type="button" onClick={() => setShowConfirm(p => !p)}>
    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
  </EyeButton>
</InputWrapper>
        {confirmPassword && password !== confirmPassword && (
          <ErrorText>{t('passwordsNoMatch')}</ErrorText>
        )}

        {error && <ErrorText style={{ marginTop: 4 }}>{error}</ErrorText>}

        <PrimaryButton disabled={!canSubmit || loading} onClick={handleRegister}>
          {loading ? t('creating') : t('createAccount')}
        </PrimaryButton>
      </Body>
    </Container>
  );
}
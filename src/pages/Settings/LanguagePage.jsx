import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { Icon } from '../../components/Button/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Container, Header, HeaderTitle,
  SettingItem, SettingInfo, SettingTitle
} from './SettingsPage.styled';

const LANGUAGES = [
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'English' }
];

function LanguagePage() {
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();
  const [selected, setSelected] = useState(language);

  const handleSelect = (lang) => {
    setSelected(lang);
    changeLanguage(lang);
  };

  return (
    <Container>
      <Header>
        <Icon onClick={() => navigate(-1)}>
          <FiArrowLeft size={22} color="white" />
        </Icon>
        <HeaderTitle>Idioma / Language</HeaderTitle>
      </Header>

      {LANGUAGES.map(lang => (
        <SettingItem key={lang.id} onClick={() => handleSelect(lang.id)}>
          <SettingInfo>
            <SettingTitle>{lang.label}</SettingTitle>
          </SettingInfo>
          {selected === lang.id && (
            <FiCheck size={20} color="#F4A435" />
          )}
        </SettingItem>
      ))}
    </Container>
  );
}

export default LanguagePage;
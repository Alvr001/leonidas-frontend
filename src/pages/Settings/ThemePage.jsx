import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiSun, FiMoon } from 'react-icons/fi';
import { Icon } from '../../components/Button/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Container, Header, HeaderTitle,
  SettingItem, SettingIcon, SettingInfo, SettingTitle, SettingSubtext
} from './SettingsPage.styled';

function ThemePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selected, setSelected] = useState('light');

  const THEMES = [
    {
      id: 'light',
      label: t('themeLight'),
      subtitle: t('themeDefault'),
      icon: <FiSun size={18} color="#F4A435" />,
      iconBg: '#FFF0CC',
      disabled: false
    },
    {
      id: 'dark',
      label: t('themeDark'),
      subtitle: t('themeComingSoon'),
      icon: <FiMoon size={18} color="#8B5CF6" />,
      iconBg: '#EDE9FE',
      disabled: true
    }
  ];

  return (
    <Container>
      <Header>
        <Icon onClick={() => navigate(-1)}>
          <FiArrowLeft size={22} color="white" />
        </Icon>
        <HeaderTitle>{t('theme')}</HeaderTitle>
      </Header>

      {THEMES.map(theme => (
        <SettingItem
          key={theme.id}
          disabled={theme.disabled}
          onClick={() => !theme.disabled && setSelected(theme.id)}
        >
          <SettingIcon color={theme.iconBg}>
            {theme.icon}
          </SettingIcon>
          <SettingInfo>
            <SettingTitle>{theme.label}</SettingTitle>
            <SettingSubtext>{theme.subtitle}</SettingSubtext>
          </SettingInfo>
          {selected === theme.id && (
            <FiCheck size={20} color="#F4A435" />
          )}
        </SettingItem>
      ))}
    </Container>
  );
}

export default ThemePage;
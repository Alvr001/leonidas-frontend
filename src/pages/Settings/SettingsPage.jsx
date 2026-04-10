import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMoon, FiGlobe, FiChevronRight, FiUsers, FiLogOut, FiTrash2 } from 'react-icons/fi';
import { Icon } from '../../components/Button/Button';
import Avatar from '../../components/Avatar/Avatar';
import { clearSession, getToken } from '../../services/authService';
import { useLanguage } from '../../i18n/LanguageContext';
import { usePendingRequests } from '../../context/FriendRequestsContext';
import {
  Container, Header, HeaderTitle, ProfileSection,
  ProfileInfo, ProfileName, ProfileId, SectionTitle,
  SettingItem, SettingIcon, SettingInfo, SettingTitle, SettingSubtext,
  ModalOverlay, ModalBox, ModalTitle, ModalSub, ModalBtns,
  BtnConfirm, BtnCancelModal, BtnDanger,
} from './SettingsPage.styled';

const SETTINGS = [
  {
    section: 'account',
    items: [
      {
        id: 'profile',
        title: 'profile',
        subtitle: 'profileSubtitle',
        icon: <FiUser size={18} color="#F4A435" />,
        iconBg: '#FFF0CC',
        disabled: false,
        route: '/settings/profile'
      }
    ]
  },
  {
    section: 'appearance',
    items: [
      {
        id: 'theme',
        title: 'theme',
        subtitle: 'themeSubtitle',
        icon: <FiMoon size={18} color="#8B5CF6" />,
        iconBg: '#EDE9FE',
        disabled: false,
        route: '/settings/theme'
      }
    ]
  },
  {
    section: 'general',
    items: [
      {
        id: 'language',
        title: 'language',
        subtitle: 'languageSubtitle',
        icon: <FiGlobe size={18} color="#06B6D4" />,
        iconBg: '#CFFAFE',
        disabled: false,
        route: '/settings/language'
      },
      {
        id: 'friends',
        title: 'friends',
        subtitle: 'friendsSubtitle',
        icon: <FiUsers size={18} color="#9B59B6" />,
        iconBg: '#F3EBF8',
        disabled: false,
        route: '/friends'
      }
    ]
  }
];

function SettingsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { pendingCount, hasNewFriend } = usePendingRequests();

  const userId       = parseInt(localStorage.getItem('userId'));
  const userName     = localStorage.getItem('userName') || 'Usuario';
  const userAnimalId = localStorage.getItem('userAnimalId') || '';

  const [showLogout,  setShowLogout]  = useState(false);
  const [showDelete,  setShowDelete]  = useState(false);

  const handleLogout = () => {
  clearSession();
  window.dispatchEvent(new Event('session-changed'));
  navigate('/');
};

const handleDeleteAccount = async () => {
  try {
    const token = getToken();
    await fetch(`http://localhost:8080/api/auth/delete`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e) {
    console.error('Error eliminando cuenta:', e);
  } finally {
    clearSession();
    window.dispatchEvent(new Event('session-changed'));
    navigate('/');
  }
  };

  return (
    <Container>
      <Header>
        <Icon onClick={() => navigate('/groups')}>
          <FiArrowLeft size={22} color="white" />
        </Icon>
        <HeaderTitle>{t('settings')}</HeaderTitle>
      </Header>

      {/* Fila de perfil — sin flecha */}
      <ProfileSection>
        <Avatar name={userName} id={userId} size="lg" />
        <ProfileInfo>
          <ProfileName>{userName}</ProfileName>
          <ProfileId>{userAnimalId}</ProfileId>
        </ProfileInfo>
      </ProfileSection>

      {/* Secciones normales */}
      {SETTINGS.map(section => (
  <React.Fragment key={section.section}>
    <SectionTitle>{t(section.section)}</SectionTitle>
    {section.items.map(item => (
      <SettingItem
        key={item.id}
        disabled={item.disabled}
        onClick={() => item.route && navigate(item.route)}
      >
        <SettingIcon color={item.iconBg}>
          {item.icon}
        </SettingIcon>

        <SettingInfo>
          <SettingTitle>{t(item.title)}</SettingTitle>
          <SettingSubtext>{t(item.subtitle)}</SettingSubtext>
        </SettingInfo>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  {item.id === 'friends' && pendingCount > 0 && (
    <div style={{
      background: '#E63946',
      color: 'white',
      borderRadius: 10,
      padding: '2px 7px',
      fontSize: 11,
      fontWeight: 700,
      minWidth: 18,
      textAlign: 'center',
    }}>
      {pendingCount}
    </div>
  )}
  {item.id === 'friends' && hasNewFriend && pendingCount === 0 && (
    <div style={{
      width: 10,
      height: 10,
      background: '#2E9E68',
      borderRadius: '50%',
    }} />
  )}
  <FiChevronRight size={18} color="#BBB" />
</div>
      </SettingItem>
    ))}
  </React.Fragment>
))}

      {/* ── CERRAR SESIÓN ── */}
      <SectionTitle>{t('session')}</SectionTitle>
      <SettingItem onClick={() => setShowLogout(true)}>
        <SettingIcon color="#FFF0EE">
          <FiLogOut size={18} color="#E07B5A" />
        </SettingIcon>
        <SettingInfo>
          <SettingTitle style={{ color: '#E07B5A' }}>{t('logout')}</SettingTitle>
        </SettingInfo>
        <FiChevronRight size={18} color="#BBB" />
      </SettingItem>

      {/* ── ELIMINAR CUENTA ── */}
      <SettingItem onClick={() => setShowDelete(true)} style={{ marginBottom: '2rem' }}>
        <SettingIcon color="#FFF0F0">
          <FiTrash2 size={18} color="#E63946" />
        </SettingIcon>
        <SettingInfo>
          <SettingTitle style={{ color: '#E63946' }}>{t('deleteAccount')}</SettingTitle>
        </SettingInfo>
        <FiChevronRight size={18} color="#BBB" />
      </SettingItem>

      {/* ── MODAL CERRAR SESIÓN ── */}
      {showLogout && (
        <ModalOverlay onClick={() => setShowLogout(false)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalTitle>{t('logoutTitle')}</ModalTitle>
            <ModalSub>{t('logoutSub')}</ModalSub>
            <ModalBtns>
              {/* Sí — no hace nada por ahora */}
              <BtnConfirm onClick={handleLogout}>
                {t('yes')}
              </BtnConfirm>
              <BtnCancelModal onClick={() => setShowLogout(false)}>
                {t('no')}
              </BtnCancelModal>
            </ModalBtns>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* ── MODAL ELIMINAR CUENTA ── */}
      {showDelete && (
        <ModalOverlay onClick={() => setShowDelete(false)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalTitle>{t('deleteAccountTitle')}</ModalTitle>
            <ModalSub>{t('deleteAccountSub')}</ModalSub>
            <ModalBtns>
              {/* Sí — no hace nada por ahora */}
              <BtnDanger onClick={handleDeleteAccount}>
                {t('yes')}
              </BtnDanger>
              <BtnCancelModal onClick={() => setShowDelete(false)}>
                {t('no')}
              </BtnCancelModal>
            </ModalBtns>
          </ModalBox>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default SettingsPage;
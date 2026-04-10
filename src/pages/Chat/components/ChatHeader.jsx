import React from 'react';
import { FiArrowLeft, FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../components/Button/Button';
import Avatar from '../../../components/Avatar/Avatar';
import { useLanguage } from '../../../i18n/LanguageContext';
import {
  HeaderContainer, HeaderInfo, HeaderName, HeaderMembers
} from './ChatHeader.styled';

function ChatHeader({ groupName, groupId, members, isMember, groupPhoto }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const userId = parseInt(localStorage.getItem('userId'));

  const memberNames = members && members.length > 0
    ? members.map(m => m.id === userId ? t('you') : m.name).join(', ')
    : isMember === false
      ? t('notMemberChat')
      : t('loading');


  const handleMenuClick = () => {
    localStorage.setItem('currentGroupName', groupName);
    navigate(`/group-info/${groupId}`);
  };

  return (
    <HeaderContainer>
      <Icon onClick={() => navigate('/groups')}>
        <FiArrowLeft size={22} color="#FFFFFF" />
      </Icon>
      <Avatar name={groupName} id={groupId} size="md" src={groupPhoto || null} />
      <HeaderInfo>
        <HeaderName>{groupName}</HeaderName>
        <HeaderMembers>{memberNames}</HeaderMembers>
      </HeaderInfo>
      <Icon onClick={handleMenuClick}>
        <FiMenu size={22} color="#FFFFFF" />
      </Icon>
    </HeaderContainer>
  );
}

export default ChatHeader;
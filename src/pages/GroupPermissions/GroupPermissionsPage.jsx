import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Icon } from '../../components/Button/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import { getGroupById, updateGroupPermissions, sendMessage } from '../../services/api';
import {
  Container, Header, HeaderTitle, SectionTitle,
  PermissionItem, PermissionInfo, PermissionTitle,
  PermissionDesc, Toggle
} from './GroupPermissionsPage.styled';

function GroupPermissionsPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const userId = parseInt(localStorage.getItem('userId'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState({
    canMembersEditInfo: true,
    canMembersSendMessages: true,
    canMembersAddMembers: true,
  });

  useEffect(() => {
    loadGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const loadGroup = async () => {
  try {
    const res = await getGroupById(groupId);
    const group = res.data;
    // Forzar mismo tipo
    setIsAdmin(Number(group.admin?.id) === Number(userId));
    setPermissions({
      canMembersEditInfo: group.canMembersEditInfo ?? true,
      canMembersSendMessages: group.canMembersSendMessages ?? true,
      canMembersAddMembers: group.canMembersAddMembers ?? true,
    });
  } catch (err) {
    console.error(err);
  }
};

 const togglePermission = async (key) => {
  if (!isAdmin) return;
  const updated = { ...permissions, [key]: !permissions[key] };
  setPermissions(updated);
  try {
    setSaving(true);
    await updateGroupPermissions(groupId, updated);
    // Broadcast para que ChatPage actualice permisos en tiempo real
    await sendMessage({
      content: `__PERMISSIONS_UPDATED__:${JSON.stringify(updated)}`,
      type: 'SYSTEM',
      senderId: null,
      groupId: parseInt(groupId)
    });
  } catch (err) {
    setPermissions(permissions);
    console.error(err);
  } finally {
    setSaving(false);
  }
};

  const PERMISSIONS = [
    {
      key: 'canMembersEditInfo',
      titleKey: 'editGroupSettings',
      descKey: 'editGroupSettingsDesc',
    },
    {
      key: 'canMembersSendMessages',
      titleKey: 'sendMessages',
      descKey: 'sendMessagesDesc',
    },
    {
      key: 'canMembersAddMembers',
      titleKey: 'addMembers',
      descKey: 'addMembersDesc',
    },
  ];

  return (
    <Container>
      <Header>
        <Icon onClick={() => navigate(-1)}>
          <FiArrowLeft size={22} color="white" />
        </Icon>
        <HeaderTitle>{t('groupPermissions')}</HeaderTitle>
      </Header>

      <SectionTitle>{t('membersCan')}</SectionTitle>

      {PERMISSIONS.map(p => (
        <PermissionItem key={p.key}>
          <PermissionInfo>
            <PermissionTitle>{t(p.titleKey)}</PermissionTitle>
            <PermissionDesc>{t(p.descKey)}</PermissionDesc>
          </PermissionInfo>
          <Toggle
            $enabled={permissions[p.key]}
            onClick={() => togglePermission(p.key)}
            style={{ opacity: isAdmin ? 1 : 0.5, cursor: isAdmin ? 'pointer' : 'not-allowed' }}
          />
        </PermissionItem>
      ))}

      {!isAdmin && (
        <p style={{ textAlign: 'center', color: '#999', fontSize: 13, marginTop: 16 }}>
          {t('comingSoon')}
        </p>
      )}

    </Container>
  );
}

export default GroupPermissionsPage;
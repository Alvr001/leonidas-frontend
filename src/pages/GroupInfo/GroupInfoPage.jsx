import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGroupMembers, isFormerMember, getGroupById, getGroupImages } from '../../services/api';
import GroupInfoHeader from './components/GroupInfoHeader/GroupInfoHeader';
import GroupMedia from './components/GroupMedia/GroupMedia';
import GroupMembers from './components/GroupMembers/GroupMembers';
import { API_URL, WS_URL } from '../../config';
import GroupActions from './components/GroupActions/GroupActions';
import { Container, FormerMemberBar } from './GroupInfoPage.styled';
import { useLanguage } from '../../i18n/LanguageContext';
import { Client } from '@stomp/stompjs';

function GroupInfoPage() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [isFormer, setIsFormer] = useState(false);
  const [mediaMessages, setMediaMessages] = useState([]);
  const stompRef = useRef(null);
  const [canMembersAddMembers, setCanMembersAddMembers] = useState(true);
  const [canMembersEditInfo, setCanMembersEditInfo]     = useState(true);
  const [canMembersSendMessages, setCanMembersSendMessages] = useState(true);

  const { t } = useLanguage();
  const userId = parseInt(localStorage.getItem('userId'));

  // ── wasAdmin: se guarda en localStorage para sobrevivir recargas ─────────
  // Clave: "wasAdmin_{groupId}_{userId}"
  const wasAdminKey = `wasAdmin_${groupId}_${userId}`;
  const [wasAdmin, setWasAdminState] = useState(
    () => localStorage.getItem(wasAdminKey) === 'true'
  );
  const setWasAdmin = (value) => {
    localStorage.setItem(wasAdminKey, String(value));
    setWasAdminState(value);
  };
  const handleMemberAdded = () => {
  window.dispatchEvent(new Event('groups-changed'));
  loadGroupInfo();
  };

  useEffect(() => {
    loadGroupInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  useEffect(() => {
    const client = new Client({
      brokerURL:  WS_URL,
      reconnectDelay: 3000,
      onConnect: () => {
        client.subscribe(`/topic/chat/${groupId}`, (msg) => {
          try {
            const parsed = JSON.parse(msg.body);
            if (parsed.type === 'SYSTEM' && parsed.content?.startsWith('__PERMISSIONS_UPDATED__:')) {
              try {
                const json = parsed.content.replace('__PERMISSIONS_UPDATED__:', '');
                const updated = JSON.parse(json);
                setCanMembersEditInfo(updated.canMembersEditInfo ?? true);
                setCanMembersSendMessages(updated.canMembersSendMessages ?? true);
                setCanMembersAddMembers(updated.canMembersAddMembers ?? true);
              } catch (e) {}
              return;
            }
            if (parsed.type === 'SYSTEM' && parsed.content === '__GROUP_UPDATED__') {
              loadGroupInfo();
            }
          } catch (e) {}
        });
      },
    });
    client.activate();
    stompRef.current = client;
    return () => { client.deactivate(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const loadGroupInfo = async () => {
    try {
      const [membersRes, formerRes, groupRes] = await Promise.all([
        getGroupMembers(groupId),
        isFormerMember(groupId, userId),
        getGroupById(groupId),
      ]);

      const isMemberAdmin = Number(groupRes.data.admin?.id) === Number(userId);
      const formerStatus  = formerRes.data;

      setMembers(membersRes.data);
      setIsFormer(formerStatus);
      setGroup({
        ...groupRes.data,
        memberCount: membersRes.data.length,
        isFormer: formerStatus,
      });
      setCanMembersEditInfo(groupRes.data.canMembersEditInfo ?? true);
      setCanMembersSendMessages(groupRes.data.canMembersSendMessages ?? true);
      setCanMembersAddMembers(groupRes.data.canMembersAddMembers ?? true);

      // Si es miembro activo → actualizar wasAdmin en localStorage
      // Si ya es ex-miembro → NO tocar (preservar el true guardado antes de salir)
      if (!formerStatus) {
        setWasAdmin(isMemberAdmin);
      }
    } catch (err) {
      console.error('loadGroupInfo ERROR:', err);
    }

    try {
      const imagesRes = await getGroupImages(groupId);
      setMediaMessages(imagesRes.data);
    } catch (err) {
      console.error('Error cargando media:', err);
      setMediaMessages([]);
    }
  };

  const isAdmin = Number(group?.admin?.id) === Number(userId);

  return (
    <Container>
      <GroupInfoHeader
        group={group}
        currentUserId={userId}
        isFormer={isFormer}
        onGroupUpdated={loadGroupInfo}
        canEditInfo={isAdmin || canMembersEditInfo}
      />

      {isFormer && (
        <FormerMemberBar>
          {t('notMemberGroup')}
        </FormerMemberBar>
      )}

      <GroupMedia mediaMessages={mediaMessages} groupId={groupId} />

      <GroupMembers
        members={members}
        adminId={group?.admin?.id}
        currentUserId={userId}
        isFormer={isFormer}
        groupId={parseInt(groupId)}
        onMemberAdded={handleMemberAdded}
        canAddMembers={isAdmin || canMembersAddMembers}
      />

      <GroupActions
        groupId={parseInt(groupId)}
        groupName={group?.name}
        isFormer={isFormer}
        isAdmin={isAdmin}
        wasAdmin={wasAdmin}
        onChatCleared={loadGroupInfo} 
      />
    </Container>
  );
}

export default GroupInfoPage;
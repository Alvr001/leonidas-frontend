import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiUsers, FiX,FiBellOff } from 'react-icons/fi';
import { VscChatSparkle } from 'react-icons/vsc';
import { Client } from '@stomp/stompjs';
import { API_URL, WS_URL } from '../../config';
import { getGroupsByUser, createGroup, joinGroup, getGroups, getLastMessage, isFormerMember } from '../../services/api';
import { Icon } from '../../components/Button/Button';
import Button from '../../components/Button/Button';
import Avatar from '../../components/Avatar/Avatar';
import { useLanguage } from '../../i18n/LanguageContext';
import { useFriendRequests } from '../../hooks/useFriendRequests';
import { usePendingRequests } from '../../context/FriendRequestsContext';
import {
  Container, Header, HeaderTitle, ChatList, ChatItem,
  ChatInfo, ChatName, ChatPreview, ChatMeta, ChatTime,
  EmptyState, EmptyText, EmptySubtext, FabButton,
  Overlay, Modal, ModalTitle, ModalInput, ModalButtons,
  JoinItem, JoinItemInfo, JoinItemName, JoinItemDesc,
  JoinListScroll, SearchBar, SearchInput
} from './GroupsPage.styled';
import styled from 'styled-components';

const UnreadBadge = styled.div`
  background: #E63946;
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
`;

const INTERNAL_SYSTEM = [
  '__CHAT_CLEARED__',
  '__GROUP_UPDATED__',
  '__PERMISSIONS_UPDATED__',
  '__GROUP_DELETED__',
  '__LEFT_AND_DELETED__',
];

const normalizeDate = (d) => d?.toString().replace('Z', '');
const formatPreviewTime = (createdAt) => {
  if (!createdAt) return '';
  return new Date(normalizeDate(createdAt)).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
};

function GroupsPage() {
  const userId = parseInt(localStorage.getItem('userId'));

  // 🔥 REFS PRIMERO (ANTES DE TODO)
  const stompClientRef = useRef(null);
  const wsConnected = useRef(false);
  const openChatIdRef = useRef(null);
  // 🔥 NUEVO
  const unreadCountsRef = useRef({});

  // 🔥 LUEGO STATES
  const [groups, setGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const [unreadCounts, setUnreadCounts] = useState(() => {
  try {
    const saved = localStorage.getItem(`unread_${userId}`);
    const parsed = saved ? JSON.parse(saved) : {};
    unreadCountsRef.current = parsed; // 🔥 inicializar ref también
    return parsed;
  } catch { return {}; }
});

const updateUnread = (updater) => {
  setUnreadCounts(prev => {
    const next = typeof updater === 'function' ? updater(prev) : updater;
    unreadCountsRef.current = next; // 🔥 sincronizar ref
    localStorage.setItem(`unread_${userId}`, JSON.stringify(next));
    return next;
  });
};

  const navigate = useNavigate();
  const { t } = useLanguage();
  
 const { pendingCount, hasNewFriend } = usePendingRequests();

  const isGroupMuted = (groupId) => {
  const raw = localStorage.getItem(`muted_${userId}_${groupId}`);
  if (!raw) return false;
  const { until } = JSON.parse(raw);
  if (until === 'forever') return true;
  return new Date(until) > new Date();
  };
  

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

useEffect(() => {
  loadGroups(); // 🔥 carga inicial
  openChatIdRef.current = null; 

  const handleFocus = () => loadGroups();
  const handleGroupsChanged = () => loadGroups();

  window.addEventListener('focus', handleFocus);
  window.addEventListener('groups-changed', handleGroupsChanged);

  return () => {
    window.removeEventListener('focus', handleFocus);
    window.removeEventListener('groups-changed', handleGroupsChanged);
  };
}, []);

  useEffect(() => {
    if (groups.length === 0 || wsConnected.current) return;
    wsConnected.current = true;
    connectGlobalWebSocket(groups);
    return () => {
      wsConnected.current = false;
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [groups.length]);

  const connectGlobalWebSocket = (groupList) => {
    if (stompClientRef.current) stompClientRef.current.deactivate();

    const client = new Client({
      brokerURL:  WS_URL,
      reconnectDelay: 5000,
      onConnect: () => {
  // 🔥 chats (igual que antes)
  groupList.forEach(group => {
    client.subscribe(`/topic/chat/${group.id}`, (msg) => {
      try {
        const parsed = JSON.parse(msg.body);
        const content = parsed.content || '';

        if (parsed.type === 'SYSTEM' && content.startsWith('__GROUP_DELETED__')) {
          setGroups(prev => prev.filter(g => g.id !== group.id));
          return;
        }

        if (parsed.type === 'SYSTEM' && content.startsWith('__LEFT_AND_DELETED__')) {
          const leftUserId = parseInt(content.split(':')[1]);

          if (leftUserId === userId) {
            localStorage.setItem(`hidden_group_${userId}_${group.id}`, 'true');
            setGroups(prev => prev.filter(g => g.id !== group.id));
          }
          return;
        }

        if (parsed.type === 'SYSTEM' && content.startsWith('__CHAT_CLEARED__')) {
          const clearerId = parseInt(content.split(':')[1]);
          if (clearerId === userId) {
            setGroups(prev => {
              const updated = prev.map(g =>
                g.id === group.id ? { ...g, lastMessage: parsed } : g
              );
              // Mover el grupo con mensaje nuevo al principio
              const idx = updated.findIndex(g => g.id === group.id);
              if (idx > 0) {
                const [moved] = updated.splice(idx, 1);
                return [moved, ...updated];
              }
              return updated;
            });
          }
          return;
        }

        if (parsed.type === 'SYSTEM' && INTERNAL_SYSTEM.some(k => content.startsWith(k))) return;
        if (parsed.type === 'SYSTEM') return;

        setGroups(prev => {
  const updated = prev.map(g =>
    g.id === group.id ? { ...g, lastMessage: parsed } : g
  );

  // 🔥 mover el grupo actualizado al top
  const idx = updated.findIndex(g => g.id === group.id);
  if (idx > 0) {
    const [moved] = updated.splice(idx, 1);
    return [moved, ...updated];
  }

  return updated;
});

if (parsed.sender?.id !== userId) {
  if (openChatIdRef.current !== group.id) {
    // 🔥 Leer del ref (siempre fresco) y escribir directo
    const current = unreadCountsRef.current;
    const next = {
      ...current,
      [group.id]: (current[group.id] || 0) + 1,
    };
    unreadCountsRef.current = next;
    localStorage.setItem(`unread_${userId}`, JSON.stringify(next));
    setUnreadCounts(next); // 🔥 actualizar state directo, sin closure
  }
}

      } catch (e) {
        console.error('Error parseando mensaje WS:', e);
      }
    });
  });

  // 🔥 NUEVO (NO reemplaza nada, solo se agrega)
  client.subscribe(`/topic/user/${userId}`, (msg) => {
    try {
      const parsed = JSON.parse(msg.body);

      if (parsed.type === 'GROUP_ADDED') {
        loadGroups();
      }
    } catch (e) {
      console.error('Error en topic user:', e);
    }
  });
  },
      onDisconnect: () => console.log('WS global desconectado'),
      onStompError: (frame) => console.error('STOMP global error:', frame),
    });

    client.activate();
    stompClientRef.current = client;
  };

  const loadGroups = async () => {
  try {
    const response = await getGroupsByUser(userId);

    const groupsWithMessages = await Promise.all(
      response.data.map(async (group) => {
        try {
          const [msgRes, formerRes] = await Promise.all([
            getLastMessage(group.id, userId),
            isFormerMember(group.id, userId),
          ]);

          const isMemberNow = !formerRes.data;

          // 🔥 Si volvió al grupo → quitar hidden
          if (isMemberNow) {
            localStorage.removeItem(`hidden_group_${userId}_${group.id}`);
          }

          const isHidden =
            localStorage.getItem(`hidden_group_${userId}_${group.id}`) === 'true';

          // 🔥 Si está oculto y sigue fuera → no mostrar
          if (isHidden && !isMemberNow) return null;

          return {
            ...group,
            lastMessage: msgRes.data,
            isFormer: formerRes.data,
          };
        } catch {
          return {
            ...group,
            lastMessage: null,
            isFormer: false,
          };
        }
      })
    );

    // 🔥 quitar nulls
    // 🔥 quitar nulls
const filtered = groupsWithMessages.filter(Boolean);

// 🔥 ORDENAR por último mensaje (más reciente arriba)
filtered.sort((a, b) => {
  const dateA = a.lastMessage?.createdAt
    ? new Date(a.lastMessage.createdAt)
    : new Date(0);

  const dateB = b.lastMessage?.createdAt
    ? new Date(b.lastMessage.createdAt)
    : new Date(0);

  return dateB - dateA;
});

setGroups(filtered);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
  
 const handleOpenChat = (group) => {
  openChatIdRef.current = group.id;
  // 🔥 Limpiar también el ref
  const next = { ...unreadCountsRef.current, [group.id]: 0 };
  unreadCountsRef.current = next;
  localStorage.setItem(`unread_${userId}`, JSON.stringify(next));
  setUnreadCounts(next);
  navigate(`/chat/${group.id}`, { state: { groupName: group.name } });
};

  const handleCreateGroup = async () => {
    if (!groupName) return;
    try {
      await createGroup({ name: groupName, description: groupDesc, adminId: userId });
      setGroupName(''); setGroupDesc(''); setShowCreate(false);
      loadGroups();
    } catch (err) { console.error(err); }
  };

  const handleShowJoin = async () => {
    try {
      const response = await getGroups();
      const myGroupIds = groups.map(g => g.id);
      setAllGroups(response.data.filter(g => !myGroupIds.includes(g.id)));
      setShowJoin(true);
    } catch (err) { console.error(err); }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId, userId);
      setShowJoin(false);
      loadGroups();
    } catch (err) { console.error(err); }
  };

  return (
    <Container>
      <Header>
  <div style={{ position: 'relative' }}>
    <Icon onClick={() => navigate('/settings')}>
      <FiMenu size={24} color="#FFFFFF" />
    </Icon>

    {/* Punto rojo — solicitud recibida */}
    {pendingCount > 0 && (
      <div style={{
        position: 'absolute',
        top: 2, right: 2,
        width: 10, height: 10,
        background: '#E63946',
        borderRadius: '50%',
        border: '2px solid #FFB347',
        pointerEvents: 'none',
      }} />
    )}

    {/* Punto verde — te aceptaron como amigo */}
    {hasNewFriend && pendingCount === 0 && (
      <div style={{
        position: 'absolute',
        top: 2, right: 2,
        width: 10, height: 10,
        background: '#2E9E68',
        borderRadius: '50%',
        border: '2px solid #FFB347',
        pointerEvents: 'none',
      }} />
    )}
  </div>

  <HeaderTitle>{t('appName')}</HeaderTitle>

  <Icon onClick={() => setShowSearch(!showSearch)}>
    <FiSearch size={24} color={showSearch ? '#FFD700' : '#FFFFFF'} />
  </Icon>
</Header>

      {showSearch && (
        <SearchBar>
          <FiSearch size={16} color="#888" />
          <SearchInput placeholder={t('searchConversation')} value={search}
            onChange={e => setSearch(e.target.value)} autoFocus />
          {search && <FiX size={16} color="#888" onClick={() => setSearch('')} style={{ cursor: 'pointer' }} />}
        </SearchBar>
      )}

      <ChatList>
        {loading ? (
          <EmptyState><EmptyText>{t('loading')}</EmptyText></EmptyState>
        ) : filteredGroups.length === 0 ? (
          <EmptyState>
            <FiUsers size={52} color="#FFE0A0" />
            <EmptyText>{search ? t('noResults') : t('noChatsYet')}</EmptyText>
            <EmptySubtext>{search ? '' : t('tapToCreate')}</EmptySubtext>
          </EmptyState>
        ) : (
          filteredGroups.map(group => {
            const unread = unreadCounts[group.id] || 0;
            const lastMsg = group.lastMessage;
            return (
              <ChatItem key={group.id} onClick={() => handleOpenChat(group)}>
                <Avatar name={group.name} id={group.id} size="lg" src={group.groupPhoto || null} />
                <ChatInfo>
                  <ChatName>{group.name}</ChatName>
                  <ChatPreview>
                    {group.isFormer
                      ? t('notMemberPreview')
                      : lastMsg
                        ? lastMsg.type === 'IMAGE'
                          ? `${lastMsg.sender?.id === userId ? t('you') : lastMsg.sender?.name}: 🖼 ${t('photo')}`
                          : lastMsg.type === 'SYSTEM'
                            ? group.description || t('tapToOpen')
                            : lastMsg.sender
                              ? `${lastMsg.sender.id === userId ? t('you') : lastMsg.sender.name}: ${lastMsg.content}`
                              : lastMsg.content
                        : group.description || t('tapToOpen')}
                  </ChatPreview>
                </ChatInfo>
                <ChatMeta>
                  <ChatTime $unread={unread > 0}>
                    {lastMsg ? formatPreviewTime(lastMsg.createdAt) : ''}
                  </ChatTime>

                  {isGroupMuted(group.id) && (
                    <FiBellOff size={13} color="#aaa" style={{ marginTop: 2 }} />
                  )}

                  {unread > 0 && <UnreadBadge>{unread > 99 ? '99+' : unread}</UnreadBadge>}
                </ChatMeta>
              </ChatItem>
            );
          })
        )}
      </ChatList>

      <FabButton onClick={() => setShowCreate(true)}><VscChatSparkle size={28} /></FabButton>

      {showCreate && (
        <Overlay><Modal>
          <ModalTitle>{t('newGroup')}</ModalTitle>
          <ModalInput placeholder={t('groupName')} value={groupName} onChange={e => setGroupName(e.target.value)} />
          <ModalInput placeholder={t('descriptionOptional')} value={groupDesc} onChange={e => setGroupDesc(e.target.value)} />
          <ModalButtons>
            <Button variant="secondary" size="full" onClick={() => setShowCreate(false)}>{t('cancel')}</Button>
            <Button variant="primary" size="full" onClick={handleCreateGroup}>{t('create')}</Button>
          </ModalButtons>
        </Modal></Overlay>
      )}

      {showJoin && (
        <Overlay><Modal>
          <ModalTitle>{t('newGroup')}</ModalTitle>
          {allGroups.length === 0
            ? <EmptyText style={{ textAlign: 'center', padding: '20px' }}>{t('noResults')}</EmptyText>
            : <JoinListScroll>
                {allGroups.map(group => (
                  <JoinItem key={group.id}>
                    <Avatar name={group.name} id={group.id} size="md" src={group.groupPhoto || null} />
                    <JoinItemInfo>
                      <JoinItemName>{group.name}</JoinItemName>
                      <JoinItemDesc>{group.description}</JoinItemDesc>
                    </JoinItemInfo>
                    <Button variant="primary" size="sm" onClick={() => handleJoinGroup(group.id)}>Join</Button>
                  </JoinItem>
                ))}
              </JoinListScroll>
          }
          <Button variant="secondary" size="full" onClick={() => setShowJoin(false)}>{t('cancel')}</Button>
        </Modal></Overlay>
      )}
    </Container>
  );
  
}

export default GroupsPage;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import { Client } from '@stomp/stompjs';
import { API_URL, WS_URL } from '../../config';
import { getMessages, getAlerts, getGroupMembers, isFormerMember, getGroupById, createAlert } from '../../services/api';
import Button from '../../components/Button/Button';
import ChatHeader from './components/ChatHeader';
import MessageBubble from './components/MessageBubble';
import AlertBubble from './components/AlertBubble';
import ChatInput from './components/ChatInput';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Container, MessagesArea, EmptyChat,
  Overlay, AlarmConfirmModal, AlarmConfirmIcon,
  AlarmConfirmTitle, AlarmConfirmText, AlarmConfirmButtons,
  AlertModalContainer, AlertModalTitle, StyledSelect,
  StyledTextArea, AlertModalButtons,
  DateSeparator, DateLine, DateText, NotMemberBar, SystemMessage
} from './ChatPage.styled';

function ChatPage() {
  const { groupId } = useParams();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const groupName = location.state?.groupName || `Grupo #${groupId}`;

  const [isMember, setIsMember] = useState(true);
  const [messages, setMessages] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [historyReady, setHistoryReady] = useState(false);
  const [members, setMembers] = useState([]);
  const [text, setText] = useState('');
  const [showAlarmConfirm, setShowAlarmConfirm] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertDesc, setAlertDesc] = useState('');
  const [alertLevel, setAlertLevel] = useState('RED');
  const [alertType, setAlertType] = useState('ROBBERY');
  const [groupPhoto, setGroupPhoto] = useState('');
  const [canMembersSendMessages, setCanMembersSendMessages] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
 

  const bottomRef = useRef(null);
  const stompClientRef = useRef(null);
  const groupIdRef = useRef(groupId);
  const messagesAreaRef = useRef(null); // 🔥 AQUÍ
  const isMemberRef = useRef(true); // 🔥 ESTE FALTABA
  const isFirstLoad = useRef(true); // 🔥 agregar aquí
  const userId = useRef(parseInt(localStorage.getItem('userId'))).current;
  const sentViaRestRef = useRef(new Set());

  useEffect(() => { groupIdRef.current = groupId; }, [groupId]);

  useEffect(() => {
    loadHistory();
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);
  // 🔥 Agregar este useEffect separado para mensajes nuevos en tiempo real




  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws-native',
      reconnectDelay: 3000,
      onConnect: () => {
        client.subscribe(`/topic/chat/${groupIdRef.current}`, (msg) => {
          console.log('🔥 RAW WS:', msg.body);
          try {
            const parsed = JSON.parse(msg.body);
            console.log('✅ parsed.content:', parsed.content);

            if (parsed.type === 'SYSTEM' && parsed.content?.startsWith('__PERMISSIONS_UPDATED__:')) {
              try {
                const json = parsed.content.replace('__PERMISSIONS_UPDATED__:', '');
                const updated = JSON.parse(json);
                setCanMembersSendMessages(updated.canMembersSendMessages ?? true);
              } catch (e) {}
              return;
            }
            if (parsed.type === 'SYSTEM' && parsed.content === '__GROUP_UPDATED__') {
              loadMembers();
              return;
            }
            if (parsed.type === 'SYSTEM' && parsed.content?.startsWith('__CHAT_CLEARED__')) {
              const clearerId = Number(parsed.content.split(':')[1]);
              if (clearerId === Number(userId)) loadHistory();
              return;
            }
            if (parsed.type === 'SYSTEM' && parsed.content?.startsWith('__GROUP_DELETED__')) {
              navigate('/groups');
              return;
            }
            if (parsed.type === 'SYSTEM' && parsed.content?.startsWith('__LEFT_AND_DELETED__')) {
              const leftUserId = parseInt(parsed.content.split(':')[1]);
              if (leftUserId === Number(userId)) {
                navigate('/groups'); // solo el que salió navega
              }
              return;
            }
            if (parsed.id && sentViaRestRef.current.has(parsed.id)) {
              sentViaRestRef.current.delete(parsed.id);
              return;
            }

            // 🔥 BLOQUEO REAL
            // 🔥 BLOQUEO REAL
if (!isMemberRef.current) return;

              // Evitar duplicado en mensajes propios (TEXT)
              if (parsed.sender?.id === userId && parsed.type === 'TEXT') {
                setMessages(prev => {
                  const tempIndex = prev.findIndex(
                    m => m._temp && m.content === parsed.content
                  );

                  if (tempIndex !== -1) {
                    const updated = [...prev];
                    updated[tempIndex] = parsed; // reemplaza temp por real
                    return updated;
                  }

                  return [...prev, parsed];
                });
                return;
              }

              setMessages(prev => [...prev, parsed]);
          } catch (e) {
            console.error('Error parseando mensaje:', e);
          }
        });

        // Escuchar alertas por WS — el AlertController las broadcastea tras el POST REST
        client.subscribe(`/topic/alert/${groupIdRef.current}`, (msg) => {
          try {
            const newAlert = JSON.parse(msg.body);
            setAlerts(prev => {
              // Evitar duplicado si ya está en la lista
              if (prev.some(a => a.id === newAlert.id)) return prev;
              return [newAlert, ...prev];
            });
          } catch (e) {}
        });
      },
      onDisconnect: () => console.log('WS desconectado'),
      onStompError: (frame) => console.error('STOMP error:', frame),
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      stompClientRef.current = null;
      setTimeout(() => client.deactivate(), 500);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);


const loadHistory = async () => {
  try {
    const [msgRes, alertRes] = await Promise.all([
      getMessages(groupId, userId),
      getAlerts(groupId, userId),
    ]);

    setMessages(msgRes.data);
    setAlerts(alertRes.data);

    // 🔥 SCROLL REAL DESPUÉS DEL RENDER
    setTimeout(() => {
  if (messagesAreaRef.current) {
    messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
  }
  isFirstLoad.current = false;
  setHistoryReady(true); // 🔥 mostrar después del scroll
}, 100);

  } catch (err) {
    console.error(err);
  }
};

  const loadMembers = async () => {
    try {
      const [membersRes, formerRes, groupRes] = await Promise.all([
        getGroupMembers(groupId),
        isFormerMember(groupId, userId),
        getGroupById(groupId),
      ]);
      setMembers(membersRes.data);
      setIsMember(!formerRes.data);
      isMemberRef.current = !formerRes.data;
      setGroupPhoto(groupRes.data.groupPhoto || '');
      setCanMembersSendMessages(groupRes.data.canMembersSendMessages ?? true);
      setIsAdmin(Number(groupRes.data.admin?.id) === Number(userId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = () => {
  if (!text.trim() || !stompClientRef.current?.connected) return;

  const tempMsg = {
    id: `temp-${Date.now()}`,
    content: text,
    type: 'TEXT',
    sender: { id: userId },
    createdAt: new Date().toISOString(),
    _temp: true,
  };

  setMessages(prev => [...prev, tempMsg]);
  setText('');

  stompClientRef.current.publish({
    destination: `/app/chat/${groupId}`,
    body: JSON.stringify({
      content: text,
      type: 'TEXT',
      senderId: userId,
      groupId: parseInt(groupId),
    }),
  });
};

  const handleSendImage = async (base64) => {
    try {
      const { sendMessage } = await import('../../services/api');
      const res = await sendMessage({
        content: base64, type: 'IMAGE',
        senderId: userId, groupId: parseInt(groupId),
      });
      if (res.data?.id) sentViaRestRef.current.add(res.data.id);
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Error enviando imagen:', err);
    }
  };

  // ── ALARMA: ahora usa REST → AlertController hace broadcast WS → App.js muestra modal ──
  const handleConfirmAlarm = async () => {
    try {
      await createAlert({
        level: 'RED',
        type: 'EMERGENCY',
        description: 'Alarma de emergencia activada',
        reporterId: userId,
        groupId: parseInt(groupId),
      });
    } catch (err) {
      console.error('Error activando alarma:', err);
    }
    setShowAlarmConfirm(false);
  };

  // ── ALERTA PERSONALIZADA: también usa REST ──
  const handleSendAlert = async () => {
    if (!alertDesc.trim()) return;
    try {
      await createAlert({
        level: alertLevel,
        type: alertType,
        description: alertDesc,
        reporterId: userId,
        groupId: parseInt(groupId),
      });
    } catch (err) {
      console.error('Error enviando alerta:', err);
    }
    setAlertDesc('');
    setShowAlertModal(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const normalizeDate = (d) => d?.toString().replace('Z', '');

  const formatTime = (createdAt) => {
    if (!createdAt) return '';
    return new Date(normalizeDate(createdAt)).toLocaleTimeString([], {
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };

  const formatDateSeparator = (dateStr) => {
    const date = new Date(normalizeDate(dateStr));
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return t('today');
    if (date.toDateString() === yesterday.toDateString()) return t('yesterday');
    return date.toLocaleDateString([], {
      day: 'numeric', month: 'long',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  const shouldShowDateSeparator = (currentItem, previousItem) => {
    if (!previousItem) return true;
    const a = new Date(normalizeDate(currentItem.createdAt));
    const b = new Date(normalizeDate(previousItem.createdAt));
    return a.toDateString() !== b.toDateString();
  };

  const INTERNAL_SYSTEM = ['__CHAT_CLEARED__', '__GROUP_UPDATED__', '__PERMISSIONS_UPDATED__', '__GROUP_DELETED__'];
  const allItems = [
    ...messages
      .filter(m => {
        if (m.type !== 'SYSTEM') return true;
        return !INTERNAL_SYSTEM.some(prefix => m.content?.startsWith(prefix));
      })
      .map(m => ({ ...m, itemType: 'message' })),
    ...alerts.map(a => ({ ...a, itemType: 'alert' })),
  ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
useEffect(() => {
  if (isFirstLoad.current) return; // 🔥 ignorar hasta que loadHistory termine

  bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [allItems.length]);
  return (
    <Container>
      <ChatHeader
        groupName={groupName}
        groupId={parseInt(groupId)}
        members={members}
        isMember={isMember}
        groupPhoto={groupPhoto}
      />

      <MessagesArea 
  ref={messagesAreaRef}
  style={{ visibility: historyReady ? 'visible' : 'hidden' }}
>
        {allItems.length === 0 && <EmptyChat>{t('noMessages')}</EmptyChat>}
        {allItems.map((item, index) => {
          const prevItem = allItems[index - 1];
          const showSeparator = shouldShowDateSeparator(item, prevItem);

          if (item.itemType === 'message' && item.type === 'SYSTEM') {
            return (
              <React.Fragment key={`msg-${item.id}`}>
                {showSeparator && (
                  <DateSeparator><DateLine /><DateText>{formatDateSeparator(item.createdAt)}</DateText><DateLine /></DateSeparator>
                )}
                <SystemMessage>{item.content}</SystemMessage>
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={item.itemType === 'alert' ? `alert-${item.id}` : `msg-${item.id}`}>
              {showSeparator && (
                <DateSeparator><DateLine /><DateText>{formatDateSeparator(item.createdAt)}</DateText><DateLine /></DateSeparator>
              )}
              {item.itemType === 'alert'
                ? <AlertBubble alert={item} />
                : <MessageBubble
                    message={item}
                    isMine={item.sender?.id === userId}
                    totalMembers={members.length}
                    formatTime={formatTime}
                  />
              }
            </React.Fragment>
          );
        })}
        <div ref={bottomRef} />
      </MessagesArea>

      {!isMember
        ? <NotMemberBar>{t('notMemberChat')}</NotMemberBar>
        : !canMembersSendMessages && !isAdmin
          ? <NotMemberBar>Solo el admin puede enviar mensajes</NotMemberBar>
          : <ChatInput
              text={text}
              onChange={(e) => setText(e.target.value)}
              onSend={handleSend}
              onKeyPress={handleKeyPress}
              onAlarm={() => setShowAlarmConfirm(true)}
              onAlert={() => setShowAlertModal(true)}
              onSendImage={handleSendImage}
            />
      }

      {showAlarmConfirm && (
        <Overlay>
          <AlarmConfirmModal>
            <AlarmConfirmIcon><FiAlertTriangle size={36} color="#eb4b3f" /></AlarmConfirmIcon>
            <AlarmConfirmTitle>{t('activateAlarm')}</AlarmConfirmTitle>
            <AlarmConfirmText>{t('alarmText')}</AlarmConfirmText>
            <AlarmConfirmButtons>
              <Button variant="secondary" size="full" onClick={() => setShowAlarmConfirm(false)}>{t('no')}</Button>
              <Button variant="danger" size="full" onClick={handleConfirmAlarm}>{t('yes')}</Button>
            </AlarmConfirmButtons>
          </AlarmConfirmModal>
        </Overlay>
      )}

      {showAlertModal && (
        <Overlay>
          <AlertModalContainer>
            <AlertModalTitle>{t('newAlert')}</AlertModalTitle>
            <StyledSelect value={alertLevel} onChange={e => setAlertLevel(e.target.value)}>
              <option value="RED">Emergencia</option>
              <option value="YELLOW">Sospechoso</option>
              <option value="GREEN">Zona despejada</option>
            </StyledSelect>
            <StyledSelect value={alertType} onChange={e => setAlertType(e.target.value)}>
              <option value="ROBBERY">Robo</option>
              <option value="SUSPICIOUS">Persona sospechosa</option>
              <option value="EMERGENCY">Emergencia general</option>
              <option value="CLEARED">Zona despejada</option>
            </StyledSelect>
            <StyledTextArea
              placeholder={t('alertDescription')}
              value={alertDesc}
              onChange={e => setAlertDesc(e.target.value)}
              rows={3}
            />
            <AlertModalButtons>
              <Button variant="secondary" size="full" onClick={() => setShowAlertModal(false)}>{t('cancel')}</Button>
              <Button variant="danger" size="full" onClick={handleSendAlert}>{t('sendAlert')}</Button>
            </AlertModalButtons>
          </AlertModalContainer>
        </Overlay>
      )}
    </Container>
  );
}

export default ChatPage;
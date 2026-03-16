import React, { useState, useEffect, useRef } from 'react';
import { getMessages, getAlerts } from '../services/api';
import { Client } from '@stomp/stompjs';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function ChatPage() {

  const { groupId } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const groupName = location.state?.groupName || `Grupo #${groupId}`;
  const [messages, setMessages] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [text, setText] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertDesc, setAlertDesc] = useState('');
  const [alertLevel, setAlertLevel] = useState('RED');
  const [alertType, setAlertType] = useState('ROBBERY');
  const [connected, setConnected] = useState(false);

  const bottomRef = useRef(null);
  const stompClientRef = useRef(null);

  const userId = parseInt(localStorage.getItem('userId'));

  useEffect(() => {

    loadHistory();

    const client = new Client({
      brokerURL: 'wss://alpheratz-backend-production.up.railway.app/ws-native',

      onConnect: () => {
        console.log('WebSocket conectado');
        setConnected(true);

            client.subscribe(`/topic/chat/${groupId}`, (message) => {
            console.log('Mensaje recibido:', message.body);
            setMessages(prev => [...prev, JSON.parse(message.body)]);
        });

          client.subscribe(`/topic/alert/${groupId}`, (alert) => {
            console.log('Alerta recibida:', alert.body);
            setAlerts(prev => [JSON.parse(alert.body), ...prev]);
        });
      },

      onDisconnect: () => {
        console.log('WebSocket desconectado');
        setConnected(false);
      }
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, alerts]);

  const loadHistory = async () => {
    try {

      const [msgRes, alertRes] = await Promise.all([
        getMessages(groupId),
        getAlerts(groupId)
      ]);

      setMessages(msgRes.data);
      setAlerts(alertRes.data);

    } catch (err) {
      console.error('Error cargando historial', err);
    }
  };

  const handleSend = () => {
    console.log('Intentando enviar:', text);
    console.log('Cliente conectado:', stompClientRef.current?.connected);
    if (!text.trim()) return;
    if (stompClientRef.current && stompClientRef.current.connected) {
      console.log('Publicando mensaje...');
      stompClientRef.current.publish({
        destination: `/app/chat/${groupId}`,
        body: JSON.stringify({
          content: text,
          type: 'TEXT',
          senderId: userId,
          groupId: parseInt(groupId)
        })
      });
      setText('');
    } else {
      console.error('WebSocket no conectado');
    }
};

  const handleAlert = () => {

    if (!alertDesc.trim()) return;

    if (stompClientRef.current && stompClientRef.current.connected) {

      stompClientRef.current.publish({
        destination: `/app/alert/${groupId}`,
        body: JSON.stringify({
          level: alertLevel,
          type: alertType,
          description: alertDesc,
          reporterId: userId,
          groupId: parseInt(groupId)
        })
      });

      setAlertDesc('');
      setShowAlertModal(false);

    } else {

      console.error('WebSocket no conectado');

    }
  };

  const handleKeyPress = (e) => {

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }

  };

  const allItems = [

    ...messages.map(m => ({ ...m, itemType: 'message' })),
    ...alerts.map(a => ({ ...a, itemType: 'alert' }))

  ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const levelColor = {
    RED: '#e63946',
    YELLOW: '#fb8500',
    GREEN: '#06d6a0'
  };

  const levelLabel = {
    RED: '🔴 Emergencia',
    YELLOW: '🟡 Sospechoso',
    GREEN: '🟢 Zona despejada'
  };

  return (
    <div style={styles.container}>

      <div style={styles.header}>

        <button
          style={styles.backBtn}
          onClick={() => navigate('/groups')}
        >
          ‹
        </button>

        <div style={styles.headerInfo}>
          <div style={styles.headerName}>{groupName}</div>

          <div style={styles.headerSub}>
            <span style={{ color: connected ? '#06d6a0' : '#e63946' }}>●</span>
            {connected ? ' Conectado' : ' Desconectado'}
          </div>
        </div>

        <button
          style={styles.alarmBtn}
          onClick={() => setShowAlertModal(true)}
        >
          🚨
        </button>

      </div>

      <div style={styles.messagesArea}>

        {allItems.length === 0 && (
          <p style={styles.empty}>
            No hay mensajes aún. ¡Sé el primero!
          </p>
        )}

        {allItems.map((item) => {

          if (item.itemType === 'alert') {

            return (

              <div key={`alert-${item.id}`} style={styles.alertBubble(item.level)}>

                <div style={styles.alertHeader}>
                  <span style={{ color: levelColor[item.level], fontWeight: 'bold' }}>
                    {levelLabel[item.level]}
                  </span>

                  <span style={styles.alertTime}>
                    {new Date(item.createdAt + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div style={styles.alertDesc}>
                  {item.description}
                </div>

                <div style={styles.alertReporter}>
                  Reportado por {item.reporter?.name}
                </div>

              </div>
            );
          }

          const isMine = item.sender?.id === userId;

          return (

            <div key={`msg-${item.id}`} style={styles.messageRow(isMine)}>

              {!isMine && (
                <div style={styles.avatar}>
                  {item.sender?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div style={styles.messageBubble(isMine)}>

                {!isMine && (
                  <div style={styles.senderName}>
                    {item.sender?.name}
                  </div>
                )}

                <div style={styles.messageText}>
                  {item.content}
                </div>

                <div style={styles.messageTime}>
                  {new Date(item.createdAt + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

              </div>

            </div>
          );

        })}

        <div ref={bottomRef} />

      </div>

      <div style={styles.inputArea}>

        <button
          style={styles.alertIconBtn}
          onClick={() => setShowAlertModal(true)}
        >
          ⚠️
        </button>

        <textarea
          style={styles.input}
          placeholder="Escribe un mensaje..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1}
        />

        <button
          style={styles.sendBtn}
          onClick={handleSend}
        >
          ➤
        </button>

      </div>

      {showAlertModal && (

        <div style={styles.modal}>

          <div style={styles.modalCard}>

            <h3 style={styles.modalTitle}>🚨 Crear Alerta</h3>

            <select
              style={styles.select}
              value={alertLevel}
              onChange={(e) => setAlertLevel(e.target.value)}
            >
              <option value="RED">🔴 Emergencia</option>
              <option value="YELLOW">🟡 Sospechoso</option>
              <option value="GREEN">🟢 Zona despejada</option>
            </select>

            <select
              style={styles.select}
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
            >
              <option value="ROBBERY">Robo</option>
              <option value="SUSPICIOUS">Persona sospechosa</option>
              <option value="EMERGENCY">Emergencia general</option>
              <option value="CLEARED">Zona despejada</option>
            </select>

            <textarea
              style={styles.input}
              placeholder="Describe lo que está pasando..."
              value={alertDesc}
              onChange={(e) => setAlertDesc(e.target.value)}
              rows={3}
            />

            <div style={styles.modalActions}>

              <button
                style={styles.cancelBtn}
                onClick={() => setShowAlertModal(false)}
              >
                Cancelar
              </button>

              <button
                style={styles.alertConfirmBtn}
                onClick={handleAlert}
              >
                Enviar Alerta
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

const styles = {
  container:{display:'flex',flexDirection:'column',height:'100vh',background:'#0a0e1a',color:'#e8eaf0'},
  header:{padding:'14px 20px',background:'#111827',borderBottom:'1px solid #1e2d45',display:'flex',alignItems:'center',gap:'12px'},
  backBtn:{background:'transparent',border:'none',color:'#e8eaf0',fontSize:'28px',cursor:'pointer',lineHeight:1},
  headerInfo:{flex:1},
  headerName:{fontWeight:'bold',fontSize:'16px'},
  headerSub:{fontSize:'12px',color:'#8b97b0'},
  alarmBtn:{background:'#e63946',border:'none',borderRadius:'10px',padding:'8px 12px',fontSize:'20px',cursor:'pointer'},
  messagesArea:{flex:1,overflowY:'auto',padding:'16px 20px',display:'flex',flexDirection:'column',gap:'8px'},
  empty:{textAlign:'center',color:'#4a5568',marginTop:'40px'},
  messageRow:(isMine)=>({display:'flex',justifyContent:isMine?'flex-end':'flex-start',alignItems:'flex-end',gap:'8px'}),
  avatar:{width:'30px',height:'30px',background:'#1a2235',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'bold',flexShrink:0},
  messageBubble:(isMine)=>({maxWidth:'70%',padding:'10px 14px',background:isMine?'#1a3a5c':'#111827',border:'1px solid #1e2d45',borderRadius:isMine?'14px 4px 14px 14px':'4px 14px 14px 14px'}),
  senderName:{fontSize:'11px',color:'#2ec4b6',marginBottom:'4px',fontWeight:'bold'},
  messageText:{fontSize:'14px',lineHeight:1.5},
  messageTime:{fontSize:'10px',color:'#4a5568',marginTop:'4px',textAlign:'right'},
  alertBubble:(level)=>({background:level==='RED'?'rgba(230,57,70,0.12)':level==='YELLOW'?'rgba(251,133,0,0.12)':'rgba(6,214,160,0.12)',borderRadius:'12px',padding:'12px 16px'}),
  alertHeader:{display:'flex',justifyContent:'space-between',marginBottom:'6px'},
  alertTime:{fontSize:'11px',color:'#4a5568'},
  alertDesc:{fontSize:'14px',marginBottom:'6px'},
  alertReporter:{fontSize:'11px',color:'#8b97b0'},
  inputArea:{padding:'12px 16px',background:'#111827',borderTop:'1px solid #1e2d45',display:'flex',alignItems:'center',gap:'10px'},
  alertIconBtn:{background:'transparent',border:'none',fontSize:'22px',cursor:'pointer'},
  input:{flex:1,padding:'10px 14px',background:'#1a2235',border:'1px solid #1e2d45',borderRadius:'12px',color:'#e8eaf0',fontSize:'14px',outline:'none',resize:'none'},
  sendBtn:{width:'40px',height:'40px',background:'#2ec4b6',border:'none',borderRadius:'10px',color:'white',fontSize:'16px',cursor:'pointer'},
  modal:{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100},
  modalCard:{background:'#111827',border:'1px solid #1e2d45',borderRadius:'16px',padding:'24px',width:'100%',maxWidth:'360px',display:'flex',flexDirection:'column',gap:'12px'},
  modalTitle:{color:'#e8eaf0',margin:0},
  select:{padding:'12px 16px',background:'#1a2235',border:'1px solid #1e2d45',borderRadius:'10px',color:'#e8eaf0',fontSize:'14px',outline:'none'},
  modalActions:{display:'flex',gap:'10px'},
  cancelBtn:{flex:1,padding:'10px',background:'transparent',border:'1px solid #1e2d45',borderRadius:'8px',color:'#8b97b0',cursor:'pointer'},
  alertConfirmBtn:{flex:1,padding:'10px',background:'#e63946',border:'none',borderRadius:'8px',color:'white',fontWeight:'bold',cursor:'pointer'}
};

export default ChatPage;
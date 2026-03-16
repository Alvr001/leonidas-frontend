import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroupsByUser, createGroup, joinGroup, getGroups } from '../services/api';

function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = parseInt(localStorage.getItem('userId'));
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    loadGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadGroups = async () => {
    try {
      const response = await getGroupsByUser(userId);
      setGroups(response.data);
    } catch (err) {
      console.error('Error cargando grupos', err);
    } finally {
      setLoading(false);
    }
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
      setShowJoin(false); loadGroups();
    } catch (err) { console.error(err); }
  };

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';
  const avatarColors = ['#F4A435','#E8841A','#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#DDA0DD'];
  const getAvatarColor = (id) => avatarColors[id % avatarColors.length];

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.menuBtn}>☰</button>
        <h1 style={styles.headerTitle}>Alpheratz</h1>
        <button style={styles.searchBtn}>🔍</button>
      </div>

      {/* LISTA DE CHATS */}
      <div style={styles.chatList}>
        {loading ? (
          <div style={styles.emptyState}>
            <div style={styles.loadingDot}></div>
          </div>
        ) : groups.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No tienes chats aún</p>
            <p style={styles.emptySubtext}>Crea o únete a un grupo</p>
          </div>
        ) : (
          groups.map(group => (
            <div
              key={group.id}
              style={styles.chatItem}
              onClick={() => navigate(`/chat/${group.id}`, { state: { groupName: group.name } })}
            >
              <div style={{ ...styles.avatar, background: getAvatarColor(group.id) }}>
                {getInitials(group.name)}
              </div>
              <div style={styles.chatInfo}>
                <div style={styles.chatName}>{group.name}</div>
                <div style={styles.chatPreview}>{group.description || 'Toca para abrir el chat'}</div>
              </div>
              <div style={styles.chatMeta}>
                <div style={styles.chatTime}>ahora</div>
                <div style={styles.starRead}>✦</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* BOTÓN FLOTANTE */}
      <button style={styles.fab} onClick={() => setShowCreate(true)}>+</button>

      {/* MODAL CREAR */}
      {showCreate && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Nuevo grupo</h3>
            <input style={styles.modalInput} placeholder="Nombre del grupo" value={groupName} onChange={e => setGroupName(e.target.value)} />
            <input style={styles.modalInput} placeholder="Descripción (opcional)" value={groupDesc} onChange={e => setGroupDesc(e.target.value)} />
            <div style={styles.modalBtns}>
              <button style={styles.modalBtnSecondary} onClick={() => setShowCreate(false)}>Cancelar</button>
              <button style={styles.modalBtnPrimary} onClick={handleCreateGroup}>Crear</button>
            </div>
            <div style={styles.joinLink} onClick={() => { setShowCreate(false); handleShowJoin(); }}>
              ¿Prefieres unirte a uno existente?
            </div>
          </div>
        </div>
      )}

      {/* MODAL UNIRSE */}
      {showJoin && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Grupos disponibles</h3>
            {allGroups.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No hay grupos disponibles</p>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {allGroups.map(group => (
                  <div key={group.id} style={styles.joinItem}>
                    <div style={{ ...styles.avatarSm, background: getAvatarColor(group.id) }}>
                      {getInitials(group.name)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{group.name}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{group.description}</div>
                    </div>
                    <button style={styles.joinBtn} onClick={() => handleJoinGroup(group.id)}>Unirse</button>
                  </div>
                ))}
              </div>
            )}
            <button style={styles.modalBtnSecondary} onClick={() => setShowJoin(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { background: '#FFF8E7', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: {
    padding: '16px 20px', background: '#FFF8E7',
    borderBottom: '1px solid #FFE0A0',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    position: 'sticky', top: 0, zIndex: 10
  },
  menuBtn: { background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#555' },
  headerTitle: { fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '700', color: '#F4A435' },
  searchBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' },
  chatList: { flex: 1, overflowY: 'auto' },
  chatItem: {
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '14px 20px', borderBottom: '1px solid #FFF0CC',
    cursor: 'pointer', transition: 'background 0.15s',
    background: 'white'
  },
  avatar: {
    width: '52px', height: '52px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px', fontWeight: '700', color: 'white', flexShrink: 0
  },
  avatarSm: {
    width: '38px', height: '38px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '15px', fontWeight: '700', color: 'white', flexShrink: 0
  },
  chatInfo: { flex: 1, minWidth: 0 },
  chatName: { fontWeight: '700', fontSize: '15px', marginBottom: '3px', color: '#1a1a1a' },
  chatPreview: { fontSize: '13px', color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  chatMeta: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' },
  chatTime: { fontSize: '11px', color: '#bbb' },
  starRead: { fontSize: '14px', color: '#bbb' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' },
  emptyText: { fontSize: '16px', fontWeight: '600', color: '#999' },
  emptySubtext: { fontSize: '13px', color: '#bbb', marginTop: '6px' },
  fab: {
    position: 'fixed', bottom: '24px', right: '24px',
    width: '56px', height: '56px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #F4A435, #E8841A)',
    border: 'none', color: 'white', fontSize: '28px',
    cursor: 'pointer', boxShadow: '0 4px 20px rgba(244,164,53,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100
  },
  modal: {
    background: 'white', borderRadius: '24px 24px 0 0',
    padding: '28px 24px', width: '100%', maxWidth: '500px',
    display: 'flex', flexDirection: 'column', gap: '12px'
  },
  modalTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a1a' },
  modalInput: {
    padding: '13px 16px', background: '#FFF8E7',
    border: '1.5px solid #FFE0A0', borderRadius: '12px',
    fontSize: '14px', outline: 'none', color: '#333'
  },
  modalBtns: { display: 'flex', gap: '10px' },
  modalBtnPrimary: {
    flex: 1, padding: '13px',
    background: 'linear-gradient(135deg, #F4A435, #E8841A)',
    border: 'none', borderRadius: '12px', color: 'white',
    fontWeight: '700', fontSize: '15px', cursor: 'pointer'
  },
  modalBtnSecondary: {
    flex: 1, padding: '13px', background: '#f5f5f5',
    border: 'none', borderRadius: '12px', color: '#666',
    fontWeight: '600', fontSize: '15px', cursor: 'pointer'
  },
  joinLink: { textAlign: 'center', fontSize: '13px', color: '#F4A435', cursor: 'pointer', fontWeight: '600' },
  joinItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f5f5f5' },
  joinBtn: {
    padding: '7px 16px', background: '#F4A435', border: 'none',
    borderRadius: '20px', color: 'white', fontWeight: '700',
    fontSize: '13px', cursor: 'pointer'
  }
};

export default GroupsPage;
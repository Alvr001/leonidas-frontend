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
      await createGroup({
        name: groupName,
        description: groupDesc,
        adminId: userId
      });
      setGroupName('');
      setGroupDesc('');
      setShowCreate(false);
      loadGroups();
    } catch (err) {
      console.error('Error creando grupo', err);
    }
  };

  const handleShowJoin = async () => {
    try {
      const response = await getGroups();
      const myGroupIds = groups.map(g => g.id);
      const available = response.data.filter(g => !myGroupIds.includes(g.id));
      setAllGroups(available);
      setShowJoin(true);
    } catch (err) {
      console.error('Error cargando grupos disponibles', err);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await joinGroup(groupId, userId);
      setShowJoin(false);
      loadGroups();
    } catch (err) {
      console.error('Error uniéndose al grupo', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.headerLogo}>🛡️</span>
          <div>
            <div style={styles.headerTitle}>Alpheratz</div>
            <div style={styles.headerSub}>Hola, {userName}</div>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>Salir</button>
      </div>

      <div style={styles.actions}>
        <button style={styles.actionBtn} onClick={() => setShowCreate(true)}>
          + Crear grupo
        </button>
        <button style={styles.actionBtnSecondary} onClick={handleShowJoin}>
          Unirse a grupo
        </button>
      </div>

      {loading ? (
        <p style={styles.empty}>Cargando...</p>
      ) : groups.length === 0 ? (
        <p style={styles.empty}>No perteneces a ningún grupo aún</p>
      ) : (
        <div style={styles.groupList}>
          {groups.map(group => (
              <div
                key={group.id}
                style={styles.groupCard}
                onClick={() => navigate(`/chat/${group.id}`, { state: { groupName: group.name } })}
              >
              <div style={styles.groupAvatar}>🏘️</div>
              <div style={styles.groupInfo}>
                <div style={styles.groupName}>{group.name}</div>
                <div style={styles.groupDesc}>
                  {group.description || 'Sin descripción'}
                </div>
                <div style={styles.groupMembers}>
                  👥 {group.members?.length ?? 0} miembros
                </div>
              </div>
              <div style={styles.groupArrow}>›</div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear grupo */}
      {showCreate && (
        <div style={styles.modal}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>Crear grupo</h3>
            <input
              style={styles.input}
              placeholder="Nombre del grupo"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Descripción (opcional)"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
            />
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowCreate(false)}>
                Cancelar
              </button>
              <button style={styles.confirmBtn} onClick={handleCreateGroup}>
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal unirse a grupo */}
      {showJoin && (
        <div style={styles.modal}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>Grupos disponibles</h3>
            {allGroups.length === 0 ? (
              <p style={styles.empty}>No hay grupos disponibles</p>
            ) : (
              allGroups.map(group => (
                <div key={group.id} style={styles.joinItem}>
                  <div>
                    <div style={styles.groupName}>{group.name}</div>
                    <div style={styles.groupDesc}>{group.description}</div>
                  </div>
                  <button
                    style={styles.joinBtn}
                    onClick={() => handleJoinGroup(group.id)}
                  >
                    Unirse
                  </button>
                </div>
              ))
            )}
            <button style={styles.cancelBtn} onClick={() => setShowJoin(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { background: '#0a0e1a', minHeight: '100vh', color: '#e8eaf0' },
  header: {
    padding: '16px 20px',
    background: '#111827',
    borderBottom: '1px solid #1e2d45',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  headerLogo: { fontSize: '28px' },
  headerTitle: { fontWeight: 'bold', fontSize: '18px' },
  headerSub: { color: '#8b97b0', fontSize: '12px' },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #1e2d45',
    color: '#8b97b0',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  actions: {
    padding: '16px 20px',
    display: 'flex',
    gap: '10px'
  },
  actionBtn: {
    padding: '10px 20px',
    background: '#e63946',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  actionBtnSecondary: {
    padding: '10px 20px',
    background: '#1a2235',
    border: '1px solid #1e2d45',
    borderRadius: '10px',
    color: '#e8eaf0',
    cursor: 'pointer'
  },
  groupList: { padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  groupCard: {
    background: '#111827',
    border: '1px solid #1e2d45',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer'
  },
  groupAvatar: {
    width: '44px', height: '44px',
    background: '#1a2235',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px'
  },
  groupInfo: { flex: 1 },
  groupName: { fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' },
  groupDesc: { color: '#8b97b0', fontSize: '12px', marginBottom: '4px' },
  groupMembers: { color: '#4a5568', fontSize: '11px' },
  groupArrow: { color: '#4a5568', fontSize: '24px' },
  empty: { textAlign: 'center', color: '#4a5568', padding: '40px' },
  modal: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100
  },
  modalCard: {
    background: '#111827',
    border: '1px solid #1e2d45',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  modalTitle: { color: '#e8eaf0', margin: 0, fontSize: '18px' },
  input: {
    padding: '12px 16px',
    background: '#1a2235',
    border: '1px solid #1e2d45',
    borderRadius: '10px',
    color: '#e8eaf0',
    fontSize: '14px',
    outline: 'none'
  },
  modalActions: { display: 'flex', gap: '10px' },
  cancelBtn: {
    flex: 1, padding: '10px',
    background: 'transparent',
    border: '1px solid #1e2d45',
    borderRadius: '8px',
    color: '#8b97b0',
    cursor: 'pointer'
  },
  confirmBtn: {
    flex: 1, padding: '10px',
    background: '#e63946',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  joinItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #1e2d45'
  },
  joinBtn: {
    padding: '6px 14px',
    background: '#2ec4b6',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default GroupsPage;
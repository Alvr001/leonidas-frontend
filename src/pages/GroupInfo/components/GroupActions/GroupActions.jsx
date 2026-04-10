import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { FiTrash2, FiLogOut, FiBell, FiShield,FiBellOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { clearChat, sendMessage } from '../../../../services/api';
import {
  ActionsContainer, ActionItem, ActionIcon, ActionText,
  ActionSubtext
} from './GroupActions.styled';
import {
  Overlay, ModalSheet, ModalTitle, ModalSubtitle,
  ModalOption, CancelButton
} from './ConfirmModal.styled';

function GroupActions({ groupId, groupName, isFormer, isAdmin, onChatCleared }){
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showClearModal, setShowClearModal]   = useState(false);
  const [showExitModal, setShowExitModal]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = parseInt(localStorage.getItem('userId'));
  const muteKey = `muted_${userId}_${groupId}`;

const getMuteInfo = () => {
  const raw = localStorage.getItem(muteKey);
  if (!raw) return null;
  return JSON.parse(raw);
};

const isMuted = () => {
  const info = getMuteInfo();
  if (!info) return false;
  if (info.until === 'forever') return true;
  return new Date(info.until) > new Date();
};

const [showMuteModal, setShowMuteModal] = useState(false);
const [muted, setMuted] = useState(isMuted);

const handleMute = (option) => {
  let until;
  if (option === '8h') {
    const d = new Date();
    d.setHours(d.getHours() + 8);
    until = d.toISOString();
  } else if (option === '1w') {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    until = d.toISOString();
  } else {
    until = 'forever';
  }
  localStorage.setItem(muteKey, JSON.stringify({ until }));
  setMuted(true);
  setShowMuteModal(false);
};

const handleUnmute = () => {
  localStorage.removeItem(muteKey);
  setMuted(false);
  setShowMuteModal(false);
};
  const hiddenKey = `hidden_group_${userId}_${groupId}`;
  const wasAdminKey = `wasAdmin_${groupId}_${userId}`;

  const cleanupAndNavigate = () => {
    localStorage.removeItem(wasAdminKey);
    localStorage.setItem(hiddenKey, 'true');
    navigate('/groups');
  };

  // ── Limpiar chat ──────────────────────────────────────────────────────────
const handleClearChat = async () => {
  try {
    await clearChat(groupId, userId);

    await sendMessage({
      content: `__CHAT_CLEARED__:${userId}`,
      type: 'SYSTEM',
      senderId: userId,
      groupId: parseInt(groupId),
    });

    localStorage.setItem(
      `chat_cleared_${userId}_${groupId}`,
      new Date().toISOString()
    );

    setShowClearModal(false);

    onChatCleared?.(); // ✅ ESTO ES LO NUEVO
  } catch (err) {
    console.error(err);
  }
};

  // ── Solo salir ────────────────────────────────────────────────────────────
  const handleLeaveGroup = async () => {
    try {
      // leaveGroup normal — el usuario queda como ex-miembro
      // El grupo sigue, se asigna nuevo admin si era admin
      await axios.delete(
        `http://localhost:8080/api/groups/${groupId}/leave?userId=${userId}`
      );
      setShowExitModal(false);
      // No ocultar — el ex-miembro puede seguir viendo el grupo en stand-by
      navigate('/groups');
    } catch (err) {
      console.error(err);
    }
  };

  // ── Salir Y ocultar (cualquier miembro activo) ────────────────────────────
  const handleLeaveAndDelete = async () => {
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:8080/api/groups/${groupId}/leave-and-delete?userId=${userId}`
      );
      // El WS __LEFT_AND_DELETED__ llegará, pero también ocultamos localmente
      cleanupAndNavigate();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // ── Eliminar grupo (ocultar localmente — no borra BD) ─────────────────────
  const handleDeleteGroup = () => {
    localStorage.removeItem(wasAdminKey);
    localStorage.setItem(hiddenKey, 'true');
    setShowDeleteModal(false);
    navigate('/groups');
  };

  return (
    <>
      <ActionsContainer>

        {!isFormer && (
          <ActionItem onClick={() => setShowMuteModal(true)}>
            <ActionIcon>
              {muted
                ? <FiBellOff size={18} color="#F4A435" />
                : <FiBell size={18} color="#F4A435" />
              }
            </ActionIcon>
            <div>
              <ActionText>{t('notifications')}</ActionText>
              <ActionSubtext>
                {muted ? t('muted') : t('active')}
              </ActionSubtext>
            </div>
          </ActionItem>
        )}

        {isAdmin && !isFormer && (
          <ActionItem onClick={() => navigate(`/group-permissions/${groupId}`)}>
            <ActionIcon><FiShield size={18} color="#F4A435" /></ActionIcon>
            <div><ActionText>{t('groupPermissions')}</ActionText></div>
          </ActionItem>
        )}

        <ActionItem color="danger" onClick={() => setShowClearModal(true)}>
          <ActionIcon color="danger"><FiTrash2 size={18} color="#E63946" /></ActionIcon>
          <ActionText color="danger">{t('clearChat')}</ActionText>
        </ActionItem>

        {/* Eliminar grupo — SOLO ex-miembros */}
        {isFormer && (
          <ActionItem color="danger" onClick={() => setShowDeleteModal(true)}>
            <ActionIcon color="danger"><FiTrash2 size={18} color="#E63946" /></ActionIcon>
            <ActionText color="danger">{t('deleteGroup')}</ActionText>
          </ActionItem>
        )}

        {/* Salir — solo miembros activos */}
        {!isFormer && (
          <ActionItem color="danger" onClick={() => setShowExitModal(true)}>
            <ActionIcon color="danger"><FiLogOut size={18} color="#E63946" /></ActionIcon>
            <ActionText color="danger">{t('exitGroup')}</ActionText>
          </ActionItem>
        )}

      </ActionsContainer>

      {/* Modal — Limpiar chat */}
      {showClearModal && (
        <Overlay onClick={() => setShowClearModal(false)}>
          <ModalSheet onClick={e => e.stopPropagation()}>
            <ModalTitle>{t('clearChatTitle')}</ModalTitle>
            <ModalSubtitle>{t('clearChatSubtitle')}</ModalSubtitle>
            <ModalOption $danger onClick={handleClearChat}>{t('clearChat')}</ModalOption>
            <CancelButton onClick={() => setShowClearModal(false)}>{t('cancel')}</CancelButton>
          </ModalSheet>
        </Overlay>
      )}

      {/* Modal — Salir (miembro activo) */}
      {showExitModal && (
        <Overlay onClick={() => !loading && setShowExitModal(false)}>
          <ModalSheet onClick={e => e.stopPropagation()}>
            <ModalTitle>{groupName}</ModalTitle>
            <ModalSubtitle>{t('exitGroupSubtitle')}</ModalSubtitle>

            {/* Salir y ocultar */}
            <ModalOption $danger onClick={handleLeaveAndDelete} disabled={loading}>
              {loading ? (t('loading') || 'Saliendo...') : t('exitAndDelete')}
            </ModalOption>

            {/* Solo salir — queda en stand-by */}
            <ModalOption $danger onClick={handleLeaveGroup} disabled={loading}>
              {t('exitGroup')}
            </ModalOption>

            <CancelButton onClick={() => setShowExitModal(false)} disabled={loading}>
              {t('cancel')}
            </CancelButton>
          </ModalSheet>
        </Overlay>
      )}

      {/* Modal — Eliminar grupo (ocultar) */}
      {showDeleteModal && (
        <Overlay onClick={() => setShowDeleteModal(false)}>
          <ModalSheet onClick={e => e.stopPropagation()}>
            <ModalTitle>{t('deleteGroupTitle')}</ModalTitle>
            <ModalSubtitle>{t('deleteGroupSubtitle')}</ModalSubtitle>
            <ModalOption $danger onClick={handleDeleteGroup}>{t('deleteGroup')}</ModalOption>
            <CancelButton onClick={() => setShowDeleteModal(false)}>{t('cancel')}</CancelButton>
          </ModalSheet>
        </Overlay>
      )}
            {showMuteModal && (
        <Overlay onClick={() => setShowMuteModal(false)}>
          <ModalSheet onClick={e => e.stopPropagation()}>
            <ModalTitle>{t('muteNotifications')}</ModalTitle>
            <ModalSubtitle>{t('muteSubtitle')}</ModalSubtitle>

            {muted ? (
              <ModalOption onClick={handleUnmute}>{t('unmute')}</ModalOption>
            ) : (
              <>
                <ModalOption onClick={() => handleMute('8h')}>{t('mute8h')}</ModalOption>
                <ModalOption onClick={() => handleMute('1w')}>{t('mute1w')}</ModalOption>
                <ModalOption onClick={() => handleMute('forever')}>{t('muteAlways')}</ModalOption>
              </>
            )}

            <CancelButton onClick={() => setShowMuteModal(false)}>
              {t('cancel')}
            </CancelButton>
          </ModalSheet>
        </Overlay>
      )}
    </>
  );
}

export default GroupActions;
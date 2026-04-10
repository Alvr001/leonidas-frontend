import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { FiChevronRight, FiX } from 'react-icons/fi';
import { getMessageContent } from '../../../../services/api';
import {
  MediaContainer, MediaHeader, MediaTitle,
  MediaCount, MediaCountText, MediaGrid,
  MediaItem, EmptyMedia, MediaThumb,
  LightboxOverlay, LightboxImg, LightboxClose
} from './GroupMedia.styled';

function GroupMedia({ mediaMessages = [], groupId }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem('userId'));
  const [lightbox, setLightbox] = useState(null);
  const [resolvedSrcs, setResolvedSrcs] = useState({}); // { [msgId]: base64src }

  // Filtrar imágenes ocultas por este usuario
  const hiddenKey = (msgId) => `hidden_img_${userId}_${msgId}`;
  const clearedAt = localStorage.getItem(`chat_cleared_${userId}_${groupId}`);

const visibleMessages = mediaMessages.filter(msg => {
  if (localStorage.getItem(hiddenKey(msg.id)) === 'true') return false;
  if (clearedAt && new Date(msg.createdAt) <= new Date(clearedAt)) return false;
  return true;
});

  const preview = visibleMessages.slice(-6).reverse();

  // Lazy load para cada imagen del preview
  useEffect(() => {
    preview.forEach(msg => {
      if (resolvedSrcs[msg.id]) return; // ya cargada
      if (!msg.content || msg.content === '__IMAGE__') {
        getMessageContent(msg.id)
          .then(res => {
            const c = res.data;
            const src = c.startsWith('data:') ? c : `data:image/jpeg;base64,${c}`;
            setResolvedSrcs(prev => ({ ...prev, [msg.id]: src }));
          })
          .catch(() => {});
      } else {
        const src = msg.content.startsWith('data:')
          ? msg.content
          : `data:image/jpeg;base64,${msg.content}`;
        setResolvedSrcs(prev => ({ ...prev, [msg.id]: src }));
      }
    });
  }, [mediaMessages]);

  const handleHideImage = (e, msgId) => {
    e.stopPropagation();
    localStorage.setItem(hiddenKey(msgId), 'true');
    setResolvedSrcs(prev => {
      const next = { ...prev };
      delete next[msgId];
      return next;
    });
  };

  return (
    <>
      <MediaContainer>
        <MediaHeader>
          <MediaTitle>{t('mediaLinksDoc')}</MediaTitle>
          <MediaCount
            onClick={() => navigate(`/groups/${groupId}/media`)}
            style={{ cursor: 'pointer' }}
          >
            <MediaCountText>{visibleMessages.length}</MediaCountText>
            <FiChevronRight size={16} color="#888" />
          </MediaCount>
        </MediaHeader>

        {visibleMessages.length === 0 ? (
          <EmptyMedia>{t('noFiles')}</EmptyMedia>
        ) : (
          <MediaGrid>
            {preview.map((msg) => (
              <MediaItem key={msg.id} style={{ position: 'relative' }}>
                {resolvedSrcs[msg.id] ? (
                  <>
                    <MediaThumb
                      src={resolvedSrcs[msg.id]}
                      alt="img"
                      onClick={() => setLightbox({ src: resolvedSrcs[msg.id], msgId: msg.id })}
                    />
                    {/* Botón ocultar — esquina superior derecha */}
                    <div
                      onClick={(e) => handleHideImage(e, msg.id)}
                      style={{
                        position: 'absolute', top: 4, right: 4,
                        background: 'rgba(0,0,0,0.55)', borderRadius: '50%',
                        width: 22, height: 22, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', zIndex: 2,
                      }}
                    >
                      <FiX size={13} color="white" />
                    </div>
                  </>
                ) : (
                  <div style={{
                    width: '100%', aspectRatio: '1',
                    background: '#eee', borderRadius: 6,
                  }} />
                )}
              </MediaItem>
            ))}
          </MediaGrid>
        )}
      </MediaContainer>

      {lightbox && (
        <LightboxOverlay onClick={() => setLightbox(null)}>
          <LightboxClose onClick={() => setLightbox(null)}>
            <FiX size={28} color="white" />
          </LightboxClose>
          <LightboxImg
            src={lightbox.src}
            alt="full"
            onClick={(e) => e.stopPropagation()}
          />
        </LightboxOverlay>
      )}
    </>
  );
}

export default GroupMedia;
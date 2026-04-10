import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiX } from 'react-icons/fi';
import { getMessages, getMessageContent } from '../../../../services/api';
import { useLanguage } from '../../../../i18n/LanguageContext';

function GroupMediaPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const userId = parseInt(localStorage.getItem('userId'));

  const [images, setImages] = useState([]);
  const [resolvedSrcs, setResolvedSrcs] = useState({});
  const [lightbox, setLightbox] = useState(null);

  const hiddenKey = (msgId) => `hidden_img_${userId}_${msgId}`;

  useEffect(() => {
    getMessages(groupId, userId).then(res => {
      const clearedAt = localStorage.getItem(`chat_cleared_${userId}_${groupId}`);

      const imgs = res.data
        .filter(m => m.type === 'IMAGE')
        .filter(m => localStorage.getItem(hiddenKey(m.id)) !== 'true')
        .filter(m => !clearedAt || new Date(m.createdAt) > new Date(clearedAt))
        .reverse();
      setImages(imgs);
    });
  }, [groupId, userId]);

  // Lazy load todas las imágenes visibles
  useEffect(() => {
    images.forEach(msg => {
      if (resolvedSrcs[msg.id]) return;
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
  }, [images]);

  const handleHide = (e, msgId) => {
    e.stopPropagation();
    localStorage.setItem(hiddenKey(msgId), 'true');
    setImages(prev => prev.filter(m => m.id !== msgId));
    if (lightbox?.msgId === msgId) setLightbox(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8E7' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        background: 'linear-gradient(135deg, #eb4b3f, #f0945b)',
      }}>
        <FiArrowLeft size={22} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <span style={{ color: 'white', fontWeight: 700, fontSize: 17 }}>
          {t('mediaLinksDoc')} · {images.length}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 3, padding: 3,
      }}>
        {images.map(msg => (
          <div
            key={msg.id}
            style={{ aspectRatio: '1', overflow: 'hidden', position: 'relative', background: '#eee' }}
          >
            {resolvedSrcs[msg.id] ? (
              <>
                <img
                  src={resolvedSrcs[msg.id]}
                  alt="media"
                  onClick={() => setLightbox({ src: resolvedSrcs[msg.id], msgId: msg.id })}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                />
                {/* Botón ocultar */}
                <div
                  onClick={(e) => handleHide(e, msg.id)}
                  style={{
                    position: 'absolute', top: 4, right: 4,
                    background: 'rgba(0,0,0,0.55)', borderRadius: '50%',
                    width: 24, height: 24, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 2,
                  }}
                >
                  <FiX size={14} color="white" />
                </div>
              </>
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#ddd' }} />
            )}
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
          {t('noFiles')}
        </p>
      )}

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer' }}
          >
            <FiX size={30} color="white" onClick={() => setLightbox(null)} />
          </div>
          <img
            src={lightbox.src}
            alt="full"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '95vw', maxHeight: '90vh', borderRadius: 8, objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
}

export default GroupMediaPage;
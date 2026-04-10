import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { TbStar, TbStarHalfFilled, TbStarFilled } from 'react-icons/tb';
import { FiX } from 'react-icons/fi';
import Avatar from '../../../components/Avatar/Avatar';
import {
  Row, Bubble, SenderName,
  MessageText, MessageFooter, MessageTime, SystemMessage,
  ImageMessage, FullscreenOverlay, FullscreenImg, FullscreenCloseBtn
} from './MessageBubble.styled';
import { getMessageContent } from '../../../services/api';

function MessageStatusIcon({ totalMembers, readCount }) {
  if (readCount === 0) return <TbStar size={14} color="rgba(255,255,255,0.6)" />;
  if (readCount < totalMembers - 1) return <TbStarHalfFilled size={14} color="rgba(255,255,255,0.8)" />;
  return <TbStarFilled size={14} color="#FFD700" />;
}

function ImageViewer({ src, onClose }) {
  return ReactDOM.createPortal(
    <FullscreenOverlay onClick={onClose}>
      <FullscreenCloseBtn onClick={e => { e.stopPropagation(); onClose(); }}>
        <FiX size={20} color="white" />
      </FullscreenCloseBtn>
      <FullscreenImg
        src={src && src.startsWith('data:') ? src : `data:image/jpeg;base64,${src}`}
        alt="fullscreen"
        onClick={e => e.stopPropagation()}
      />
    </FullscreenOverlay>,
    document.body
  );
}

// formatTime por defecto si no se pasa como prop (fallback)
const defaultFormatTime = (createdAt) => {
  if (!createdAt) return '';
  const normalized = createdAt.toString().replace('Z', '');
  return new Date(normalized).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
};

function MessageBubble({ message, isMine, totalMembers, formatTime }) {
    const myPhoto = localStorage.getItem('userPhoto');

  const senderPhoto = isMine
    ? myPhoto
    : message.sender?.profilePhoto || message.sender?.avatarUrl;
  const [fullscreen, setFullscreen] = useState(false);
  const resolvedFormatTime = formatTime || defaultFormatTime;

  const [imgSrc, setImgSrc] = useState(() => {
    if (message.type !== 'IMAGE') return null;
    if (!message.content || message.content === '__IMAGE__') return null;
    return message.content.startsWith('data:')
      ? message.content
      : `data:image/jpeg;base64,${message.content}`;
  });

  useEffect(() => {
    if (message.type === 'IMAGE' && message.content === '__IMAGE__') {
      getMessageContent(message.id)
        .then(res => {
          const c = res.data;
          setImgSrc(c.startsWith('data:') ? c : `data:image/jpeg;base64,${c}`);
        })
        .catch(() => {});
    }
  }, [message.id, message.content, message.type]);

  if (message.type === 'SYSTEM') {
    return <SystemMessage>{message.content}</SystemMessage>;
  }

  return (
    <>
      <Row $mine={isMine}>
        {!isMine && (
          <Avatar 
            name={message.sender?.name || 'Usuario eliminado'} 
            id={message.sender?.id} 
            size="sm"
            src={message.sender?.profilePhoto || null}
          />
        )}
        <Bubble $mine={isMine} $isImage={message.type === 'IMAGE'}>
          {!isMine && <SenderName>{message.sender?.name || 'Usuario eliminado'}</SenderName>}

          {message.type === 'IMAGE' ? (
            imgSrc ? (
              <ImageMessage
                src={imgSrc}
                alt="imagen"
                onClick={() => setFullscreen(true)}
              />
            ) : (
              <div style={{
                width: 200, height: 150, background: '#eee',
                borderRadius: 8, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#999', fontSize: 13,
              }}>
                Cargando...
              </div>
            )
          ) : (
            <MessageText $mine={isMine}>{message.content}</MessageText>
          )}

          <MessageFooter>
            <MessageTime $mine={isMine}>
              {resolvedFormatTime(message.createdAt)}
            </MessageTime>
            {isMine && (
              <MessageStatusIcon totalMembers={totalMembers} readCount={0} />
            )}
          </MessageFooter>
        </Bubble>
      </Row>

      {fullscreen && imgSrc && (
        <ImageViewer src={imgSrc} onClose={() => setFullscreen(false)} />
      )}
    </>
  );
}

export default MessageBubble;
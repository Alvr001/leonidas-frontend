import React from 'react';
import { StyledAvatar } from './Avatar.styled';

const COLORS = [
  '#F4A435', '#E8841A', '#FF6B6B',
  '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD'
];

const SIZE_MAP = {
  sm: '32px',
  md: '40px',
  lg: '56px',
};

function Avatar({ name, id, size = 'md', color, src }) {
  const sizePx = SIZE_MAP[size] || SIZE_MAP.md;

  // Foto de perfil del usuario logueado
  const userPhoto = localStorage.getItem('userPhoto');
  const loggedUserId = parseInt(localStorage.getItem('userId'));

  const photoSrc = src || (id === loggedUserId ? userPhoto : null);

  if (photoSrc) {
    return (
      <img
        src={photoSrc}
        alt="avatar"
        style={{
          width: sizePx,
          height: sizePx,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    );
  }

  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const avatarColor = color || COLORS[(id || 0) % COLORS.length];

  return (
    <StyledAvatar size={size} color={avatarColor}>
      {initial}
    </StyledAvatar>
  );
}

export default Avatar;
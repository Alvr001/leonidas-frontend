import React from 'react';
import { StyledButton, IconButton, FabButton } from './Button.styled';

function Button({ children, variant = 'primary', size = 'md', ...props }) {
  return (
    <StyledButton $variant={variant} $size={size} {...props}>
      {children}
    </StyledButton>
  );
}

export function Icon({ children, ...props }) {
  return <IconButton {...props}>{children}</IconButton>;
}

export function Fab({ children, ...props }) {
  return <FabButton {...props}>{children}</FabButton>;
}

export default Button;
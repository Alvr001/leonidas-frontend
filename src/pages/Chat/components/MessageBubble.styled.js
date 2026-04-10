import styled, { keyframes } from 'styled-components';
import typography from '../../../styles/typography';
import spacing from '../../../styles/spacing';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Row = styled.div`
  display: flex;
  justify-content: ${({ $mine }) => $mine ? 'flex-end' : 'flex-start'};
  align-items: flex-end;
  gap: ${spacing.sm};
  animation: ${fadeIn} 0.2s ease;
`;

export const Bubble = styled.div`
  max-width: 72%;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${({ $mine }) =>
    $mine ? '18px 4px 18px 18px' : '4px 18px 18px 18px'};
  background: ${({ $mine }) =>
    $mine
      ? 'linear-gradient(135deg, #f0945b, #eb4b3f)'
      : '#FFFFFF'};
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
`;

export const SenderName = styled.p`
  font-size: ${typography.sizes.xs};
  font-weight: ${typography.weights.bold};
  color: #eb4b3f;
  margin-bottom: 3px;
`;

export const MessageText = styled.p`
  font-size: ${typography.sizes.md};
  line-height: ${typography.lineHeights.normal};
  color: ${({ $mine }) => $mine ? '#FFFFFF' : '#1A1A1A'};
`;

export const MessageFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 4px;
`;

export const MessageTime = styled.span`
  font-size: ${typography.sizes.xs};
  color: ${({ $mine }) =>
    $mine ? 'rgba(255,255,255,0.75)' : '#BBBBBB'};
`;

export const SystemMessage = styled.div`
  text-align: center;
  font-size: ${typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${spacing.xs} ${spacing.lg};
  background: rgba(0,0,0,0.05);
  border-radius: 10px;
  align-self: center;
  max-width: 80%;
`;
export const ImageMessage = styled.img`
  max-width: 220px;
  max-height: 260px;
  border-radius: 10px;
  object-fit: cover;
  cursor: pointer;
  display: block;
`;


export const FullscreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease;
`;

export const FullscreenImg = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 12px;
  user-select: none;
  display: block;
  margin: auto;
`;

export const FullscreenCloseBtn = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1001;
`;
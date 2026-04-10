import styled, { keyframes } from 'styled-components';
import typography from '../../../../styles/typography';
import spacing from '../../../../styles/spacing';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 200;
  animation: ${fadeIn} 0.2s ease;
`;

export const ModalSheet = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 24px 24px 0 0;
  width: 100%;
  max-width: 500px;
  padding: ${spacing.xxl} ${spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

export const ModalTitle = styled.h3`
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${spacing.xs};
`;

export const ModalSubtitle = styled.p`
  font-size: ${typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${spacing.md};
  line-height: ${typography.lineHeights.normal};
`;

export const ModalOption = styled.button`
  width: 100%;
  padding: ${spacing.lg};
  background: none;
  border: none;
  border-radius: 12px;
  font-size: ${typography.sizes.md};
  font-family: ${typography.families.primary};
  font-weight: ${typography.weights.medium};
  color: ${({ $danger, theme }) => $danger ? '#E63946' : theme.colors.text};
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:hover {
    background: ${({ $danger }) =>
      $danger ? 'rgba(230,57,70,0.07)' : '#FFF8E7'};
  }
`;

export const ModalDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: ${spacing.xs} 0;
`;

export const CancelButton = styled.button`
  width: 100%;
  padding: ${spacing.lg};
  background: ${({ theme }) => theme.colors.surfaceSecondary};
  border: none;
  border-radius: 12px;
  font-size: ${typography.sizes.md};
  font-family: ${typography.families.primary};
  font-weight: ${typography.weights.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  margin-top: ${spacing.xs};
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;
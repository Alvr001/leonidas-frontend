import styled, { keyframes } from 'styled-components';
import typography from '../../styles/typography';
import spacing from '../../styles/spacing';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ── Layout ────────────────────────────────────────────────────────────────────
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  font-family: ${typography.families.primary};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.lg} ${spacing.xl};
  background: #FFB347;
  box-shadow: 0 2px 8px rgba(244, 164, 53, 0.3);
`;

export const HeaderTitle = styled.h2`
  font-size: ${typography.sizes.xl};
  font-weight: ${typography.weights.bold};
  color: white;
  flex: 1;
`;

export const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
  padding: ${spacing.xxl} ${spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${spacing.sm};
`;

export const ProfileInfo = styled.div`
  flex: 1;
`;

export const ProfileName = styled.p`
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const ProfileId = styled.p`
  font-size: ${typography.sizes.sm};
  font-weight: 700;
  color: #E8841A;
  margin-top: 2px;
`;

export const SectionTitle = styled.p`
  font-size: ${typography.sizes.sm};
  font-weight: ${typography.weights.bold};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${spacing.md} ${spacing.xl} ${spacing.xs};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const SettingItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
  padding: ${spacing.lg} ${spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  transition: background 0.15s;

  &:hover {
    background: ${({ disabled, theme }) => disabled ? theme.colors.surface : '#FFF8E7'};
  }
`;

export const SettingIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${({ color }) => color || '#FFF0CC'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const SettingInfo = styled.div`
  flex: 1;
`;

export const SettingTitle = styled.p`
  font-size: ${typography.sizes.md};
  font-weight: ${typography.weights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

export const SettingSubtext = styled.p`
  font-size: ${typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 2px;
`;

// ── Modal ─────────────────────────────────────────────────────────────────────
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.15s ease;
`;

export const ModalBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px 20px;
  width: 270px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  animation: ${slideUp} 0.18s ease;
`;

export const ModalTitle = styled.p`
  font-size: 16px;
  font-weight: 800;
  color: #2C1A0E;
  margin-bottom: 6px;
`;

export const ModalSub = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #9A7C5E;
  margin-bottom: 20px;
  line-height: 1.5;
`;

export const ModalBtns = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

/* Sí — cerrar sesión (naranja) */
export const BtnConfirm = styled.button`
  background: #E07B5A;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;
  &:active { opacity: 0.8; }
`;

/* Sí — eliminar cuenta (rojo) */
export const BtnDanger = styled.button`
  background: #E63946;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;
  &:active { opacity: 0.8; }
`;

/* No / Cancelar */
export const BtnCancelModal = styled.button`
  background: #F0EAD8;
  color: #5C4A2E;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #E8DCCA; }
`;
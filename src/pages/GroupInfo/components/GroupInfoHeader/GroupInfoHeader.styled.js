import styled from 'styled-components';
import typography from '../../../../styles/typography';
import spacing from '../../../../styles/spacing';

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${spacing.xxxl} ${spacing.xl} ${spacing.xxl};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: ${spacing.sm};
`;

export const TopBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.lg};
`;

export const GroupName = styled.h1`
  font-family: ${typography.families.primary};
  font-size: ${typography.sizes.xxl};
  font-weight: ${typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

export const GroupType = styled.p`
  font-size: ${typography.sizes.md};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${typography.weights.semibold};
  text-align: center;
`;

export const GroupDescription = styled.p`
  font-size: ${typography.sizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: ${typography.lineHeights.normal};
`;

export const AddDescription = styled.p`
  font-size: ${typography.sizes.md};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  text-align: center;

  &:hover {
    text-decoration: underline;
  }
`;

export const CreatedBy = styled.p`
  font-size: ${typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-align: center;
`;

export const LargeAvatar = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: ${({ color }) => color || '#F4A435'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: ${typography.weights.bold};
  color: white;
  font-family: ${typography.families.primary};
`;
export const AvatarWrapper = styled.div`
  position: relative;
  cursor: ${p => p.$clickable ? 'pointer' : 'default'};
  display: inline-flex;
  margin-bottom: 8px;
`;

export const AvatarEditBadge = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: #F4A435;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 1px 4px #0003;
`;

// Reutilizar los mismos estilos del ProfilePage para el cropper y modal:
export const CropperOverlay = styled.div`
  position: fixed; inset: 0; background: #000;
  z-index: 200; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
`;
export const CropperTitle = styled.p`
  color: white; font-size: 15px; font-weight: 500; margin-bottom: 16px;
`;
export const CropperContainer = styled.div`
  position: relative; width: 100%; max-width: 400px; height: 350px;
`;
export const CropperActions = styled.div`
  display: flex; gap: 16px; margin-top: 24px;
`;
export const CropBtn = styled.button`
  background: #F4A435; color: white; border: none; border-radius: 24px;
  padding: 12px 32px; font-size: 15px; font-weight: 700; cursor: pointer;
  &:disabled { opacity: 0.6; }
`;
export const CropCancelBtn = styled.button`
  background: transparent; color: #aaa; border: 1.5px solid #444;
  border-radius: 24px; padding: 12px 24px; font-size: 15px; cursor: pointer;
`;
export const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: #0005; z-index: 100;
  display: flex; align-items: flex-end;
`;
export const ModalSheet = styled.div`
  width: 100%; background: white; border-radius: 20px 20px 0 0; padding: 12px 0 24px;
`;
export const ModalOption = styled.button`
  width: 100%; background: transparent; border: none; padding: 16px 24px;
  font-size: 16px; text-align: left; cursor: pointer;
  display: flex; align-items: center; gap: 14px;
  color: ${p => p.$danger ? '#E63946' : '#1a1a1a'};
  font-weight: ${p => p.$danger ? 600 : 400};
  &:hover { background: #FFF8E7; }
`;
export const ModalDivider = styled.div`
  height: 1px; background: #F0F0F0; margin: 4px 0;
`;
export const ModalCancel = styled.button`
  width: 100%; background: transparent; border: none;
  padding: 14px 24px; font-size: 16px; font-weight: 600;
  color: #F4A435; cursor: pointer;
`;
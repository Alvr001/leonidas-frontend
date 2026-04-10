import styled, { keyframes, css } from 'styled-components';
import typography from '../../styles/typography';
import spacing from '../../styles/spacing';

const pulseRing = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(235, 75, 63, 0.6); }
  70% { box-shadow: 0 0 0 12px rgba(235, 75, 63, 0); }
  100% { box-shadow: 0 0 0 0 rgba(235, 75, 63, 0); }
`;

const slideDown = keyframes`
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const alarmFlash = keyframes`
  0%, 100% { background: #E63946; }
  50% { background: #C1121F; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #FFF8E7;
  font-family: ${typography.families.primary};
`;

/*export const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${spacing.lg} ${spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;*/
export const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${spacing.lg} ${spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  background-color: #EAD9B8;
  overflow-anchor: none; /* 🔥 evita comportamiento automático del browser */
`;

export const EmptyChat = styled.p`
  text-align: center;
  color: #BBBBBB;
  font-size: ${typography.sizes.md};
  margin-top: ${spacing.xxxl};
`;

export const ActiveBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.sm} ${spacing.xl};
  background: rgba(235, 75, 63, 0.1);
  border-bottom: 1px solid rgba(235, 75, 63, 0.25);
  animation: ${slideDown} 0.3s ease;
`;

export const AlertPulse = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #eb4b3f;
  flex-shrink: 0;
  animation: ${pulseRing} 1.5s infinite;
`;

export const ActiveAlertText = styled.p`
  flex: 1;
  font-size: ${typography.sizes.sm};
  color: #1A1A1A;

  strong {
    color: #eb4b3f;
    font-weight: ${typography.weights.bold};
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: ${fadeIn} 0.2s ease;
`;

export const AlarmConfirmModal = styled.div`
  background: #FFFFFF;
  border-radius: 24px;
  padding: ${spacing.xxxl} ${spacing.xxl};
  width: 90%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.lg};
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
`;

export const AlarmConfirmIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(235, 75, 63, 0.1);
  border: 2px solid rgba(235, 75, 63, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AlarmConfirmTitle = styled.h3`
  font-size: ${typography.sizes.xl};
  font-weight: ${typography.weights.bold};
  color: #1A1A1A;
  text-align: center;
`;

export const AlarmConfirmText = styled.p`
  font-size: ${typography.sizes.md};
  color: #888888;
  text-align: center;
  line-height: ${typography.lineHeights.normal};
`;

export const AlarmConfirmButtons = styled.div`
  display: flex;
  gap: ${spacing.sm};
  width: 100%;
`;

export const AlarmReceivedModal = styled.div`
  position: fixed;
  inset: 0;
  background: #E63946;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 200;
  gap: ${spacing.xxl};
  animation: ${alarmFlash} 1s infinite;
`;

export const AlarmReceivedText = styled.p`
  font-size: ${typography.sizes.xl};
  font-weight: ${typography.weights.black};
  color: white;
  text-align: center;
  padding: 0 ${spacing.xxxl};
  line-height: ${typography.lineHeights.relaxed};
`;

export const AlarmOkButton = styled.button`
  padding: ${spacing.lg} ${spacing.xxxl};
  background: white;
  border: none;
  border-radius: 16px;
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.weights.bold};
  color: #E63946;
  cursor: pointer;
  font-family: ${typography.families.primary};
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.04);
  }
`;

export const AlertModalContainer = styled.div`
  background: #FFFFFF;
  border-radius: 24px 24px 0 0;
  padding: ${spacing.xxxl} ${spacing.xxl};
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

export const AlertModalTitle = styled.h3`
  font-size: ${typography.sizes.xl};
  font-weight: ${typography.weights.bold};
  color: #1A1A1A;
`;

export const StyledSelect = styled.select`
  padding: ${spacing.md} ${spacing.lg};
  background: #FFF8E7;
  border: 1.5px solid #FFE0A0;
  border-radius: 12px;
  font-size: ${typography.sizes.md};
  font-family: ${typography.families.primary};
  color: #1A1A1A;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #F4A435;
  }
`;

export const StyledTextArea = styled.textarea`
  padding: ${spacing.md} ${spacing.lg};
  background: #FFF8E7;
  border: 1.5px solid #FFE0A0;
  border-radius: 12px;
  font-size: ${typography.sizes.md};
  font-family: ${typography.families.primary};
  color: #1A1A1A;
  outline: none;
  resize: none;
  line-height: ${typography.lineHeights.normal};

  &::placeholder {
    color: #BBBBBB;
  }

  &:focus {
    border-color: #F4A435;
  }
`;

export const AlertModalButtons = styled.div`
  display: flex;
  gap: ${spacing.sm};
`;
export const DateSeparator = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  margin: ${spacing.md} 0;
`;

export const DateLine = styled.div`
  flex: 1;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

export const DateText = styled.span`
  font-size: ${typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.background};
  padding: ${spacing.xs} ${spacing.md};
  border-radius: 10px;
  white-space: nowrap;
  font-weight: ${typography.weights.medium};
`;
export const NotMemberBar = styled.div`
  padding: ${spacing.lg} ${spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
  font-size: ${typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
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
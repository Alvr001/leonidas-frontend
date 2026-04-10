import styled, { keyframes } from 'styled-components';
import typography from '../../../styles/typography';
import spacing from '../../../styles/spacing';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const AlertContainer = styled.div`
  background: ${({ level }) =>
    level === 'RED' ? 'rgba(235,75,63,0.1)' :
    level === 'YELLOW' ? 'rgba(251,133,0,0.1)' :
    'rgba(6,214,160,0.1)'};
  border: 1.5px solid ${({ level }) =>
    level === 'RED' ? 'rgba(235,75,63,0.35)' :
    level === 'YELLOW' ? 'rgba(251,133,0,0.35)' :
    'rgba(6,214,160,0.35)'};
  border-radius: 14px;
  padding: ${spacing.md} ${spacing.lg};
  animation: ${fadeIn} 0.3s ease;
`;

export const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.sm};
`;

export const AlertLevelText = styled.span`
  font-size: ${typography.sizes.sm};
  font-weight: ${typography.weights.bold};
  color: ${({ level }) =>
    level === 'RED' ? '#eb4b3f' :
    level === 'YELLOW' ? '#FB8500' :
    '#06D6A0'};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

export const AlertTime = styled.span`
  font-size: ${typography.sizes.xs};
  color: #BBBBBB;
`;

export const AlertDescription = styled.p`
  font-size: ${typography.sizes.md};
  color: #1A1A1A;
  line-height: ${typography.lineHeights.normal};
  margin-bottom: ${spacing.xs};
`;

export const AlertReporter = styled.p`
  font-size: ${typography.sizes.xs};
  color: #888888;
`;
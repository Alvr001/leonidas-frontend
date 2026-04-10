import styled from 'styled-components';
import typography from '../../../../styles/typography';
import spacing from '../../../../styles/spacing';

export const ActionsContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  margin-top: ${spacing.sm};
`;

export const ActionItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
  padding: ${spacing.lg} ${spacing.xl};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  transition: background 0.15s;

  &:hover {
    background: ${({ color, disabled }) =>
      disabled ? 'none' :
      color === 'danger' ? 'rgba(230,57,70,0.05)' : '#FFF8E7'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ActionIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${({ color, theme }) =>
    color === 'danger' ? 'rgba(230,57,70,0.1)' : theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ActionText = styled.p`
  font-size: ${typography.sizes.md};
  font-weight: ${typography.weights.medium};
  color: ${({ color }) => color === 'danger' ? '#E63946' : '#1A1A1A'};
`;
export const ActionSubtext = styled.p`
  font-size: ${typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 2px;
`;
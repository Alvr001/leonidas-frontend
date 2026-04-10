import styled from 'styled-components';
import typography from '../../styles/typography';
import spacing from '../../styles/spacing';

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
  background: linear-gradient(90deg, #eb4b3f 0%, #f0945b 100%);
  box-shadow: 0 2px 8px rgba(235,75,63,0.3);
`;

export const HeaderTitle = styled.h2`
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.weights.bold};
  color: white;
  flex: 1;
`;

export const SectionTitle = styled.p`
  font-size: ${typography.sizes.sm};
  font-weight: ${typography.weights.bold};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${spacing.lg} ${spacing.xl} ${spacing.sm};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const PermissionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.lg} ${spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

export const PermissionInfo = styled.div`
  flex: 1;
  margin-right: ${spacing.lg};
`;

export const PermissionTitle = styled.p`
  font-size: ${typography.sizes.md};
  font-weight: ${typography.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 3px;
`;

export const PermissionDesc = styled.p`
  font-size: ${typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${typography.lineHeights.normal};
`;

export const Toggle = styled.div`
  width: 48px;
  height: 26px;
  border-radius: 13px;
  background: ${({ $enabled }) => $enabled ? '#F4A435' : '#DDD'};
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: ${({ $enabled }) => $enabled ? '25px' : '3px'};
    transition: left 0.2s ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
`;

export const MembersCount = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.lg} ${spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const MembersCountText = styled.p`
  font-size: ${typography.sizes.md};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${typography.weights.semibold};
`;

import styled from 'styled-components';
import typography from '../../../../styles/typography';
import spacing from '../../../../styles/spacing';

export const MembersContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const MembersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.lg} ${spacing.xl} ${spacing.sm};
`;

export const MembersTitle = styled.p`
  font-size: ${typography.sizes.md};
  font-weight: ${typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

export const AddMemberButton = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
  padding: ${spacing.md} ${spacing.xl};
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const AddMemberIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #F4A435, #E8841A);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const AddMemberText = styled.p`
  font-size: ${typography.sizes.md};
  font-weight: ${typography.weights.semibold};
  color: ${({ theme }) => theme.colors.primary};
`;

export const MemberItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
  padding: ${spacing.md} ${spacing.xl};
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const MemberInfo = styled.div`
  flex: 1;
`;

export const MemberName = styled.p`
  font-size: ${typography.sizes.md};
  font-weight: ${typography.weights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

export const AdminBadge = styled.span`
  font-size: ${typography.sizes.xs};
  font-weight: ${typography.weights.bold};
  color: white;
  background: linear-gradient(135deg, #F4A435, #E8841A);
  padding: 2px 8px;
  border-radius: 6px;
`;

export const ShowMoreButton = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
  padding: ${spacing.md} ${spacing.xl};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${typography.sizes.md};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;
export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  margin: ${spacing.xs} ${spacing.xl} ${spacing.md};
  padding: ${spacing.sm} ${spacing.md};
  background: ${({ theme }) => theme.colors.surfaceSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
`;

export const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: ${typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${typography.families.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;
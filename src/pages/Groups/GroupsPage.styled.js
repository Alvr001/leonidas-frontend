import styled from 'styled-components';
import typography from '../../styles/typography';
import spacing from '../../styles/spacing';


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  font-family: ${typography.families.primary};
`;

/*export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.lg} ${spacing.xl};
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const HeaderTitle = styled.h1`
  font-family: ${typography.families.display};
  font-size: ${typography.sizes.xxl};
  font-weight: ${typography.weights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;*/
export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.lg} ${spacing.xl};
  background: #FFB347;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(244, 164, 53, 0.3);
`;

export const HeaderTitle = styled.h1`
  font-family: ${typography.families.display};
  font-size: ${typography.sizes.xxl};
  font-weight: ${typography.weights.bold};
  color: #FFFFFF;
`;

export const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const ChatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
  padding: ${spacing.lg} ${spacing.xl};
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  cursor: pointer;
  transition: background 0.15s ease;

  &:active {
    background: ${({ theme }) => theme.colors.primaryBorder};
  }
`;

export const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ChatName = styled.p`
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatPreview = styled.p`
  font-size: ${typography.sizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
`;

export const ChatTime = styled.span`
  font-size: ${typography.sizes.xs};
  color: ${({ $unread, theme }) => $unread ? theme.colors.danger : theme.colors.textSecondary};
  font-weight: ${({ $unread }) => $unread ? typography.weights.bold : typography.weights.medium};
`;

export const UnreadBadge = styled.div`
  min-width: 22px;
  height: 22px;
  border-radius: 11px;
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  font-size: ${typography.sizes.xs};
  font-weight: ${typography.weights.bold};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${spacing.xs};
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: ${spacing.md};
`;

export const EmptyText = styled.p`
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.weights.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const EmptySubtext = styled.p`
  font-size: ${typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

export const FabButton = styled.button`
  position: fixed;
  bottom: ${spacing.xxl};
  right: ${spacing.xxl};
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(
    180deg,
    #ffda6a 0%,
    #fff7de 100%
  );
  color: ${({ theme }) => theme.colors.primaryDark};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.shadowStrong};
  transition: all 0.2s ease;
  z-index: 50;

  &:hover {
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
`;

export const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 24px 24px 0 0;
  padding: ${spacing.xxxl} ${spacing.xxl};
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

export const ModalTitle = styled.h3`
  font-size: ${typography.sizes.xl};
  font-weight: ${typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const ModalInput = styled.input`
  padding: ${spacing.md} ${spacing.lg};
  background: ${({ theme }) => theme.colors.surfaceSecondary};
  border: 1.5px solid ${({ theme }) => theme.colors.primaryBorder};
  border-radius: 12px;
  font-size: ${typography.sizes.md};
  font-family: ${typography.families.primary};
  outline: none;
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: ${spacing.sm};
`;

export const JoinLink = styled.p`
  text-align: center;
  font-size: ${typography.sizes.sm};
  font-weight: ${typography.weights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const JoinItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};

  &:last-child {
    border-bottom: none;
  }
`;

export const JoinItemInfo = styled.div`
  flex: 1;
`;

export const JoinItemName = styled.p`
  font-size: ${typography.sizes.md};
  font-weight: ${typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const JoinItemDesc = styled.p`
  font-size: ${typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const JoinListScroll = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;
export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.xl};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: ${typography.sizes.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${typography.families.primary};
  padding: ${spacing.sm} 0;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;
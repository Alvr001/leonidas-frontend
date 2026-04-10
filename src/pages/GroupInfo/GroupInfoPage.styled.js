import styled from 'styled-components';
import typography from '../../styles/typography';
import spacing from '../../styles/spacing';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  overflow-y: auto;
`;

export const FormerMemberBar = styled.div`
  padding: ${spacing.md} ${spacing.xl};
  background: rgba(230, 57, 70, 0.08);
  border-bottom: 1px solid rgba(230, 57, 70, 0.2);
  text-align: center;
  font-size: ${typography.sizes.sm};
  color: #E63946;
  font-style: italic;
`;

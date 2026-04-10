import styled from 'styled-components';
import typography from '../../../styles/typography';
import spacing from '../../../styles/spacing';

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md} ${spacing.lg};
  background: linear-gradient(90deg, #eb4b3f 0%, #f0945b 100%);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 12px rgba(235, 75, 63, 0.35);
`;

export const HeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const HeaderName = styled.h2`
  font-size: ${typography.sizes.lg};
  font-weight: ${typography.weights.bold};
  color: #FFFFFF;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const HeaderMembers = styled.p`
  font-size: ${typography.sizes.xs};
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
`;
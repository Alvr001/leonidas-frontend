import styled from 'styled-components';
import typography from '../../styles/typography';

const sizeMap = {
  sm: '32px',
  md: '44px',
  lg: '52px',
  xl: '72px',
};

const fontSizeMap = {
  sm: typography.sizes.sm,
  md: typography.sizes.lg,
  lg: typography.sizes.xl,
  xl: typography.sizes.display,
};

export const StyledAvatar = styled.div`
  width: ${({ size }) => sizeMap[size] || sizeMap.md};
  height: ${({ size }) => sizeMap[size] || sizeMap.md};
  border-radius: 50%;
  background: ${({ color }) => color || '#F4A435'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ size }) => fontSizeMap[size] || fontSizeMap.md};
  font-weight: ${typography.weights.bold};
  color: white;
  flex-shrink: 0;
  font-family: ${typography.families.primary};
  user-select: none;
`;
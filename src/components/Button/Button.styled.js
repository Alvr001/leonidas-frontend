import styled, { css } from 'styled-components';
import typography from '../../styles/typography';
import spacing from '../../styles/spacing';

const variants = {
  primary: css`
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.primaryDark}
    );
    color: ${({ theme }) => theme.colors.textInverse};
    box-shadow: 0 4px 16px ${({ theme }) => theme.colors.shadowMedium};

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px ${({ theme }) => theme.colors.shadowStrong};
    }

    &:active {
      transform: translateY(0);
    }
  `,

  secondary: css`
    background: ${({ theme }) => theme.colors.surfaceSecondary};
    color: ${({ theme }) => theme.colors.textSecondary};
    border: 1.5px solid ${({ theme }) => theme.colors.border};

    &:hover {
      background: ${({ theme }) => theme.colors.border};
    }
  `,

  danger: css`
    background: linear-gradient(135deg, #E63946, #C1121F);
    color: white;
    box-shadow: 0 4px 16px rgba(230, 57, 70, 0.3);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(230, 57, 70, 0.5);
    }
  `,

  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: none;

    &:hover {
      background: ${({ theme }) => theme.colors.primaryLight};
    }
  `,
};

const sizes = {
  sm: css`
    padding: ${spacing.sm} ${spacing.md};
    font-size: ${typography.sizes.sm};
    border-radius: 10px;
  `,
  md: css`
    padding: ${spacing.md} ${spacing.lg};
    font-size: ${typography.sizes.md};
    border-radius: 12px;
  `,
  lg: css`
    padding: ${spacing.lg} ${spacing.xl};
    font-size: ${typography.sizes.lg};
    border-radius: 14px;
  `,
  full: css`
    width: 100%;
    padding: ${spacing.lg};
    font-size: ${typography.sizes.lg};
    border-radius: 12px;
  `,
};

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  border: none;
  font-family: ${typography.families.primary};
  font-weight: ${typography.weights.bold};
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  text-decoration: none;
  white-space: nowrap;

  ${({ $variant }) => variants[$variant] || variants.primary}
  ${({ $size }) => sizes[$size] || sizes.md}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size || '40px'};
  height: ${({ size }) => size || '40px'};
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s ease;
  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FabButton = styled.button`
  position: fixed;
  bottom: ${spacing.xxl};
  right: ${spacing.xxl};
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.primaryDark}
  );
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.shadowStrong};
  transition: all 0.2s ease;
  z-index: 50;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 28px ${({ theme }) => theme.colors.shadowStrong};
  }

  &:active {
    transform: scale(0.96);
  }
`;
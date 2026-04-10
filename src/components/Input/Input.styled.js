import styled from 'styled-components';
import typography from '../../styles/typography';
import spacing from '../../styles/spacing';

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  width: 100%;
  background: ${({ theme }) => theme.colors.surfaceSecondary};
  border: 1.5px solid ${({ theme }) => theme.colors.primaryBorder};
  border-radius: 12px;
  padding: ${spacing.sm} ${spacing.lg};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.shadow};
  }
`;

export const StyledInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: ${typography.families.primary};
  font-size: ${typography.sizes.md};
  color: ${({ theme }) => theme.colors.text};
  padding: ${spacing.sm} 0;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

export const TextAreaWrapper = styled(InputWrapper)`
  align-items: flex-end;
  border-radius: 20px;
  padding: ${spacing.sm} ${spacing.md};
`;

export const StyledTextArea = styled.textarea`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: ${typography.families.primary};
  font-size: ${typography.sizes.md};
  color: ${({ theme }) => theme.colors.text};
  resize: none;
  max-height: 100px;
  line-height: ${typography.lineHeights.normal};
  padding: ${spacing.sm} 0;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;
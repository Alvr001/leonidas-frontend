import styled, { keyframes } from 'styled-components';
import typography from '../../../styles/typography';
import spacing from '../../../styles/spacing';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.7); }
  to { opacity: 1; transform: scale(1); }
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${spacing.sm};
  padding: ${spacing.md} ${spacing.lg};
  background: #FFFFFF;
  border-top: 1px solid #FFE8B2;
`;

export const InputActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  flex-shrink: 0;
`;

export const TextArea = styled.textarea`
  flex: 1;
  background: #FFF8E7;
  border: 1.5px solid #FFE0A0;
  border-radius: 20px;
  padding: ${spacing.sm} ${spacing.lg};
  font-size: ${typography.sizes.md};
  font-family: ${typography.families.primary};
  color: #1A1A1A;
  outline: none;
  resize: none;
  max-height: 100px;
  line-height: ${typography.lineHeights.normal};
  transition: border-color 0.2s ease;

  &::placeholder {
    color: #BBBBBB;
  }

  &:focus {
    border-color: #F4A435;
  }
`;

export const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #f0945b, #eb4b3f);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 3px 12px rgba(235, 75, 63, 0.35);
  transition: all 0.2s ease;
  animation: ${fadeIn} 0.2s ease;

  &:hover {
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.95);
  }
`;
export const ImagePreviewWrapper = styled.div`
  position: relative;
  padding: 8px 16px 0;
  display: inline-block;
`;

export const ImagePreview = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid #F4A435;
`;

export const RemovePreviewBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 12px;
  background: #E63946;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
export const ErrorToast = styled.div`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #E63946;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  z-index: 200;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
`;
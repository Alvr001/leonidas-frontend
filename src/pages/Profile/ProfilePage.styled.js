import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const Container = styled.div`
  min-height: 100vh;
  background: #FFF8E7;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  background: linear-gradient(135deg, #eb4b3f, #f0945b);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const HeaderTitle = styled.h1`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

export const PhotoSection = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0 32px;
  background: linear-gradient(180deg, #f0945b22 0%, transparent 100%);
`;

export const PhotoWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

export const ProfilePhoto = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #F4A435;
  display: block;
`;

export const PhotoInitial = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: linear-gradient(135deg, #F4A435, #E8841A);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  font-weight: 700;
  color: white;
  border: 3px solid #F4A435;
`;

export const EditPhotoButton = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: white;
  border: 1.5px solid #F4A43560;
  border-radius: 20px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px #0002;
`;

export const EditBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #F4A435;
`;

export const InfoSection = styled.div`
  background: white;
  border-radius: 16px;
  margin: 0 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px #0001;
`;

export const InfoItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #F5F5F5;
  &:last-child { border-bottom: none; }
`;

export const InfoLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #F4A435;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoEditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const InfoValue = styled.div`
  font-size: 16px;
  color: #1a1a1a;
  flex: 1;
`;

export const EditInput = styled.input`
  flex: 1;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid #F4A435;
  background: transparent;
  outline: none;
  padding: 4px 0;
  color: #1a1a1a;
`;

export const SaveBtn = styled.button`
  background: #F4A435;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:disabled { opacity: 0.6; }
`;

export const CancelBtn = styled.button`
  background: transparent;
  color: #999;
  border: none;
  font-size: 13px;
  cursor: pointer;
`;

export const CopyBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
`;

/* Modal */
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: #0005;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  animation: ${fadeIn} 0.2s ease;
`;

export const ModalSheet = styled.div`
  width: 100%;
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 12px 0 24px;
  animation: ${fadeUp} 0.25s ease;
`;

export const ModalOption = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  padding: 16px 24px;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
  color: ${p => p.$danger ? '#E63946' : '#1a1a1a'};
  font-weight: ${p => p.$danger ? 600 : 400};
  &:hover { background: #FFF8E7; }
`;

export const ModalDivider = styled.div`
  height: 1px;
  background: #F0F0F0;
  margin: 4px 0;
`;

export const ModalCancel = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #F4A435;
  cursor: pointer;
`;

/* Toast */
export const Toast = styled.div`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 200;
  animation: ${fadeUp} 0.2s ease;
  white-space: nowrap;
`;
export const CropperOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const CropperTitle = styled.p`
  color: white;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 16px;
  letter-spacing: 0.3px;
`;

export const CropperContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 350px;
`;

export const CropperActions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

export const CropBtn = styled.button`
  background: #F4A435;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: 0.6; }
`;

export const CropCancelBtn = styled.button`
  background: transparent;
  color: #aaa;
  border: 1.5px solid #444;
  border-radius: 24px;
  padding: 12px 24px;
  font-size: 15px;
  cursor: pointer;
`;
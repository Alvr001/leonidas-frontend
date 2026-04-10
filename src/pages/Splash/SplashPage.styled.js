import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: #FFF8E7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
`;

export const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 64px;
`;

export const LogoIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #eb4b3f, #f0945b);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  box-shadow: 0 8px 24px rgba(244, 164, 53, 0.35);
`;

export const AppName = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  margin: 0;
`;

export const Tagline = styled.p`
  font-size: 15px;
  color: #888;
  margin: 0;
  text-align: center;
`;

export const ButtonGroup = styled.div`
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #F4A435;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: #E8841A; }
`;

export const SecondaryButton = styled.button`
  width: 100%;
  padding: 16px;
  background: transparent;
  color: #F4A435;
  border: 2px solid #F4A435;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #FFF0D6; }
`;

export const LangButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: 1.5px solid #ddd;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: border-color 0.2s;

  &:hover { border-color: #F4A435; color: #F4A435; }
`;
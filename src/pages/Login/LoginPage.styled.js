import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: #FFF8E7;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  background: linear-gradient(135deg, #eb4b3f, #f0945b);
  padding: 20px 24px 28px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const BackButton = styled.button`
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.h1`
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
`;

export const Body = styled.div`
  flex: 1;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 24px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e8e0d0;
  border-radius: 12px;
  font-size: 15px;
  background: white;
  color: #1a1a1a;
  outline: none;
  box-sizing: border-box;
  margin-bottom: 12px;
  transition: border-color 0.2s;

  &:focus { border-color: #F4A435; }
  &::placeholder { color: #bbb; }
`;

export const ErrorText = styled.p`
  color: #e53935;
  font-size: 13px;
  margin: -8px 0 12px;
`;

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${p => p.disabled ? '#ddd' : '#F4A435'};
  color: ${p => p.disabled ? '#aaa' : 'white'};
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.2s;
  margin-top: auto;

  &:hover:not(:disabled) { background: #E8841A; }
`;

export const RegisterLink = styled.p`
  text-align: center;
  font-size: 14px;
  color: #888;
  margin-top: 20px;

  span {
    color: #F4A435;
    font-weight: 700;
    cursor: pointer;
    &:hover { text-decoration: underline; }
  }
`;
export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 12px;

  input {
    width: 100%;
    padding: 14px 48px 14px 16px;
    border: 2px solid ${p => p.$error ? '#e53935' : '#e8e0d0'};
    border-radius: 12px;
    font-size: 15px;
    background: white;
    color: #1a1a1a;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;

    &:focus { border-color: #F4A435; }
    &::placeholder { color: #bbb; }

    /* 🔥 DESACTIVAR OJO NATIVO DEL NAVEGADOR */
    &::-ms-reveal,
    &::-ms-clear {
      display: none;
    }

    &::-webkit-contacts-auto-fill-button,
    &::-webkit-credentials-auto-fill-button {
      display: none;
    }

    &::-webkit-textfield-decoration-container {
      display: none;
    }
  }
`;

export const EyeButton = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: #bbb;

  &:hover { color: #F4A435; }
`;
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ── Layout ────────────────────────────────────────────────────────────────────
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #FFF8E7;
`;

export const Header = styled.div`
  background: linear-gradient(135deg, #eb4b3f, #f0945b);
  padding: 14px 16px;
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
  font-weight: 700;
  margin: 0;
`;

// ── Sección acordeón ──────────────────────────────────────────────────────────
// Buscá SectionHeader y agregá border-bottom:
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  background: ${({ $bg }) => $bg};
  border-bottom: 1.5px solid rgba(0, 0, 0, 0.25);  // ← agregá esta línea
`;

export const SectionTitle = styled.span`
  color: white;
  font-size: 15px;
  font-weight: 800;
`;

export const SectionChevron = styled.span`
  color: rgba(255,255,255,0.85);
  font-size: 18px;
  font-weight: 700;
  transition: transform 0.2s;
  transform: ${({ $open }) => $open ? 'rotate(90deg)' : 'rotate(0deg)'};
`;

export const SectionBody = styled.div`
  background: white;
  animation: ${slideUp} 0.18s ease;
  border-bottom: 1px solid rgba(0,0,0,0.06);
`;

// ── Search ────────────────────────────────────────────────────────────────────
export const SearchInputWrap = styled.div`
  padding: 10px 14px;
  background: white;
  border-bottom: 1px solid #F0EAD8;
`;

export const SearchInput = styled.input`
  width: 100%;
  border: 1.5px solid #E8C87A;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  background: #FFFDF5;
  color: #2C1A0E;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: #F4A435;
  }

  &::placeholder {
    color: #BBA880;
    font-weight: 400;
  }
`;

// ── Item genérico ─────────────────────────────────────────────────────────────
export const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  gap: 12px;
  border-bottom: 1px solid #F5EDD8;

  &:last-child {
    border-bottom: none;
  }
`;

// Avatar con inicial (solo para amigos ya aceptados)
export const FriendAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $color }) => $color || '#F4A435'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
`;

// Icono genérico sin foto (para resultados de búsqueda)
export const AnonymousIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px dashed #C0A870;
  background: #FFF8E7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #C0A870;
  font-size: 18px;
`;

export const ItemName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #2C1A0E;
  flex: 1;
`;

// ── Botones ───────────────────────────────────────────────────────────────────
export const BtnAdd = styled.button`
  background: linear-gradient(135deg, #3A7BD5, #2B5DA8);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s;

  &:active { opacity: 0.8; }
`;

export const TagSent = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #9A8060;
  background: #F0E8D0;
  border-radius: 6px;
  padding: 4px 10px;
`;

export const BtnDelete = styled.button`
  background: transparent;
  border: 1.5px solid #E63946;
  color: #E63946;
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #FFF0F0; }
`;

// Accept / Reject para solicitudes
export const BtnAccept = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #2E9E68;
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.15s;
  &:active { opacity: 0.8; }
`;

export const BtnReject = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #E63946;
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.15s;
  &:active { opacity: 0.8; }
`;

export const BtnGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

// ── Empty state ───────────────────────────────────────────────────────────────
export const EmptyText = styled.p`
  text-align: center;
  padding: 20px 16px;
  font-size: 13px;
  color: #BBA880;
  font-weight: 600;
`;

// ── Modal confirmar eliminar ──────────────────────────────────────────────────
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.15s ease;
`;

export const ModalBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px 20px;
  width: 260px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
`;

export const ModalTitle = styled.p`
  font-size: 15px;
  font-weight: 800;
  color: #2C1A0E;
  margin-bottom: 6px;
`;

export const ModalSub = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #9A7C5E;
  margin-bottom: 20px;
  line-height: 1.5;
`;

export const ModalBtns = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

export const BtnConfirmDelete = styled.button`
  background: #E63946;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 22px;
  font-size: 13px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;
  &:active { opacity: 0.8; }
`;

export const BtnCancelModal = styled.button`
  background: #F0EAD8;
  color: #5C4A2E;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #E8DCCA; }
`;
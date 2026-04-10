import styled from 'styled-components';
import typography from '../../../../styles/typography';
import spacing from '../../../../styles/spacing';

 
export const MediaContainer = styled.div`
  background: white;
  margin: 8px 0;
  padding: 16px;
`;
 
export const MediaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;
 
export const MediaTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #333;
`;
 
export const MediaCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;
 
export const MediaCountText = styled.span`
  font-size: 14px;
  color: #888;
`;
 
export const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
`;
 
export const MediaItem = styled.div`
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  background: #f0f0f0;
 
  &:hover {
    opacity: 0.85;
    transform: scale(1.02);
    transition: all 0.15s ease;
  }
`;
 
export const MediaThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;
 
export const EmptyMedia = styled.p`
  font-size: 13px;
  color: #aaa;
  margin: 0;
`;
 
/* — Lightbox — */
 
export const LightboxOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
 
export const LightboxImg = styled.img`
  max-width: 92vw;
  max-height: 88vh;
  object-fit: contain;
  border-radius: 8px;
`;
 
export const LightboxClose = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
 
  &:hover {
    background: rgba(255, 255, 255, 0.28);
  }
`;
import React, { useEffect, useRef } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import styled, { keyframes } from 'styled-components';

const flashRed = keyframes`
  0%, 100% { background-color: #E63946; }
  50%       { background-color: #b02030; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${flashRed} 0.8s ease-in-out infinite;
  padding: 32px;
`;

const Card = styled.div`
  background: rgba(0, 0, 0, 0.35);
  border-radius: 20px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 340px;
  width: 100%;
  animation: ${fadeIn} 0.3s ease;
`;

const AlertText = styled.p`
  color: white;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  line-height: 1.4;
  white-space: pre-line;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
`;

const OkButton = styled.button`
  margin-top: 8px;
  padding: 14px 48px;
  background: white;
  color: #E63946;
  font-size: 18px;
  font-weight: 800;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  letter-spacing: 1px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  transition: transform 0.1s;
  &:active { transform: scale(0.97); }
`;

function AlarmReceivedModal({ alert, groupName, onClose }) {
  const timerRef = useRef(null);

  // Sonido de alarma
  useEffect(() => {
  let ctx;
  let stopped = false;

  const playBeep = () => {
    if (stopped) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      // 3 beeps rápidos
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = 'square';
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.35 + 0.3);
        osc.start(ctx.currentTime + i * 0.35);
        osc.stop(ctx.currentTime + i * 0.35 + 0.3);
      }
    } catch (e) {}
  };

  // Tocar inmediatamente y repetir cada 2 segundos
  playBeep();
  const soundInterval = setInterval(playBeep, 2000);

  // Auto-cerrar a los 30 segundos
  timerRef.current = setTimeout(() => {
    stopped = true;
    clearInterval(soundInterval);
    onClose();
  }, 30000);

  return () => {
    stopped = true;
    clearInterval(soundInterval);
    clearTimeout(timerRef.current);
  };
}, [onClose]);

  const handleOk = () => {
    clearTimeout(timerRef.current);
    onClose();
  };

  return (
    <Overlay>
      <Card>
        <FiAlertTriangle size={120} color="white" strokeWidth={1.5} />
        <AlertText>
           ALERTA DE EMERGENCIA {'\n\n'}
          {alert?.reporter?.name
            ? `${alert.reporter.name} activó la alarma`
            : 'Alarma activada'}
          {groupName ? `\nen ${groupName}` : ''}
        </AlertText>
        <OkButton onClick={handleOk}>OK</OkButton>
      </Card>
    </Overlay>
  );
}

export default AlarmReceivedModal;
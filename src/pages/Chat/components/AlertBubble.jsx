import React from 'react';
import { FiAlertTriangle, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import {
  AlertContainer, AlertHeader, AlertLevelText,
  AlertTime, AlertDescription, AlertReporter
} from './AlertBubble.styled';

const LEVEL_CONFIG = {
  RED: { label: 'Emergencia', Icon: FiAlertTriangle },
  YELLOW: { label: 'Sospechoso', Icon: FiAlertCircle },
  GREEN: { label: 'Zona despejada', Icon: FiCheckCircle }
};

function AlertBubble({ alert }) {
  const config = LEVEL_CONFIG[alert.level] || LEVEL_CONFIG.RED;
  const { label, Icon } = config;

  const formatTime = (createdAt) => {
  const date = new Date(createdAt);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

  return (
    <AlertContainer level={alert.level}>
      <AlertHeader>
        <AlertLevelText level={alert.level}>
          <Icon size={14} />
          {label}
        </AlertLevelText>
        <AlertTime>{formatTime(alert.createdAt)}</AlertTime>
      </AlertHeader>
      <AlertDescription>{alert.description}</AlertDescription>
      <AlertReporter>Reportado por {alert.reporter?.name}</AlertReporter>
    </AlertContainer>
  );
}

export default AlertBubble;
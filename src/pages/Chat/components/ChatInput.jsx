import React, { useRef } from 'react';
import { FiCamera, FiAlertTriangle, FiX } from 'react-icons/fi'; // ← quitar FiPaperclip
import { TbComet } from 'react-icons/tb';
import { Icon } from '../../../components/Button/Button';
import {
  InputContainer, InputActions, TextArea, SendButton,
  ImagePreviewWrapper, ImagePreview, RemovePreviewBtn, ErrorToast
} from './ChatInput.styled';
import { useLanguage } from '../../../i18n/LanguageContext';

function ChatInput({ text, onChange, onSend, onKeyPress, onAlarm, onAlert, onSendImage }) {
  const { t } = useLanguage();
  const hasText = text.trim().length > 0;
  const cameraRef = useRef(null);
  const [preview, setPreview] = React.useState(null);
  const [previewBase64, setPreviewBase64] = React.useState(null);
  const [error, setError] = React.useState('');
  const [errorVisible, setErrorVisible] = React.useState(false);

  const showError = (msg) => {
    setError(msg);
    setErrorVisible(true);
    setTimeout(() => setErrorVisible(false), 3000);
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showError(t('onlyImages') || 'Solo se permiten imágenes');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 800;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        setPreview(compressed);
        setPreviewBase64(compressed);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCameraChange = (e) => {
    handleFile(e.target.files[0]);
    e.target.value = '';
  };

  const handleSendImage = () => {
    if (!previewBase64) return;
    const base64Data = previewBase64.includes(',')
      ? previewBase64.split(',')[1]
      : previewBase64;
    onSendImage(base64Data);
    setTimeout(() => {
      setPreview(null);
      setPreviewBase64(null);
    }, 300);
  };

  const handleSend = () => {
    if (preview) handleSendImage();
    else onSend();
  };

  return (
    <InputContainer>
      <ErrorToast $visible={errorVisible}>⚠️ {error}</ErrorToast>

      {preview && (
        <ImagePreviewWrapper>
          <ImagePreview src={preview} alt="preview" />
          <RemovePreviewBtn onClick={() => { setPreview(null); setPreviewBase64(null); }}>
            <FiX size={16} color="white" />
          </RemovePreviewBtn>
        </ImagePreviewWrapper>
      )}

      <InputActions>
        {/* Solo cámara y alarma */}
        <Icon onClick={() => cameraRef.current.click()}>
          <FiCamera size={22} color="#888" />
        </Icon>
        <Icon onClick={onAlarm}>
          <FiAlertTriangle size={22} color="#eb4b3f" />
        </Icon>
      </InputActions>

      <TextArea
        placeholder={t('messagePlaceholder')}
        value={text}
        onChange={onChange}
        onKeyPress={onKeyPress}
        rows={1}
      />

      {(hasText || preview) && (
        <SendButton onClick={handleSend}>
          <TbComet size={22} />
        </SendButton>
      )}

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleCameraChange}
      />
    </InputContainer>
  );
}

export default ChatInput;
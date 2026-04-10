import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { FiArrowLeft, FiCamera, FiEdit2 } from 'react-icons/fi';
import { Icon } from '../../components/Button/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import { updateUserPhoto, updateUserName } from '../../services/api';
import {
  Container, Header, HeaderTitle,
  PhotoSection, PhotoWrapper, ProfilePhoto, PhotoInitial,
  EditPhotoButton, EditBadge,
  InfoSection, InfoItem, InfoLabel, InfoValue,
  InfoEditRow, EditInput, SaveBtn, CancelBtn,
  Toast, ModalOverlay, ModalSheet,
  ModalOption, ModalDivider, ModalCancel,
  CropperOverlay, CropperContainer, CropperActions,
  CropBtn, CropCancelBtn, CropperTitle
} from './ProfilePage.styled';

// ── Utilidad: recortar imagen con canvas ──────────────────────────────────────
async function getCroppedImg(imageSrc, croppedAreaPixels) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  const SIZE = 400;
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0, 0, SIZE, SIZE
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    }, 'image/jpeg', 0.85);
  });
}

// ── Componente ──────────────────────────────────────────────────────────────
function ProfilePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const userId   = parseInt(localStorage.getItem('userId'));
  const userAnimalId = localStorage.getItem('userAnimalId') || '';   // ← ej: "fox@5334"
  const [name,  setName]  = useState(localStorage.getItem('userName') || '');
  const [photo, setPhoto] = useState(localStorage.getItem('userPhoto') || '');

  const [editingName, setEditingName] = useState(false);
  const [nameInput,   setNameInput]   = useState(name);
  const [toast,       setToast]       = useState('');
  const [showModal,   setShowModal]   = useState(false);
  const [saving,      setSaving]      = useState(false);

  // Cropper state
  const [rawImage,          setRawImage]          = useState(null);
  const [showCropper,       setShowCropper]       = useState(false);
  const [crop,              setCrop]              = useState({ x: 0, y: 0 });
  const [zoom,              setZoom]              = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // ── helpers ──
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // ── foto: abrir archivo ──
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawImage(ev.target.result);
      setShowModal(false);
      setShowCropper(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  // ── foto: confirmar recorte ──
  const handleCropConfirm = async () => {
    try {
      setSaving(true);
      const croppedBlob = await getCroppedImg(rawImage, croppedAreaPixels);

      const response = await fetch(croppedBlob);
      const blob = await response.blob();
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });

      await updateUserPhoto(userId, base64);
      setPhoto(base64);
      localStorage.setItem('userPhoto', base64);
      setShowCropper(false);
      setRawImage(null);
      showToast(t('photoUpdated'));
    } catch {
      showToast('Error al guardar la foto');
    } finally {
      setSaving(false);
    }
  };

  // ── foto: eliminar ──
  const handleRemovePhoto = async () => {
    try {
      setSaving(true);
      await updateUserPhoto(userId, '');
      setPhoto('');
      localStorage.removeItem('userPhoto');
      showToast(t('photoRemoved'));
    } catch {
      showToast('Error al eliminar foto');
    } finally {
      setSaving(false);
      setShowModal(false);
    }
  };

  // ── nombre ──
  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    try {
      setSaving(true);
      await updateUserName(userId, nameInput.trim());
      setName(nameInput.trim());
      localStorage.setItem('userName', nameInput.trim());
      setEditingName(false);
      showToast(t('save'));
    } catch {
      showToast('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const initial = name.charAt(0).toUpperCase();

  return (
    <Container>
      <Header>
        <Icon onClick={() => navigate('/settings')}>
          <FiArrowLeft size={22} color="white" />
        </Icon>
        <HeaderTitle>{t('editProfile')}</HeaderTitle>
      </Header>

      {/* ── FOTO ── */}
      <PhotoSection>
        <PhotoWrapper onClick={() => setShowModal(true)}>
          {photo
            ? <ProfilePhoto src={photo} alt="avatar" />
            : <PhotoInitial>{initial}</PhotoInitial>
          }
          <EditPhotoButton>
            <FiCamera size={16} color="#F4A435" />
            <EditBadge>{t('editPhoto')}</EditBadge>
          </EditPhotoButton>
        </PhotoWrapper>
      </PhotoSection>

      {/* ── INFO ── */}
      <InfoSection>

        {/* NOMBRE */}
        <InfoItem>
          <InfoLabel>{t('name')}</InfoLabel>
          {editingName ? (
            <InfoEditRow>
              <EditInput
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                autoFocus
                maxLength={40}
              />
              <SaveBtn onClick={handleSaveName} disabled={saving}>{t('save')}</SaveBtn>
              <CancelBtn onClick={() => { setEditingName(false); setNameInput(name); }}>
                {t('cancel')}
              </CancelBtn>
            </InfoEditRow>
          ) : (
            <InfoEditRow>
              <InfoValue>{name}</InfoValue>
              <Icon onClick={() => setEditingName(true)}>
                <FiEdit2 size={18} color="#BBB" />
              </Icon>
            </InfoEditRow>
          )}
        </InfoItem>

        {/* ID — reemplaza Teléfono, solo lectura */}
        <InfoItem>
          <InfoLabel>ID</InfoLabel>
          <InfoEditRow>
            <InfoValue style={{ color: '#E8841A', fontWeight: 700 }}>
              {userAnimalId}
            </InfoValue>
          </InfoEditRow>
        </InfoItem>

      </InfoSection>

      {/* ── MODAL FOTO ── */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalSheet onClick={e => e.stopPropagation()}>
            <ModalOption onClick={() => fileRef.current.click()}>
              <FiCamera size={20} color="#F4A435" />
              {t('changePhoto')}
            </ModalOption>
            {photo && (
              <>
                <ModalDivider />
                <ModalOption $danger onClick={handleRemovePhoto}>
                  {t('removePhoto')}
                </ModalOption>
              </>
            )}
            <ModalDivider />
            <ModalCancel onClick={() => setShowModal(false)}>
              {t('cancel')}
            </ModalCancel>
          </ModalSheet>
        </ModalOverlay>
      )}

      {/* ── CROPPER ── */}
      {showCropper && (
        <CropperOverlay>
          <CropperTitle>Mueve y ajusta la foto</CropperTitle>

          <CropperContainer>
            <Cropper
              image={rawImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </CropperContainer>

          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            style={{
              width: '60%',
              margin: '16px auto 0',
              display: 'block',
              accentColor: '#F4A435'
            }}
          />

          <CropperActions>
            <CropCancelBtn onClick={() => { setShowCropper(false); setRawImage(null); }}>
              {t('cancel')}
            </CropCancelBtn>
            <CropBtn onClick={handleCropConfirm} disabled={saving}>
              {saving ? 'Guardando...' : 'Usar foto'}
            </CropBtn>
          </CropperActions>
        </CropperOverlay>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {toast && <Toast>{toast}</Toast>}
    </Container>
  );
}

export default ProfilePage;
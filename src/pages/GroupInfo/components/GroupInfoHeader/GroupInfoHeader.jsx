import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { FiArrowLeft, FiCheck, FiX, FiCamera } from 'react-icons/fi';
import { Icon } from '../../../../components/Button/Button';
import { updateGroupDescription, updateGroupName, updateGroupPhoto, sendMessage } from '../../../../services/api';
import { useLanguage } from '../../../../i18n/LanguageContext';
import {
  HeaderContainer, TopBar, GroupName, GroupType,
  GroupDescription, AddDescription, CreatedBy, LargeAvatar,
  AvatarWrapper, AvatarEditBadge,
  CropperOverlay, CropperContainer, CropperTitle,
  CropperActions, CropBtn, CropCancelBtn,
  ModalOverlay, ModalSheet, ModalOption, ModalDivider, ModalCancel
} from './GroupInfoHeader.styled';

const COLORS = [
  '#F4A435', '#E8841A', '#FF6B6B',
  '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD'
];

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
    croppedAreaPixels.x, croppedAreaPixels.y,
    croppedAreaPixels.width, croppedAreaPixels.height,
    0, 0, SIZE, SIZE
  );
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(URL.createObjectURL(blob)), 'image/jpeg', 0.85);
  });
}

function GroupInfoHeader({ group, currentUserId, isFormer, onGroupUpdated, canEditInfo }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const fileRef = useRef(null);

  // ── TODOS los hooks primero, sin excepción ──
  const [editingDesc, setEditingDesc]   = useState(false);
  const [descValue,   setDescValue]     = useState('');
  const [editingName, setEditingName]   = useState(false);
  const [nameValue,   setNameValue]     = useState('');
  const [groupPhoto,  setGroupPhoto]    = useState(group?.groupPhoto || '');
  const [showModal,   setShowModal]     = useState(false);
  const [rawImage,    setRawImage]      = useState(null);
  const [showCropper, setShowCropper]   = useState(false);
  const [crop,        setCrop]          = useState({ x: 0, y: 0 });
  const [zoom,        setZoom]          = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving,      setSaving]        = useState(false);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  React.useEffect(() => {
    setGroupPhoto(group?.groupPhoto || '');
  }, [group?.groupPhoto]);

  // ── Ahora sí el guard ──
  if (!group) return null;

  const avatarColor = COLORS[(group.id || 0) % COLORS.length];
  const isAdmin = group.admin?.id === currentUserId;
  const adminName = group.admin?.id === currentUserId ? t('you') : group.admin?.name;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString([], {
      year: 'numeric', month: 'numeric', day: 'numeric'
    });
  };

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

  const handleCropConfirm = async () => {
    try {
      setSaving(true);
      const blobUrl = await getCroppedImg(rawImage, croppedAreaPixels);
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      await updateGroupPhoto(group.id, base64);
      setGroupPhoto(base64);
      setShowCropper(false);
      setRawImage(null);
      if (onGroupUpdated) await onGroupUpdated();
    } catch {
      alert('Error al guardar la foto');
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setSaving(true);
      await updateGroupPhoto(group.id, '');
      setGroupPhoto('');
      setShowModal(false);
      if (onGroupUpdated) await onGroupUpdated();
    } catch {
      alert('Error al eliminar foto');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDesc = async () => {
    try {
      await updateGroupDescription(group.id, descValue);
      await sendMessage({
        content: '__GROUP_UPDATED__',
        type: 'SYSTEM',
        senderId: null,
        groupId: group.id
      });
      setEditingDesc(false);
      if (onGroupUpdated) await onGroupUpdated();
    } catch (err) { console.error(err); }
  };

  const handleSaveName = async () => {
    try {
      await updateGroupName(group.id, nameValue);
      await sendMessage({
        content: '__GROUP_UPDATED__',
        type: 'SYSTEM',
        senderId: null,
        groupId: group.id
      });
      setEditingName(false);
      if (onGroupUpdated) await onGroupUpdated();
    } catch (err) { console.error(err); }
  };

  return (
    <HeaderContainer>
      <TopBar>
        <Icon onClick={() => navigate(-1)}>
          <FiArrowLeft size={22} color="#1A1A1A" />
        </Icon>
      </TopBar>

      <AvatarWrapper
        onClick={!isFormer && canEditInfo ? () => setShowModal(true) : undefined}
        $clickable={!isFormer && canEditInfo}
      >
        {groupPhoto
          ? <img src={groupPhoto} alt="group"
              style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover' }} />
          : <LargeAvatar color={avatarColor}>
              {group.name?.charAt(0).toUpperCase()}
            </LargeAvatar>
        }
        {!isFormer && canEditInfo && (
          <AvatarEditBadge>
            <FiCamera size={14} color="white" />
          </AvatarEditBadge>
        )}
      </AvatarWrapper>

      {editingName ? (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <input
            style={{
              width: '80%', padding: '10px 14px', textAlign: 'center',
              border: '1.5px solid #FFE0A0', borderRadius: '10px',
              fontSize: '20px', fontWeight: 'bold', outline: 'none'
            }}
            value={nameValue}
            onChange={e => setNameValue(e.target.value)}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <Icon onClick={() => setEditingName(false)}><FiX size={20} color="#888" /></Icon>
            <Icon onClick={handleSaveName}><FiCheck size={20} color="#F4A435" /></Icon>
          </div>
        </div>
      ) : (
        <GroupName
          onClick={!isFormer && canEditInfo ? () => { setNameValue(group.name || ''); setEditingName(true); } : undefined}
          style={{ cursor: !isFormer && isAdmin ? 'pointer' : 'default' }}
        >
          {group.name}
        </GroupName>
      )}

      <GroupType>
        {t('group')} · {group.memberCount || 0} {t('members')}
      </GroupType>

      {editingDesc ? (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            style={{
              width: '100%', padding: '10px 14px',
              border: '1.5px solid #FFE0A0', borderRadius: '10px',
              fontSize: '14px', outline: 'none', fontFamily: 'inherit'
            }}
            value={descValue}
            onChange={e => setDescValue(e.target.value)}
            placeholder={t('addDescription')}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Icon onClick={() => setEditingDesc(false)}><FiX size={20} color="#888" /></Icon>
            <Icon onClick={handleSaveDesc}><FiCheck size={20} color="#F4A435" /></Icon>
          </div>
        </div>
      ) : group.description ? (
        <GroupDescription
          onClick={!isFormer && canEditInfo ? () => { setDescValue(group.description || ''); setEditingDesc(true); } : undefined}
          style={{ cursor: !isFormer && isAdmin ? 'pointer' : 'default' }}
        >
          {group.description}
        </GroupDescription>
      ) : !isFormer && canEditInfo ? (
        <AddDescription onClick={() => { setDescValue(''); setEditingDesc(true); }}>
          {t('addDescription')}
        </AddDescription>
      ) : null}


      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalSheet onClick={e => e.stopPropagation()}>
            <ModalOption onClick={() => fileRef.current.click()}>
              <FiCamera size={20} color="#F4A435" />
              {t('changePhoto')}
            </ModalOption>
            {groupPhoto && (
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
            type="range" min={1} max={3} step={0.01} value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            style={{ width: '60%', margin: '16px auto 0', display: 'block', accentColor: '#F4A435' }}
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
    </HeaderContainer>
  );
}

export default GroupInfoHeader;